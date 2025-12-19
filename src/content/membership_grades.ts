import type { MembershipGrade } from "@/lib/membership";

export type MembershipGradeDetails = {
  grade: MembershipGrade;
  label: string;
  summary: string;
  criteria: string[];
  typicalEvidence: string[];
};

export const membershipGrades: MembershipGradeDetails[] = [
  {
    grade: "member",
    label: "Member",
    summary:
      "Default membership for people actively interested in AI/ML and the consortium mission.",
    criteria: [
      "Demonstrate genuine interest in AI/ML and responsible use of the technology",
      "Agree to the consortium code of conduct and professional standards",
    ],
    typicalEvidence: [
      "Public profile and background",
      "Relevant coursework, projects, or professional experience",
    ],
  },
  {
    grade: "senior",
    label: "Senior Member",
    summary:
      "For established practitioners with sustained impact and demonstrated professional leadership in AI/ML.",
    criteria: [
      "Typically 5+ years of professional practice or equivalent research experience in AI/ML or adjacent fields",
      "Demonstrated significant performance, impact, or responsibility over a sustained period (for example: leading programs, owning critical systems, or guiding technical direction)",
      "Evidence of contributions to the community (for example: mentoring, publications, open-source, standards work, or applied deployments)",
      "Peer endorsement (for example: references from recognized practitioners or existing senior/fellow members)",
    ],
    typicalEvidence: [
      "Shipped AI/ML systems at scale or meaningful research output",
      "Technical leadership roles, patents, publications, or widely used open-source contributions",
      "Reference letters or endorsements describing impact and responsibility",
    ],
  },
  {
    grade: "fellow",
    label: "Fellow",
    summary:
      "For individuals recognized for exceptional, sustained contributions that materially advanced the field or its practice.",
    criteria: [
      "Typically 10+ years of professional practice or equivalent research experience with a record of sustained excellence",
      "Evidence of extraordinary impact (for example: foundational research, widely adopted systems, major standards contributions, or industry-shaping leadership)",
      "Nomination and rigorous peer review by the consortium (with additional scrutiny for depth, originality, and breadth of impact)",
      "Strong alignment with responsible AI/ML and a history of advancing safety, reliability, and trustworthiness in practice",
    ],
    typicalEvidence: [
      "Seminal publications or broadly adopted inventions",
      "Leadership of high-impact programs, organizations, or standards bodies",
      "External recognition (awards, invited talks, citations) and peer nominations",
    ],
  },
];

