"use client";

import Link from "next/link";
import { Camera, Grid3x3, ImageIcon, Info, KeyRound, Maximize2, Minus, Plus, Upload } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import sample from "@/data/sample-face.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AGE_NOTE, ARTWORK_CAPTION, DROP_FORMATS, DROP_LEAD_FINE, DROP_LEAD_TOUCH, FREE_LINE, HOME_LEAD, HOME_TITLE, PHOTO_TIP, PRIVACY_NOTE } from "@/lib/copy";
import { PhotoReadError, readPhotoFile } from "@/lib/decode-image";
import { measureAll, referenceGrid, type LandmarkMap } from "@/lib/geometry";
import { AGE_STORAGE_KEY, readLicense, subscribeLicense } from "@/lib/license";
import { placementLandmarks } from "@/lib/landmarks";
import { DEFAULT_WINDOW_ID, type WindowId } from "@/lib/measurements";
import { price, UNLOCK_NAME } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { ResultsPanel } from "./ResultsPanel";

type PhotoState = {
  url: string;
  width: number;
  height: number;
  hadAlpha: boolean;
  name: string;
  kind: "sample" | "upload";
};

function LockIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 15"
      width={size}
      height={size}
      className="block shrink-0"
      style={{ width: size, height: size }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6.5" width="9" height="6.25" rx="1" />
      <path d="M5 6.5V4.75a2.5 2.5 0 0 1 5 0V6.5" />
    </svg>
  );
}

const trust = [
  { icon: LockIcon, label: "Photos stay in your browser" },
  { icon: Grid3x3, label: "No scores or rankings" },
  { icon: ImageIcon, label: "Free watermarked preview" },
  { icon: KeyRound, label: `One-time unlock, ${price.label}` },
];

export function MeasureApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<PhotoState | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pending = useRef<(() => void) | null>(null);
  const dragId = useRef<string | null>(null);
  const [photo, setPhoto] = useState<PhotoState | null>(null);
  const [landmarks, setLandmarks] = useState<LandmarkMap>({});
  const [skipped, setSkipped] = useState<string[]>([]);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [windowId, setWindowId] = useState<WindowId>(DEFAULT_WINDOW_ID);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [fitScale, setFitScale] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [ageOpen, setAgeOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const license = useSyncExternalStore(subscribeLicense, readLicense, () => null);
  const [dragOver, setDragOver] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const element = stageRef.current;
    if (!element || !photo) return;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const next = Math.min(rect.width / photo.width, rect.height / photo.height);
      setFitScale(next > 0 && Number.isFinite(next) ? next : 1);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [photo]);

  useEffect(() => {
    if (!cameraOpen) return;
    let cancelled = false;
    const request = navigator.mediaDevices?.getUserMedia
      ? navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
      : Promise.reject(new Error("camera"));
    request
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCameraError("The camera is unavailable. You can upload a photo instead."));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [cameraOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!selected || !photo) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) return;
      const step = event.shiftKey ? 10 : 1;
      const delta =
        event.key === "ArrowLeft"
          ? { x: -step, y: 0 }
          : event.key === "ArrowRight"
            ? { x: step, y: 0 }
            : event.key === "ArrowUp"
              ? { x: 0, y: -step }
              : event.key === "ArrowDown"
                ? { x: 0, y: step }
                : null;
      if (!delta) return;
      event.preventDefault();
      setLandmarks((current) => {
        const point = current[selected];
        if (!point) return current;
        return {
          ...current,
          [selected]: {
            x: Math.min(photo.width, Math.max(0, point.x + delta.x)),
            y: Math.min(photo.height, Math.max(0, point.y + delta.y)),
          },
        };
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, selected]);

  function commitPhoto(next: PhotoState | null) {
    const previous = photoRef.current;
    if (previous?.url.startsWith("blob:")) URL.revokeObjectURL(previous.url);
    photoRef.current = next;
    setPhoto(next);
    setZoom("fit");
    setError(null);
  }

  function ensureAge(action: () => void) {
    if (window.localStorage.getItem(AGE_STORAGE_KEY) === "yes") {
      action();
      return;
    }
    pending.current = action;
    setAgeOpen(true);
  }

  async function acceptFile(file: File, source: "upload" | "camera" = "upload") {
    setBusy(file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif") ? "Decoding HEIC in this browser…" : "Reading photo…");
    setError(null);
    try {
      const decoded = await readPhotoFile(file);
      const url = URL.createObjectURL(decoded.blob);
      commitPhoto({
        url,
        width: decoded.width,
        height: decoded.height,
        hadAlpha: decoded.hadAlpha,
        name: file.name,
        kind: "upload",
      });
      setLandmarks({});
      setSkipped([]);
      setSelected(placementLandmarks[0]?.id ?? null);
      setMouthOpen(false);
      track({ name: "photo_added", source });
    } catch (caught) {
      setError(caught instanceof PhotoReadError ? caught.message : "That image could not be read.");
    } finally {
      setBusy(null);
    }
  }

  function openSample() {
    ensureAge(() => {
      commitPhoto({
        url: sample.src,
        width: sample.width,
        height: sample.height,
        hadAlpha: true,
        name: "sample-face.png",
        kind: "sample",
      });
      setLandmarks(sample.landmarks);
      setSkipped([]);
      setSelected(null);
      setMouthOpen(false);
      setShowGrid(true);
      track({ name: "photo_added", source: "sample" });
    });
  }

  function pointerToImage(event: React.PointerEvent<SVGSVGElement>) {
    if (!photo) return { x: 0, y: 0 };
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(photo.width, Math.max(0, ((event.clientX - rect.left) / rect.width) * photo.width)),
      y: Math.min(photo.height, Math.max(0, ((event.clientY - rect.top) / rect.height) * photo.height)),
    };
  }

  const nextLandmark = placementLandmarks.find((landmark) => !landmarks[landmark.id] && !skipped.includes(landmark.id));
  const scale = zoom === "fit" ? fitScale : zoom;
  const rows = photo ? measureAll(landmarks, windowId, mouthOpen) : [];
  const lines = photo && showGrid ? referenceGrid(landmarks, windowId) : [];

  async function exportPng(kind: "preview" | "hd") {
    if (!photo) return;
    const { renderMeasurementPng, downloadBlob } = await import("@/lib/export-png");
    const blob = await renderMeasurementPng(photo.url, {
      landmarks,
      windowId,
      showGrid,
      watermark: kind === "preview",
      maxEdge: kind === "preview" ? 1600 : null,
    });
    downloadBlob(blob, kind === "preview" ? "phiratio-preview.png" : "phiratio-hd.png");
    track({ name: kind === "preview" ? "export_preview" : "export_hd" });
  }

  async function exportPdf() {
    const { buildReportPdf } = await import("@/lib/export-pdf");
    const { downloadBlob } = await import("@/lib/export-png");
    const blob = await buildReportPdf({ windowId, rows, mouthOpen });
    downloadBlob(blob, "phiratio-report.pdf");
    track({ name: "export_pdf" });
  }

  async function captureCamera() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setCameraError("The camera has not produced a frame yet.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) {
      setCameraError("The camera frame could not be saved.");
      return;
    }
    setCameraOpen(false);
    await acceptFile(new File([blob], "camera.jpg", { type: "image/jpeg" }), "camera");
  }

  return (
    <>
      {photo ? (
        <section className="mx-auto max-w-[1120px] px-4 py-8 min-[900px]:px-12 min-[900px]:py-12">
          <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.05] text-ink">{HOME_TITLE}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{HOME_LEAD}</p>
          <p className="mt-4 font-semibold text-ink">{FREE_LINE}</p>
          <p className="mt-6 flex items-start gap-2 rounded-xl bg-[#e9e3d6] px-4 py-3 text-sm leading-6 text-ink">
            <Info className="mt-0.5 shrink-0" aria-hidden="true" size={18} />
            {PHOTO_TIP}
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex flex-wrap items-center gap-3 border-b border-line px-3 py-3 text-sm">
              <span className="font-semibold tracking-[0.14em] text-muted">VIEW</span>
              <button type="button" aria-label="Zoom out" className="rounded p-1 hover:bg-[#f3f0e8]" onClick={() => setZoom(Math.max(0.1, (zoom === "fit" ? fitScale : zoom) / 1.25))}>
                <Minus size={16} />
              </button>
              <button type="button" className="min-w-14 tabular-nums" onClick={() => setZoom(1)} aria-label="Zoom to 100 percent">
                {Math.round(scale * 100)}%
              </button>
              <button type="button" aria-label="Zoom in" className="rounded p-1 hover:bg-[#f3f0e8]" onClick={() => setZoom(Math.min(4, (zoom === "fit" ? fitScale : zoom) * 1.25))}>
                <Plus size={16} />
              </button>
              <button type="button" aria-label="Fit the photo" className="rounded p-1 hover:bg-[#f3f0e8]" onClick={() => setZoom("fit")}>
                <Maximize2 size={16} />
              </button>
              <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
              <button
                type="button"
                aria-pressed={showGrid}
                className={`inline-flex items-center gap-2 rounded-md px-2 py-1 font-semibold tracking-[0.08em] ${showGrid ? "bg-[#f3e6c4] text-ink" : "text-muted"}`}
                onClick={() => setShowGrid((value) => !value)}
              >
                <Grid3x3 size={16} aria-hidden="true" />
                SHOW REFERENCE GRID
              </button>
              <button type="button" className="ml-auto text-link underline underline-offset-4" onClick={() => commitPhoto(null)}>
                Remove photo
              </button>
            </div>
            <div className="grid min-[960px]:grid-cols-[minmax(0,1fr)_22rem]">
              <div ref={stageRef} className="relative h-[28rem] overflow-auto bg-[#efeae0] min-[960px]:h-[40rem]" style={{ backgroundImage: "linear-gradient(to right, rgba(36,31,24,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(36,31,24,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
                <div className="relative" style={{ width: photo.width * scale, height: photo.height * scale }}>
                  {/* User and sample images are local blobs or same-origin artwork. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.kind === "sample" ? "Constructed reference diagram of a face" : "Photo being measured"} className="absolute inset-0 h-full w-full" draggable={false} />
                  <svg
                    viewBox={`0 0 ${photo.width} ${photo.height}`}
                    className="absolute inset-0 h-full w-full touch-none"
                    onPointerMove={(event) => {
                      if (!dragId.current) return;
                      const point = pointerToImage(event);
                      const id = dragId.current;
                      setLandmarks((current) => ({ ...current, [id]: point }));
                    }}
                    onPointerUp={() => {
                      dragId.current = null;
                    }}
                    onPointerDown={(event) => {
                      if ((event.target as SVGElement).dataset.point) return;
                      const id = selected && !landmarks[selected] ? selected : nextLandmark?.id;
                      if (!id) return;
                      const point = pointerToImage(event);
                      setLandmarks((current) => ({ ...current, [id]: point }));
                      setSelected(id);
                    }}
                  >
                    {lines.map((line, index) => (
                      <line key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#745812" strokeWidth={Math.max(1.5, photo.width / 500)} />
                    ))}
                    {placementLandmarks.map((landmark) => {
                      const point = landmarks[landmark.id];
                      if (!point) return null;
                      const active = selected === landmark.id;
                      return (
                        <circle
                          key={landmark.id}
                          data-point={landmark.id}
                          cx={point.x}
                          cy={point.y}
                          r={active ? photo.width / 90 : photo.width / 120}
                          fill="#fffdf8"
                          stroke={active ? "#745812" : "#241f18"}
                          strokeWidth={photo.width / 400}
                          role="button"
                          aria-label={landmark.label}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            dragId.current = landmark.id;
                            setSelected(landmark.id);
                            (event.currentTarget as SVGCircleElement).setPointerCapture(event.pointerId);
                          }}
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
              <div className="border-t border-line p-4 min-[960px]:border-l min-[960px]:border-t-0 min-[960px]:p-5">
                {nextLandmark ? (
                  <p className="mb-4 text-sm leading-6 text-ink">
                    Click the photo to place: <span className="font-semibold">{nextLandmark.label}</span>. {nextLandmark.hint}
                    {!nextLandmark.required ? (
                      <button type="button" className="ml-2 text-link underline underline-offset-4" onClick={() => setSkipped((current) => [...current, nextLandmark.id])}>
                        Skip
                      </button>
                    ) : null}
                  </p>
                ) : (
                  <p className="mb-4 text-sm leading-6 text-muted">Drag a point to adjust it. Arrow keys nudge the selected point.</p>
                )}
                <ResultsPanel rows={rows} windowId={windowId} onWindow={setWindowId} mouthOpen={mouthOpen} onMouth={setMouthOpen} />
                <div className="mt-5 grid gap-3">
                  <Button variant="outline" onClick={() => exportPng("preview")}>
                    Export a preview with watermark
                  </Button>
                  {license ? (
                    <>
                      <p className="text-sm text-ink">Full export is unlocked on this browser.</p>
                      <Button onClick={() => exportPng("hd")}>Download HD PNG{photo.hadAlpha ? " (alpha kept)" : ""}</Button>
                      <Button variant="outline" onClick={exportPdf}>
                        Download PDF report
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/pricing/" className="inline-flex h-12 items-center justify-center rounded-lg bg-gold px-4 text-[15px] font-semibold text-gold-ink">
                        {UNLOCK_NAME}
                      </Link>
                      <p className="text-sm leading-6 text-muted">High-resolution export and the PDF report are part of the one-time unlock.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {photo.kind === "sample" ? <p className="mt-3 text-sm text-muted">{ARTWORK_CAPTION}</p> : null}
        </section>
      ) : (
        <section className="mx-auto grid max-w-[1120px] gap-10 px-4 py-10 min-[900px]:px-12 min-[960px]:grid-cols-2 min-[960px]:py-20">
          <div>
            <h1 className="text-[clamp(2.7rem,5vw,4rem)] leading-[1.02] text-ink">{HOME_TITLE}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{HOME_LEAD}</p>
            <p className="mt-5 font-semibold text-ink">{FREE_LINE}</p>
            <p className="mt-5 hidden min-[960px]:block">
              <Link href="/templates/" className="text-link underline underline-offset-4">
                Download free templates
              </Link>
            </p>
          </div>
          <div>
            <div
              className={`rounded-2xl border border-dashed px-5 py-8 text-center min-[960px]:px-8 min-[960px]:py-10 ${dragOver ? "border-gold bg-[#f7f1e2]" : "border-[#c9c2b4] bg-[#f7f4ee]"}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                const file = event.dataTransfer.files?.[0];
                if (file) ensureAge(() => void acceptFile(file));
              }}
            >
              <Upload className="mx-auto hidden text-muted min-[960px]:block" aria-hidden="true" />
              <p className="mt-3 hidden text-lg font-semibold text-ink min-[960px]:block">Add a photo to start measuring.</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted min-[960px]:text-base">
                <span className="drop-lead-fine">{DROP_LEAD_FINE} </span>
                <span className="drop-lead-touch">{DROP_LEAD_TOUCH} </span>
                {DROP_FORMATS}
              </p>
              <div className="mt-6 grid gap-3">
                <Button disabled={Boolean(busy)} onClick={() => ensureAge(() => inputRef.current?.click())}>
                  <Upload size={18} aria-hidden="true" /> Upload a photo to measure
                </Button>
                <div className="grid gap-3 min-[960px]:grid-cols-2">
                  <Button variant="outline" disabled={Boolean(busy)} onClick={() => ensureAge(() => { setCameraError(null); setCameraOpen(true); })}>
                    <Camera size={18} aria-hidden="true" /> Use your camera
                  </Button>
                  <Button variant="outline" disabled={Boolean(busy)} onClick={openSample}>
                    <ImageIcon size={18} aria-hidden="true" /> Try a sample photo
                  </Button>
                </div>
              </div>
              <input
                ref={inputRef}
                data-testid="photo-input"
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif,.jpg,.jpeg,.png,.webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void acceptFile(file);
                }}
              />
              {busy ? <p className="mt-4 text-sm text-ink">{busy}</p> : null}
              {error ? (
                <p className="mt-4 text-sm text-[#6e3a2a]" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm leading-6 text-muted">
              <LockIcon size={16} />
              {PRIVACY_NOTE}
            </p>
            <p className="mt-3 text-sm text-ink">{AGE_NOTE}</p>
            <p className="mt-3 min-[960px]:hidden">
              <Link href="/templates/" className="text-link underline underline-offset-4">
                Download free templates
              </Link>
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 border-t border-line pt-6 text-sm text-muted min-[721px]:grid-cols-2 min-[960px]:col-span-2 min-[960px]:grid-cols-4">
            {trust.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-center justify-center gap-2 whitespace-nowrap text-center">
                  <Icon size={15} aria-hidden="true" />
                  {item.label}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <Dialog open={ageOpen} onOpenChange={(open) => { if (!open) { setAgeOpen(false); pending.current = null; } }}>
        <DialogContent>
          <DialogTitle className="text-3xl text-ink">This tool is for people 18 or older</DialogTitle>
          <DialogDescription className="mt-3 leading-7 text-muted">
            PhiRatio measures a photo only after you confirm that you are 18 or older.
          </DialogDescription>
          <div className="mt-6 grid gap-3">
            <Button
              onClick={() => {
                window.localStorage.setItem(AGE_STORAGE_KEY, "yes");
                setAgeOpen(false);
                const action = pending.current;
                pending.current = null;
                action?.();
              }}
            >
              I am 18 or older
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                pending.current = null;
                setAgeOpen(false);
              }}
            >
              Go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent>
          <DialogTitle className="text-3xl text-ink">Use your camera</DialogTitle>
          <DialogDescription className="mt-3 leading-7 text-muted">
            The picture stays in this browser. Nothing is sent to a server.
          </DialogDescription>
          <video ref={videoRef} autoPlay playsInline muted className="mt-4 aspect-[4/3] w-full rounded-lg bg-[#241f18]" />
          {cameraError ? <p className="mt-3 text-sm text-[#6e3a2a]">{cameraError}</p> : null}
          <div className="mt-4 grid gap-3">
            <Button onClick={() => void captureCamera()}>Capture photo</Button>
            <Button variant="outline" onClick={() => setCameraOpen(false)}>
              Go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
