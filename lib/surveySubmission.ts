import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase";
import type { Persona } from "@/lib/surveyConfig";

type SubmitSurveyResponseInput = {
  persona: Persona;
  demographics: Record<string, unknown>;
  responses: Record<string, unknown>;
};

type SubmitSurveyResponseResult = {
  id: string;
};

export async function submitSurveyResponse(
  input: SubmitSurveyResponseInput
): Promise<SubmitSurveyResponseResult> {
  try {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, "surveyResponses"), {
      ...input,
      submittedAt: serverTimestamp(),
      submittedAtIso: new Date().toISOString(),
    });

    return { id: docRef.id };
  } catch (error) {
    console.error("Firestore save error:", error);
    throw error;
  }
}
