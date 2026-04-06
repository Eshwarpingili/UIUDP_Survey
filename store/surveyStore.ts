"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Persona } from "@/lib/surveyConfig";

export type Demographics = {
  ageRange?: string;
  locationType?: string;
  education?: string;
  householdRole?: string;
  pregnancyStatus?: string;
};

type SurveyState = {
  persona: Persona | "";
  demographics: Record<string, unknown>;
  answers: Record<string, unknown>;
  hydrated: boolean;
  setPersona: (persona: Persona) => void;
  setDemographic: (key: string, value: unknown) => void;
  setDemographics: (values: Record<string, unknown>) => void;
  setAnswer: (id: string, value: unknown) => void;
  clearAnswers: () => void;
  resetAll: () => void;
  setHydrated: (value: boolean) => void;
};

const initialState = {
  persona: "" as Persona | "",
  demographics: {} as Record<string, unknown>,
  answers: {} as Record<string, unknown>,
  hydrated: false,
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      ...initialState,
      setPersona: (persona) => set({ persona }),
      setDemographic: (key, value) =>
        set((state) => ({
          demographics: {
            ...state.demographics,
            [key]: value,
          },
        })),
      setDemographics: (values) => set({ demographics: values }),
      setAnswer: (id, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [id]: value,
          },
        })),
      clearAnswers: () => set({ answers: {} }),
      resetAll: () =>
        set({
          persona: "",
          demographics: {},
          answers: {},
          hydrated: true,
        }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "maternal-survey-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        persona: state.persona,
        demographics: state.demographics,
        answers: state.answers,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
