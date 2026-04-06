import { notFound } from "next/navigation";

import { SurveyFlow } from "@/components/survey/SurveyFlow";
import { isPersona } from "@/lib/surveyConfig";

type SurveyPageProps = {
  params: Promise<{ persona: string }>;
};

export default async function SurveyPersonaPage(props: SurveyPageProps) {
  const params = await props.params;
  const persona = params.persona;

  if (!isPersona(persona)) {
    notFound();
  }

  return <SurveyFlow persona={persona} />;
}
