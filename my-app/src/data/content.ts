// ─── Content model ────────────────────────────────────────────────────────────
// To add real content, swap the placeholder PDF URLs below with actual paths.
// All URLs are grouped by level → pastPapers | topics → subtopics.

export type PastPaper = {
  year: number;
  paperNumber: number;
  paperUrl: string;
  solutionsUrl: string;
};

export type Subtopic = {
  name: string;
  workbookUrl: string;
  answersUrl: string;
};

export type Topic = {
  name: string;
  slug: string;
  icon: string; // emoji shorthand
  subtopics: Subtopic[];
};

export type LevelContent = {
  label: string;
  slug: string;
  description: string;
  pastPapers: PastPaper[];
  topics: Topic[];
};

// ─── Placeholder PDF ──────────────────────────────────────────────────────────
const SAMPLE_PDF = "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf";

// ─── Data ─────────────────────────────────────────────────────────────────────
export const levels: LevelContent[] = [
  {
    label: "National 5",
    slug: "national-5",
    description: "SQA National 5 Mathematics — exam papers and topic workbooks.",
    pastPapers: [
      { year: 2024, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2024, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2023, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2023, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2022, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2022, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2019, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2019, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
    ],
    topics: [
      {
        name: "Algebra",
        slug: "algebra",
        icon: "𝑥",
        subtopics: [
          { name: "Expanding Brackets", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Factorising", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Solving Linear Equations", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Solving Quadratic Equations", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Changing the Subject", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Simplifying Surds", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
      {
        name: "Trigonometry",
        slug: "trigonometry",
        icon: "△",
        subtopics: [
          { name: "SOH-CAH-TOA", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Sine Rule", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Cosine Rule", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Area of a Triangle", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Graphs of Trig Functions", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
      {
        name: "Geometry",
        slug: "geometry",
        icon: "○",
        subtopics: [
          { name: "Properties of Circles", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Vectors", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Similarity", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Pythagoras' Theorem", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
      {
        name: "Statistics",
        slug: "statistics",
        icon: "∑",
        subtopics: [
          { name: "Averages and Spread", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Box Plots", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Standard Deviation", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Scattergraphs", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
    ],
  },
  {
    label: "Higher",
    slug: "higher",
    description: "SQA Higher Mathematics — exam papers and topic workbooks.",
    pastPapers: [
      { year: 2024, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2024, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2023, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2023, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2022, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2022, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2019, paperNumber: 1, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
      { year: 2019, paperNumber: 2, paperUrl: SAMPLE_PDF, solutionsUrl: SAMPLE_PDF },
    ],
    topics: [
      {
        name: "Algebra",
        slug: "algebra",
        icon: "𝑥",
        subtopics: [
          { name: "Polynomials", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Factor Theorem", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Completing the Square", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Logarithms and Exponentials", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "The Discriminant", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
      {
        name: "Trigonometry",
        slug: "trigonometry",
        icon: "△",
        subtopics: [
          { name: "Exact Values", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Compound Angles", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Double Angle Formulae", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Solving Trig Equations", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Wave Function", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
      {
        name: "Calculus",
        slug: "calculus",
        icon: "∫",
        subtopics: [
          { name: "Differentiation", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Integration", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Optimisation", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Recurrence Relations", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Sequences", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
      {
        name: "Geometry",
        slug: "geometry",
        icon: "○",
        subtopics: [
          { name: "Circle Equations", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Vectors in 3D", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Perpendicular Bisectors", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
          { name: "Straight Line Theory", workbookUrl: SAMPLE_PDF, answersUrl: SAMPLE_PDF },
        ],
      },
    ],
  },
];

export function getLevel(slug: string): LevelContent | undefined {
  return levels.find((l) => l.slug === slug);
}

export function getTopic(levelSlug: string, topicSlug: string): Topic | undefined {
  return getLevel(levelSlug)?.topics.find((t) => t.slug === topicSlug);
}
