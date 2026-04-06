export type Persona = "prenatal" | "postpartum" | "relative";

export type Question = {
  id: string;
  type: "single" | "multi" | "scale" | "text" | "dropdown" | "matrix";
  question: string;
  options?: string[];
  scaleLabels?: string[];
  matrix?: {
    rows: string[];
    columns: string[];
  };
  optional?: boolean;
};

export type Section = {
  title: string;
  questions: Question[];
};

export type SurveyConfig = {
  persona: "prenatal" | "postpartum" | "relative";
  sections: Section[];
};

export const PERSONA_LABELS: Record<Persona, string> = {
  prenatal: "Prenatal",
  postpartum: "Postpartum",
  relative: "Relative",
};

export const surveyConfig: Record<Persona, SurveyConfig> = {
  prenatal: {
    persona: "prenatal",
    sections: [
      {
        title: "Section A",
        questions: [
          {
            id: "Q1",
            type: "scale",
            question: "I have clear information about what to expect during pregnancy.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q2",
            type: "single",
            question: "How often do you feel supported in your daily routine?",
            options: ["Rarely", "Sometimes", "Often", "Most days"],
          },
        ],
      },
      {
        title: "Section B",
        questions: [
          {
            id: "Q3",
            type: "matrix",
            question: "How much do you trust the support available from each source?",
            matrix: {
              rows: ["Partner/family", "Community", "Healthcare team", "Online sources"],
              columns: ["Low", "Moderate", "High"],
            },
          },
          {
            id: "Q4",
            type: "multi",
            question: "Which support channels do you currently use?",
            options: ["Family", "Friends", "Healthcare provider", "Online communities", "None"],
          },
        ],
      },
      {
        title: "Section C",
        questions: [
          {
            id: "Q5",
            type: "dropdown",
            question: "How confident do you feel making daily health decisions?",
            options: ["Very low", "Low", "Moderate", "High", "Very high"],
          },
          {
            id: "Q6",
            type: "scale",
            question: "I feel confused about what foods are appropriate during pregnancy.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Section D",
        questions: [
          {
            id: "Q7",
            type: "scale",
            question: "I feel comfortable asking questions when I need support.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q8",
            type: "scale",
            question: "I feel anxious about pregnancy-related changes.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q9",
            type: "scale",
            question: "I feel I have enough emotional support during pregnancy.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Section E",
        questions: [
          {
            id: "Q10",
            type: "single",
            question: "How easy is it for you to identify one trusted person to talk to?",
            options: ["Very difficult", "Difficult", "Neutral", "Easy", "Very easy"],
          },
          {
            id: "Q11",
            type: "text",
            question: "Is there anything else you would like to share about your support needs?",
            optional: true,
          },
        ],
      },
      {
        title: "Section F",
        questions: [
          {
            id: "Q12",
            type: "scale",
            question: "Information from different places generally feels consistent to me.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q13",
            type: "scale",
            question: "I often receive conflicting pregnancy information.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Awareness & Preventive Knowledge",
        questions: [
          {
            id: "prenatal_q21",
            type: "single",
            question: "Are you aware of government health schemes that support pregnant women?",
            options: ["Yes", "No"],
          },
          {
            id: "prenatal_q22",
            type: "single",
            question: "Do you know where to access government maternal health services in your area?",
            options: ["Yes", "No"],
          },
          {
            id: "prenatal_q23",
            type: "scale",
            question:
              "I understand the eligibility and process for government pregnancy support services.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "prenatal_q24",
            type: "single",
            question: "Are you aware of vaccinations recommended during pregnancy?",
            options: ["Yes", "No"],
          },
          {
            id: "prenatal_q25",
            type: "scale",
            question: "I understand when recommended pregnancy vaccinations should be taken.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "prenatal_q26",
            type: "multi",
            question: "Where have you received information about pregnancy vaccinations?",
            options: [
              "Doctor or nurse",
              "ASHA/ANM/Anganwadi worker",
              "Family or friends",
              "Internet or social media",
              "I have not received information",
            ],
          },
          {
            id: "prenatal_q27",
            type: "scale",
            question: "I know the warning signs during pregnancy that require medical attention.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "prenatal_q28",
            type: "single",
            question: "Do you know when to seek immediate care for high-risk pregnancy symptoms?",
            options: ["Yes", "No"],
          },
          {
            id: "prenatal_q29",
            type: "scale",
            question: "I feel informed about daily preventive practices for a healthy pregnancy.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
    ],
  },
  postpartum: {
    persona: "postpartum",
    sections: [
      {
        title: "Section A",
        questions: [
          {
            id: "Q1",
            type: "scale",
            question: "I have enough practical support in my day-to-day routine.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q2",
            type: "single",
            question: "How connected do you feel to people around you?",
            options: ["Not at all", "A little", "Moderately", "Very"],
          },
        ],
      },
      {
        title: "Section B",
        questions: [
          {
            id: "Q3",
            type: "matrix",
            question: "How supported do you feel by each source right now?",
            matrix: {
              rows: ["Partner/family", "Friends", "Healthcare team", "Community spaces"],
              columns: ["Low", "Moderate", "High"],
            },
          },
          {
            id: "Q4",
            type: "multi",
            question: "Which kinds of support are currently most available to you?",
            options: ["Emotional", "Practical", "Financial", "Informational", "None"],
          },
        ],
      },
      {
        title: "Section C",
        questions: [
          {
            id: "Q5",
            type: "scale",
            question: "I feel confident managing new responsibilities after childbirth.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q6",
            type: "scale",
            question: "I have been feeling low in mood recently.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Section D",
        questions: [
          {
            id: "Q7",
            type: "scale",
            question: "I feel comfortable talking about how I feel.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q8",
            type: "dropdown",
            question: "How frequently do you get uninterrupted rest?",
            options: ["Almost never", "Sometimes", "Often", "Most days"],
          },
        ],
      },
      {
        title: "Section E",
        questions: [
          {
            id: "Q9",
            type: "scale",
            question: "I felt unprepared for emotional changes after childbirth.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Section F",
        questions: [
          {
            id: "Q10",
            type: "text",
            question: "Would you like to share anything that could improve support for you right now?",
            optional: true,
          },
        ],
      },
      {
        title: "Awareness & Preventive Knowledge",
        questions: [
          {
            id: "postpartum_q17",
            type: "single",
            question: "Are you aware of government schemes that support mothers after childbirth?",
            options: ["Yes", "No"],
          },
          {
            id: "postpartum_q18",
            type: "single",
            question: "Do you know where to access government maternal and child services nearby?",
            options: ["Yes", "No"],
          },
          {
            id: "postpartum_q19",
            type: "scale",
            question:
              "I understand the eligibility and process for government support services after childbirth.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "postpartum_q20",
            type: "scale",
            question: "I have clear information about the baby's vaccination schedule.",
            scaleLabels: ["Not clear at all", "Very clear"],
          },
          {
            id: "postpartum_q21",
            type: "single",
            question: "Are you aware of where to get reliable vaccination guidance and reminders?",
            options: ["Yes", "No"],
          },
          {
            id: "postpartum_q22",
            type: "scale",
            question: "I know warning signs in mother or baby that need immediate medical attention.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "postpartum_q23",
            type: "single",
            question: "Do you know daily preventive practices that reduce postnatal health risks?",
            options: ["Yes", "No"],
          },
        ],
      },
    ],
  },
  relative: {
    persona: "relative",
    sections: [
      {
        title: "Section A",
        questions: [
          {
            id: "Q1",
            type: "single",
            question: "What is your relationship to the mother?",
            options: ["Partner", "Parent", "Sibling", "Other family member", "Friend"],
          },
          {
            id: "Q2",
            type: "scale",
            question: "I understand the emotional changes that can happen after childbirth.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Section B",
        questions: [
          {
            id: "Q3",
            type: "matrix",
            question: "How confident are you in providing support in each area?",
            matrix: {
              rows: ["Listening support", "Practical household help", "Encouraging rest", "Finding information"],
              columns: ["Low", "Moderate", "High"],
            },
          },
          {
            id: "Q4",
            type: "multi",
            question: "What kinds of support do you currently provide?",
            options: ["Emotional", "Practical", "Financial", "Information sharing", "Not sure"],
          },
        ],
      },
      {
        title: "Section C",
        questions: [
          {
            id: "Q5",
            type: "dropdown",
            question: "How often do you check in with the mother about her wellbeing?",
            options: ["Rarely", "Sometimes", "Often", "Very often"],
          },
          {
            id: "Q6",
            type: "scale",
            question: "I know where to find reliable support resources for mothers.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Section D",
        questions: [
          {
            id: "Q7",
            type: "scale",
            question: "I feel confident supporting a mother when she is emotionally overwhelmed.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "Q8",
            type: "scale",
            question: "Emotional struggles after childbirth are often treated as a taboo topic.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
        ],
      },
      {
        title: "Section E",
        questions: [
          {
            id: "Q9",
            type: "text",
            question: "Is there anything else that would help you support the mother better?",
            optional: true,
          },
        ],
      },
      {
        title: "Awareness & Preventive Knowledge",
        questions: [
          {
            id: "relative_q14",
            type: "single",
            question: "Are you aware of government services that support women during and after pregnancy?",
            options: ["Yes", "No"],
          },
          {
            id: "relative_q15",
            type: "single",
            question: "Do you know how to help the mother access these government services?",
            options: ["Yes", "No"],
          },
          {
            id: "relative_q16",
            type: "single",
            question: "Are you aware of recommended vaccinations during pregnancy and early infancy?",
            options: ["Yes", "No"],
          },
          {
            id: "relative_q17",
            type: "multi",
            question: "Where have you received information about maternal and infant vaccinations?",
            options: [
              "Doctor or nurse",
              "ASHA/ANM/Anganwadi worker",
              "Family or friends",
              "Internet or social media",
              "I have not received information",
            ],
          },
          {
            id: "relative_q18",
            type: "scale",
            question: "I understand basic pregnancy precautions and warning signs.",
            scaleLabels: ["Strongly disagree", "Strongly agree"],
          },
          {
            id: "relative_q19",
            type: "single",
            question: "Do you feel confident helping her seek medical care when warning signs appear?",
            options: ["Yes", "No"],
          },
        ],
      },
    ],
  },
};

export function isPersona(value: string): value is Persona {
  return value === "prenatal" || value === "postpartum" || value === "relative";
}
