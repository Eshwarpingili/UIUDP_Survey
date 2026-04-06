import type { Question, SurveyConfig } from "@/lib/surveyConfig";

export type SurveyQuestionWithSection = {
  sectionTitle: string;
  question: Question;
};

export function flattenSurveyQuestions(config: SurveyConfig): SurveyQuestionWithSection[] {
  return config.sections.flatMap((section) =>
    section.questions.map((question) => ({
      sectionTitle: section.title,
      question,
    }))
  );
}

export function defaultQuestionValue(question: Question): unknown {
  if (question.type === "multi") {
    return [];
  }

  if (question.type === "matrix") {
    return {};
  }

  if (question.type === "scale") {
    return undefined;
  }

  return "";
}
