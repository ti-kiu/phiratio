# PhiRatio measurement specification v1

**Status:** Locked for QA and frontend — 18 November 2026 (Asia/Shanghai).  
**Canonical machine-readable source:** `/workspace/golden-ratio-face/data/measurements.v1.json`. The UI, PDF report, and FAQ must read names, groups, window references, and the VFO constant from that file. This markdown document is the human-readable specification.

On 18 November 2026 the owner accepted, with conditions:

- the 11-row list plus the thirds-and-fifths overlay as v1 (12 modules);
- deferring the jawline-contour window;
- the visible-window reference of about 1.23 for row 2, **provided it is labeled a derived design reference** and both rows 1 and 2 are driven by one named constant;
- the three UI families (Golden ratio, Thirds and fifths, Symmetry);
- the symmetry rules in §5 (roll correction, photo-left / photo-right, yaw tip);
- no “normal range” band unless a source is added later;
- page wording is only “this site’s design reference” — no “according to,” no paper, no third-party mask.

**Row 5 was confirmed and locked** on 18 November 2026: numerator stomion → menton, denominator subnasale → stomion, reference 1.618 labeled Golden ratio reference, distinct from a classic thirds-style split of about 2.0. Two implementation notes in §8.13 do not block the lock and must be implemented in the frontend.

---

## 1. What this document is, and is not

This is a PhiRatio construction for a design-reference tool. It is not a beauty standard, a medical standard, a claim about attractiveness, or a third-party mask (including Marquardt).

Do not attribute any value on the site to a paper, a researcher, or a named mask. The owner has not verified literature sources for these rows. Never write “according to.”

**Honesty about 1.38.** The visible-window length/width reference of about 1.38 first entered the PRD from a competitor page. A number is not protected by copyright. This specification does not pretend that figure was invented here. It now defines 1.38 from a named constant (see §3) so the construction is internal, both related rows stay consistent, and a later change happens in one place.

---

## 2. Purpose and wording

The tool compares length-to-length measurements on a front-facing photo with a stated design reference, and shows the difference from that reference. It does not combine rows into a score, rank, or percentile.

Always show, on the results panel and next to the window table:

> These values are this site’s design references, not a standard of appearance.

Additional rules:

- Measuring windows are not interchangeable.
- Not every row uses 1.618.
- Difference is never converted into a grade, color score, “match percentage,” or pass/fail band.
- The interval bar shows only a **reference tick** and a **measured mark**. Do not draw a “normal range” or other bandwidth unless a later source is confirmed.
- Visible-window values that depend on the named offset in §3 are labeled **Derived design reference**.
- Golden-ratio segment rows are labeled **Golden ratio reference** so they are not mistaken for a thirds value.
- Thirds and fifths rows must not look like golden-ratio rows.

---

## 3. Named constants

All lengths in this section are in units of **face width**, where face width is zygion to zygion = 1.

| Constant | Symbol | Value | Meaning |
|---|---|---|---|
| Golden ratio (UI form) | φ | 1.618 | Hairline-to-chin length / face width, and the greater-to-lesser guide for φ segment rows. The UI keeps this three-decimal form. |
| Visible forehead offset | VFO | 0.238 | Assumed vertical distance from the midline hairline down to the visible forehead top, in face-width units. |

**Definition that ties the two visible-window rows together:**

```
VFO = φ − 1.38 = 0.238
visible length/width reference = φ − VFO = 1.38
```

If VFO is later changed, recompute both of these from it. Do not edit 1.38 and 1.23 as independent numbers.

### 3.1 Hairline window (width = 1)

A φ split of hairline-to-chin at the base of the nose:

- Hairline-to-chin length = φ = 1.618
- Lower face (subnasale → menton) = 0.618
- Upper face (hairline → subnasale) = 1.000
- Row 1 reference = 1.618
- Row 2 reference = 1.000 / 0.618 = 1.618

### 3.2 Visible forehead window (width = 1)

Only the top of the upper segment is shortened, by VFO:

- Visible forehead-to-chin length = 1.618 − 0.238 = 1.380
- Upper face (visible forehead → subnasale) = 1.000 − 0.238 = 0.762
- Lower face unchanged = 0.618
- Row 1 reference = 1.38
- Row 2 reference = 0.762 / 0.618 ≈ 1.233

The UI may show row 2 as **1.233** (three decimals, consistent with the difference column) and still describe it as about 1.23. Difference is computed against 1.233.

### 3.3 What VFO is not

VFO is a shared design assumption, not a measured property of a given face. The true hairline-to-visible-forehead distance varies with hairstyle, hairline, and where the visible-forehead landmark is placed. In the visible window, rows 1 and 2 therefore say as much about landmark placement as about face shape. Label both **Derived design reference**. Do not call them a standard value.

---

## 4. How many items, and how this maps to PRD §4.4

v1 is **11 measurement rows** plus **one non-ratio module** (the thirds-and-fifths overlay) = the PRD’s 12 modules. The owner confirmed this count, and confirmed that the jawline-contour window stays out of v1.

The 11 rows are not “11 golden-ratio tests.” They are grouped in the UI as:

| Group | Rows | Role |
|---|---|---|
| **Golden ratio (φ)** | 1, 2, 3, 5 | Window φ, derived visible-window φ, and φ segment comparisons |
| **Thirds and fifths** | 4, 6, 7, 8, plus module 12 | 1:1:1 and five-eye guides. Rows 4, 7, and 8 are related expressions of the same five-eye guide (1.0, 1.0, 0.60). Keep all three, but never present 1.0 or 0.60 as golden-ratio values. |
| **Symmetry** | 9, 10, 11 | Equality, reference 1.0, after the rules in §5 |

---

## 5. Landmarks, roll correction, and left/right

These are working names for v1 manual placement. They are ordinary face-point labels, not a third-party mask.

| Code | Name | Where to place it |
|---|---|---|
| Hairline | Midline hairline | The clearly visible hairline on the midline of the forehead. Used only in the hairline window. |
| Visible forehead | Visible forehead top | The highest visible skin of the forehead on the midline when the hairline is hidden or not used. Default window top. |
| Menton | Chin (bottom) | The lowest midline point of the chin soft tissue. |
| Zygion L / R | Widest mid-face | The leftmost and rightmost points of the mid-face / cheekbone width, on the **photo** left and photo right. |
| Subnasale | Base of the nose | Midline point where the nasal septum meets the upper lip. |
| Brow line | Brow line | A horizontal line at the lower brow edge, taken at the midline (or the mean of left and right lower brow edges), after roll correction. |
| Endocanthion L / R | Inner eye corner | Inner corner of each palpebral fissure (photo left / photo right). |
| Exocanthion L / R | Outer eye corner | Outer corner of each palpebral fissure (photo left / photo right). |
| Alare L / R | Nose width points | The leftmost and rightmost points of the alae. |
| Cheilion L / R | Mouth corners | The photo-left and photo-right corners of the mouth. |
| Stomion | Mouth opening (midline) | Midline point where the lips meet (the mouth slit). This is not the lower-lip vermilion border (labrale inferius). |
| Brow peak L / R | Brow height points | The lower edge of each brow, taken above the pupil (or, if the pupil is unclear, above the mid-point of that eye). |

**Eye line:** the line through the two endocanthions. If both pupil centers are placed, the mid-pupil line may be used instead; v1 default is the endocanthion line.

**Roll correction (required before rows 10 and 11):** rotate the measurement frame so the eye line is horizontal, then measure brow height and mouth-corner height as distances perpendicular to that corrected eye line. A small head tilt will otherwise skew those rows.

**Photo left / photo right (required for all L/R rows):** “Left” and “right” mean the side that appears on the left or right of the **image**, not the subject’s anatomical left or right. A front-facing photo that is not mirrored shows the subject’s right on the photo left. A mirrored selfie still uses the image’s left. The measured value is **photo left ÷ photo right**. A value of 0.98 means the photo-left length is smaller than the photo-right length. Label the rows and the legend this way so 0.98 and 1.02 cannot be read as the opposite laterality. A later secondary display of an absolute percentage difference may be added; it is not in v1.

**Yaw tip (required in “How to take a measurable photo” and the in-tool quality tip):** turning the head left or right can make the two sides look unequal even after roll correction. Face the camera squarely.

**Eye width** means the palpebral fissure width: exocanthion to endocanthion on that side. When a formula uses “one eye width,” use the mean of the two sides, unless the row is itself a left/right comparison.

**Face width** means zygion to zygion (photo left to photo right).

**Face length** means the vertical span of the currently selected window: visible forehead to menton, or hairline to menton.

If a required landmark cannot be placed, that row shows no value (an empty state), not a fabricated number.

---

## 6. Measuring windows

| Window | v1 status | Top landmark | Bottom landmark | Overall length/width reference | UI |
|---|---|---|---|---|---|
| Visible forehead to chin | Locked — default | Visible forehead | Menton | about 1.38, derived as φ − VFO | “Visible forehead to chin (about 1.38)” |
| Hairline to chin | Locked | Hairline | Menton | 1.618 | “Hairline to chin (1.618)” |
| Window that includes the jawline contour | **Deferred from v1** (owner confirmed) | — | — | — | Keep out of the UI until a later definition is confirmed |

The third window stays `[待确认]` in homepage copy only. No v1 QA item requires it.

---

## 7. Difference calculation (all rows)

**Difference = measured value − reference value**

- Show the signed difference with three decimal places (for example `+0.020` or `−0.029`).
- Do not take the absolute value in the numeric column; the sign shows direction.
- Do not convert the difference into a score, rank, percentile, or color grade.
- The interval bar is a neutral position marker: reference tick + measured mark only. No “normal range.”

For symmetry rows, the measured value is **photo left / photo right**, so 1.0 means equality. Difference is still `(photo left / photo right) − 1.0`.

---

## 8. The 11 v1 measurement rows

Default UI window in the mock: **Visible forehead to chin**. Example **Value** numbers are readings on the constructed reference diagram, not a calibration of that artwork and not measurements of a real face.

Reference and Difference in the mock follow this locked table. Example Value numbers on the constructed diagram remain illustrative.

### 8.1 Face length / face width

| Field | Definition |
|---|---|
| English name | Face length / face width |
| Group | Golden ratio (φ) |
| Landmarks / lines | Face length: selected window top to menton. Face width: zygion (photo left) to zygion (photo right). Measured value = length / width. |
| Window | Depends on the selected window |
| Reference | Hairline window: **1.618**. Visible window: **1.38** (= φ − VFO). |
| Visible-window label | Derived design reference |
| Difference | measured − the reference for the current window |
| Geometric rationale | The two vertical windows applied to the face rectangle. In the visible window, the reference is derived from VFO (see §3). |

Example in the default-window mock: Value 1.351, Reference 1.38, Difference −0.029.

### 8.2 Upper face / lower face

| Field | Definition |
|---|---|
| English name | Upper face / lower face |
| Group | Golden ratio (φ) |
| Landmarks / lines | Upper: selected window top to subnasale. Lower: subnasale to menton. Measured value = upper / lower. |
| Window | Depends on the selected window, because the top of the upper segment changes |
| Reference (hairline) | **1.618** |
| Reference (visible) | **1.233** (about 1.23), derived as (1 − VFO) / 0.618. Owner accepted this as a derived design reference on 18 November 2026. |
| Visible-window label | Derived design reference |
| Difference | measured − the reference for the current window |
| Geometric rationale | See §3. Not a published norm. |

Example in the default-window mock: Value 1.048, Reference 1.233, Difference −0.185.

### 8.3 Mouth width / nose width

| Field | Definition |
|---|---|
| English name | Mouth width / nose width |
| Group | Golden ratio (φ) |
| Landmarks / lines | Mouth width: cheilion (photo left) to cheilion (photo right). Nose width: alare (photo left) to alare (photo right). Measured value = mouth / nose. |
| Window | Independent of the vertical window |
| Reference | **1.618** |
| Label | Golden ratio reference |
| Difference | measured − 1.618 |
| Geometric rationale | A site design reference comparing two neighboring mid-face widths, using φ as the greater-to-lesser guide. |

Example in the mock: Value 1.540, Reference 1.618, Difference −0.078.

### 8.4 Inter-eye distance / eye width

| Field | Definition |
|---|---|
| English name | Inter-eye distance / eye width |
| Group | Thirds and fifths |
| Landmarks / lines | Inter-eye distance: endocanthion (photo left) to endocanthion (photo right). Eye width: mean of the two palpebral fissure widths. Measured value = inter-eye distance / eye width. |
| Window | Independent |
| Reference | **1.0** |
| Label | Fifths guide (not a golden ratio reference) |
| Difference | measured − 1.0 |
| Geometric rationale | In the five-eye drawing guide, the space between the inner corners is one eye-width column. Related to rows 7 and 8. |

Example in the mock: Value 1.210, Reference 1.00, Difference +0.210.

### 8.5 Chin length / nose-to-mouth

Locked on 18 November 2026.

| Field | Definition |
|---|---|
| English name | Chin length / nose-to-mouth |
| Group | Golden ratio (φ) |
| Numerator (chin length) | **Stomion → menton.** Stomion is the midline mouth slit (where the lips meet). This is not the lower-lip border (labrale inferius) and not “lower lip to chin.” Menton is the bottom of the chin soft tissue. |
| Denominator (nose-to-mouth) | **Subnasale → stomion.** Subnasale is the base of the nose. |
| In plain words | Mouth slit to chin, divided by nose base to mouth slit. |
| Measured value | (stomion–menton) / (subnasale–stomion) |
| Window | Independent (both segments sit in the lower face) |
| Reference | **1.618** |
| Label (required) | **Golden ratio reference** |
| Difference | measured − 1.618 |
| Why the label is required | The same two segments, under a classic thirds-style split of the lower third (about 1:2), would have a reference of about **2.0**. This row does not use 2.0. It is a golden-ratio version of the same comparison. The label and the Golden ratio group exist so a knowledgeable user does not think 1.618 is a mistake for 2.0. Do not place this row in Thirds and fifths. |
| Geometric rationale | The “other mid- or lower-face vertical segment” in the homepage copy. Site construction, not a published norm, and not mixed with the 1.38 / VFO window constant. |

Example in the mock: Value 0.924, Reference 1.618, Difference −0.694. The large difference is a property of the constructed diagram, not a reason to change the reference.

### 8.6 Mid-face height / lower-face height

| Field | Definition |
|---|---|
| English name | Mid-face height / lower-face height |
| Group | Thirds and fifths |
| Landmarks / lines | Mid-face: brow line to subnasale. Lower face: subnasale to menton. Measured value = mid-face / lower face. After roll correction. |
| Window | Independent (the brow line, not the window top, starts the mid-face) |
| Reference | **1.0** |
| Label | Thirds guide (not a golden ratio reference) |
| Difference | measured − 1.0 |
| Geometric rationale | The rule of thirds treats mid-face and lower face as equal bands. |

Example in the mock: Value 0.980, Reference 1.00, Difference −0.020.

### 8.7 Face width / five-eye width

| Field | Definition |
|---|---|
| English name | Face width / five-eye width |
| Group | Thirds and fifths |
| Landmarks / lines | Face width: zygion (photo left) to zygion (photo right). Five-eye width: 5 × (mean eye width). Measured value = face width / (5 × mean eye width). |
| Window | Independent |
| Reference | **1.0** |
| Label | Fifths guide (not a golden ratio reference) |
| Difference | measured − 1.0 |
| Geometric rationale | The five-eye drawing guide says the front face is five eye-widths wide. Related to rows 4 and 8. |

Example in the mock: Value 1.040, Reference 1.00, Difference +0.040.

### 8.8 Outer-eye width / face width

| Field | Definition |
|---|---|
| English name | Outer-eye width / face width |
| Group | Thirds and fifths |
| Landmarks / lines | Outer-eye width: exocanthion (photo left) to exocanthion (photo right). Face width: zygion (photo left) to zygion (photo right). Measured value = outer-eye width / face width. |
| Window | Independent |
| Reference | **0.60** (exactly 3/5) |
| Label | Fifths guide (not a golden ratio reference) |
| Difference | measured − 0.60 |
| Geometric rationale | In the same five-eye guide, outer-corner to outer-corner occupies the central three of five columns. Related to rows 4 and 7. |

Example in the mock: Value 0.585, Reference 0.60, Difference −0.015.

### 8.9 Photo left / photo right eye width

| Field | Definition |
|---|---|
| English name | Photo left / photo right eye width |
| Group | Symmetry |
| Landmarks / lines | Photo-left eye width: exocanthion to endocanthion on the photo-left eye. Photo-right eye width: the same on the photo-right eye. Measured value = photo left / photo right. |
| Window | Independent |
| Reference | **1.0** |
| Difference | (photo left / photo right) − 1.0 |
| Geometric rationale | Equality. Follow §5 for laterality. Yaw will affect this row; say so in the photo tip. |

Example in the mock: Value 1.020, Reference 1.00, Difference +0.020.

### 8.10 Photo left / photo right brow height

| Field | Definition |
|---|---|
| English name | Photo left / photo right brow height |
| Group | Symmetry |
| Landmarks / lines | After roll correction, brow height on each side is the perpendicular distance from the eye line to that side’s brow peak. Measured value = photo left / photo right. |
| Window | Independent |
| Reference | **1.0** |
| Difference | (photo left / photo right) − 1.0 |
| Geometric rationale | Equality after the eye-line roll correction in §5. |

Example in the mock: Value 0.992, Reference 1.00, Difference −0.008.

### 8.11 Photo left / photo right mouth-corner height

| Field | Definition |
|---|---|
| English name | Photo left / photo right mouth-corner height |
| Group | Symmetry |
| Landmarks / lines | After roll correction, mouth-corner height on each side is the perpendicular distance from the same eye line to that side’s cheilion. Measured value = photo left / photo right. |
| Window | Independent |
| Reference | **1.0** |
| Difference | (photo left / photo right) − 1.0 |
| Geometric rationale | Lower-face symmetry companion to rows 9 and 10, using the same corrected eye line. |

Example in the mock: Value 1.015, Reference 1.00, Difference +0.015.

---


### 8.13 Implementation notes (do not block the lock)

The owner recorded these two notes in section 8 when locking the table on 18 November 2026. They are required frontend behavior.

1. **Open or laughing mouth (row 5).** If the mouth is slightly open or the person is laughing, stomion (where the lips meet) cannot be placed reliably. This row must show the empty state **Can't measure this on the current photo.** Do not invent a number. The same empty state applies whenever stomion cannot be placed.

2. **Interpretation when the measured value is above 1.618 (row 5).** Do not describe this as a deviation. Explain that this row uses the golden ratio reference (1.618), while a classic thirds-style split of the same two segments is about 2.0. A value above 1.618 can sit closer to that classic split; it is the difference between the two versions, not a fault in the face and not a “deviation” from a standard.

Both strings live in `data/measurements.v1.json` and must be read from there.

---

## 9. Module 12 (non-ratio): thirds-and-fifths overlay

A visual overlay that divides the selected face area into vertical thirds and horizontal fifths. It is a drawing guide, also offered as a free template on `/templates/`.

- It does not have a 1.618 or 1.38 reference of its own.
- It is not listed in the measurement table as a φ row.
- Rows 4, 6, 7, and 8 are the numeric counterparts of this guide and stay in Thirds and fifths.

---

## 10. What is out of v1

| Item | Why |
|---|---|
| Jawline-contour measuring window | Owner confirmed deferral; still no confirmed landmarks or reference. |
| Jaw-width or gonion-to-gonion rows that depend on that window | Same reason. |
| Automatic landmark detection (F3) | Stage 2. v1 is manual placement, plus the roll correction in §5. |
| Multi-photo comparison, custom grid presets | Stage 2. |
| Batch processing (up to 20 photos) | Stage 3. |
| fWHR as a scored module | FAQ may mention fWHR as a different measurement; it is not one of the 11 v1 rows. |
| A “normal range” band on the interval bar | No source. Reference tick + measured mark only. |

---

## 11. UI and copy notes

- Default window: Visible forehead to chin (about 1.38).
- Dropdown includes only the two locked windows.
- The results list is grouped under **Golden ratio**, **Thirds and fifths**, and **Symmetry**, with a short legend.
- Each row shows Name, Value, Reference, Difference, and a neutral interval bar (tick + mark only).
- On a phone, the first screen keeps a quality tip, the main photo, and an overview; the remaining rows are collapsed.
- Visible-window rows 1 and 2: “Derived design reference.”
- Rows 3 and 5: “Golden ratio reference.”
- Rows 4, 6, 7, 8: “Thirds guide” or “Fifths guide.”
- Symmetry row titles use “Photo left / photo right …”.
- In-tool quality tip and the “How to take a measurable photo” section must mention facing the camera squarely, because yaw makes left and right widths look unequal.
- Every results view repeats: “These values are this site’s design references, not a standard of appearance.”
- Do not write “according to,” and do not name a paper or mask as the source of a reference.

---

## 12. Lock state

| Decision | State |
|---|---|
| v1 = 11 rows + thirds-and-fifths overlay; jawline window deferred | Accepted 18 November 2026 |
| Named constant VFO = 0.238; visible row 1 = 1.38; visible row 2 = 1.233, labeled derived | Accepted 18 November 2026 |
| Three UI families; no normal-range band; no “according to” | Accepted 18 November 2026 |
| Symmetry: roll correction, photo left / photo right, yaw tip | Accepted 18 November 2026 |
| Difference = measured − reference, signed, no score | Accepted 18 November 2026 |
| Row 5 landmark definition (stomion→menton) / (subnasale→stomion), reference 1.618 labeled Golden ratio reference, distinct from a thirds-style ~2.0 | Locked 18 November 2026 |
| Row 5 empty state when stomion cannot be placed (open or laughing mouth): “Can't measure this on the current photo.” | Required implementation; does not reopen the lock |
| Row 5 copy when measured value > 1.618: explain the golden-ratio vs thirds (~2.0) difference; do not call it a deviation | Required implementation; does not reopen the lock |
| Shared data file `data/measurements.v1.json` is the single source for names, groups, window references, and VFO | Required for UI, PDF, and FAQ |

This document is locked for QA and frontend. Later changes to a reference value must be made in `data/measurements.v1.json` (and then reflected here).

[LOCKED]
