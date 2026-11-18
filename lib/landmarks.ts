export const LM = {
  visibleForehead: "visible-forehead",
  hairline: "hairline",
  menton: "menton",
  zygionLeft: "zygion-photo-left",
  zygionRight: "zygion-photo-right",
  subnasale: "subnasale",
  browLeft: "brow-peak-photo-left",
  browRight: "brow-peak-photo-right",
  endocanthionLeft: "endocanthion-photo-left",
  endocanthionRight: "endocanthion-photo-right",
  exocanthionLeft: "exocanthion-photo-left",
  exocanthionRight: "exocanthion-photo-right",
  alareLeft: "alare-photo-left",
  alareRight: "alare-photo-right",
  cheilionLeft: "cheilion-photo-left",
  cheilionRight: "cheilion-photo-right",
  stomion: "stomion",
} as const;

export type LandmarkDefinition = {
  id: string;
  label: string;
  hint: string;
  required: boolean;
};

export const placementLandmarks: LandmarkDefinition[] = [
  {
    id: LM.visibleForehead,
    label: "Top of the visible forehead",
    hint: "Highest visible forehead skin on the midline. This is the default window top, not the hairline.",
    required: true,
  },
  {
    id: LM.hairline,
    label: "Hairline",
    hint: "Midline hairline. Used only for the hairline window.",
    required: false,
  },
  {
    id: LM.browLeft,
    label: "Photo-left brow",
    hint: "Lower edge of the eyebrow on the left side of the photo, above the middle of that eye.",
    required: true,
  },
  {
    id: LM.browRight,
    label: "Photo-right brow",
    hint: "Lower edge of the eyebrow on the right side of the photo, above the middle of that eye.",
    required: true,
  },
  {
    id: LM.exocanthionLeft,
    label: "Photo-left outer eye corner",
    hint: "Outer corner of the eye on the left side of the photo.",
    required: true,
  },
  {
    id: LM.endocanthionLeft,
    label: "Photo-left inner eye corner",
    hint: "Inner corner of the eye on the left side of the photo. The eye line uses both inner corners.",
    required: true,
  },
  {
    id: LM.endocanthionRight,
    label: "Photo-right inner eye corner",
    hint: "Inner corner of the eye on the right side of the photo.",
    required: true,
  },
  {
    id: LM.exocanthionRight,
    label: "Photo-right outer eye corner",
    hint: "Outer corner of the eye on the right side of the photo.",
    required: true,
  },
  {
    id: LM.zygionLeft,
    label: "Photo-left cheek",
    hint: "Widest cheek point on the left side of the photo.",
    required: true,
  },
  {
    id: LM.zygionRight,
    label: "Photo-right cheek",
    hint: "Widest cheek point on the right side of the photo.",
    required: true,
  },
  {
    id: LM.alareLeft,
    label: "Photo-left side of the nose",
    hint: "Outer edge of the nostril on the left side of the photo.",
    required: true,
  },
  {
    id: LM.alareRight,
    label: "Photo-right side of the nose",
    hint: "Outer edge of the nostril on the right side of the photo.",
    required: true,
  },
  {
    id: LM.subnasale,
    label: "Base of the nose",
    hint: "Midline, where the nose meets the upper lip.",
    required: true,
  },
  {
    id: LM.cheilionLeft,
    label: "Photo-left mouth corner",
    hint: "Corner of the mouth on the left side of the photo.",
    required: true,
  },
  {
    id: LM.cheilionRight,
    label: "Photo-right mouth corner",
    hint: "Corner of the mouth on the right side of the photo.",
    required: true,
  },
  {
    id: LM.stomion,
    label: "Stomion",
    hint: "Midline, where the lips meet. Skip this if the mouth is slightly open or the person is laughing.",
    required: false,
  },
  {
    id: LM.menton,
    label: "Chin",
    hint: "Lowest midline point of the chin.",
    required: true,
  },
];
