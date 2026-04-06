import type { Persona } from "@/lib/surveyConfig";

type Answers = Record<string, unknown>;

function isNo(value: unknown): boolean {
  return typeof value === "string" && value.trim().toLowerCase() === "no";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

export function generateSuggestions(answers: Answers, persona: Persona): string[] {
  const suggestions: string[] = [];

  if (persona === "prenatal") {
    const q8 = toNumber(answers.Q8);
    const q9 = toNumber(answers.Q9);
    const q6 = toNumber(answers.Q6);
    const q13 = toNumber(answers.Q13);
    const q24 = answers.prenatal_q24;
    const q21 = answers.prenatal_q21;

    if (q8 !== null && q8 >= 4) {
      suggestions.push(
        "You may benefit from having a consistent person to talk to regularly."
      );
    }
    if (q9 !== null && q9 <= 2) {
      suggestions.push(
        "Some people find it helpful to identify one trusted support person during pregnancy."
      );
    }
    if (q6 !== null && q6 >= 4) {
      suggestions.push(
        "Clear, reliable nutrition guidance could reduce confusion in daily decisions."
      );
    }
    if (q13 !== null && q13 >= 4) {
      suggestions.push(
        "Sticking to one trusted source (like a doctor) may reduce information overload."
      );
    }
    if (isNo(q24)) {
      suggestions.push(
        "Getting clarity on recommended vaccinations may help you feel more prepared."
      );
    }
    if (isNo(q21)) {
      suggestions.push(
        "There may be government services available that could support your pregnancy journey."
      );
    }
  }

  if (persona === "postpartum") {
    const q6 = toNumber(answers.Q6);
    const q7 = toNumber(answers.Q7);
    const q9 = toNumber(answers.Q9);
    const q17 = answers.postpartum_q17;
    const q20 = toNumber(answers.postpartum_q20);

    if (q6 !== null && q6 >= 4) {
      suggestions.push(
        "Emotional changes after childbirth are common; speaking to someone you trust can help."
      );
    }
    if (q7 !== null && q7 <= 2) {
      suggestions.push(
        "Some mothers prefer private or anonymous spaces to talk about how they feel."
      );
    }
    if (q9 !== null && q9 >= 4) {
      suggestions.push(
        "Preparation around emotional changes can make the transition smoother."
      );
    }
    if (isNo(q17)) {
      suggestions.push(
        "Some mothers later find government services helpful when they are aware of them earlier."
      );
    }
    if (q20 !== null && q20 <= 2) {
      suggestions.push(
        "Clearer information about vaccinations can make early childcare decisions easier."
      );
    }
  }

  if (persona === "relative") {
    const q7 = toNumber(answers.Q7);
    const q8 = toNumber(answers.Q8);
    const q14 = answers.relative_q14;
    const q18 = toNumber(answers.relative_q18);

    if (q7 !== null && q7 <= 2) {
      suggestions.push("Guidance on emotional support can make a meaningful difference.");
    }
    if (q8 !== null && q8 >= 4) {
      suggestions.push("Creating open conversations can improve support for new mothers.");
    }
    if (isNo(q14)) {
      suggestions.push(
        "Awareness of available services can help you support her more effectively."
      );
    }
    if (q18 !== null && q18 <= 2) {
      suggestions.push(
        "Understanding basic pregnancy precautions can improve confidence in supporting her."
      );
    }
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Your responses suggest a steady support pattern; continuing regular check-ins can still be helpful.",
      "Small, consistent routines and clear communication often make day-to-day wellbeing easier.",
      "If needed, reaching out to one trusted person can be a simple way to stay supported."
    );
  }

  return suggestions.slice(0, 5);
}
