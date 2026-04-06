import type { Persona } from "@/lib/surveyConfig";

export type DemographicQuestion = {
  id: "ageRange" | "locationType" | "education" | "householdRole" | "pregnancyStatus";
  question: string;
  type: "single" | "dropdown";
  options: string[];
};

export const DEMOGRAPHIC_STEP_COUNT = 5;

export const demographicQuestions: DemographicQuestion[] = [
  {
    id: "ageRange",
    question: "What is your age range?",
    type: "dropdown",
    options: [
      "Under 18",
      "18-24",
      "25-34",
      "35-44",
      "45 and above",
      "Prefer not to say",
    ],
  },
  {
    id: "locationType",
    question: "What best describes your location type?",
    type: "single",
    options: ["Urban", "Semi-urban", "Rural"],
  },
  {
    id: "education",
    question: "What is your highest completed education level?",
    type: "single",
    options: [
      "No formal schooling",
      "Primary school",
      "Secondary school",
      "College or diploma",
      "Postgraduate",
    ],
  },
  {
    id: "householdRole",
    question: "What is your primary household role?",
    type: "single",
    options: [
      "Primary caregiver",
      "Shared caregiver",
      "Working outside home",
      "Student",
      "Other",
    ],
  },
  {
    id: "pregnancyStatus",
    question: "Which option best describes your current status?",
    type: "single",
    options: ["Pregnant", "Postpartum", "Relative"],
  },
];

export function statusToPersona(status: string): Persona | null {
  if (status === "Pregnant") {
    return "prenatal";
  }

  if (status === "Postpartum") {
    return "postpartum";
  }

  if (status === "Relative") {
    return "relative";
  }

  return null;
}
