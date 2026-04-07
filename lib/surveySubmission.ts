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

function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) {
    return null;
  }
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = sanitizeForFirestore(obj[key]);
    }
  }
  return result;
}

export async function submitSurveyResponse(
  input: SubmitSurveyResponseInput
): Promise<SubmitSurveyResponseResult> {
  try {
    const db = getFirebaseDb();

    // Sanitize input to replace undefined with null for Firestore
    const sanitizedInput = sanitizeForFirestore(input);

    const docRef = await addDoc(collection(db, "surveyResponses"), {
      ...sanitizedInput,
      submittedAt: serverTimestamp(),
      submittedAtIso: new Date().toISOString(),
    });

    return { id: docRef.id };
  } catch (error) {
    console.error("Firestore save error:", error);
    throw error;
  }
}
