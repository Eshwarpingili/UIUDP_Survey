"use client";

import { useState } from "react";

import { DemographicsFlow } from "@/components/survey/DemographicsFlow";
import { SurveyFlow } from "@/components/survey/SurveyFlow";
import type { Persona } from "@/lib/surveyConfig";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);

  if (!persona) {
    return <DemographicsFlow onComplete={setPersona} />;
  }

  return <SurveyFlow persona={persona} onBackToDemographics={() => setPersona(null)} />;
}
