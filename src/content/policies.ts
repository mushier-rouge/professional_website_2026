export type PolicySection = {
  heading: string;
  body: string[];
};

export type PolicyPage = {
  slug: string;
  path: string;
  title: string;
  summary: string;
  sections: PolicySection[];
};

export const policyPages: PolicyPage[] = [
  {
    slug: "mission",
    path: "/about/mission",
    title: "Mission",
    summary: "Define the society's purpose and core commitments.",
    sections: [
      {
        heading: "Purpose",
        body: [
          "Advance trustworthy AI/ML practice and research through peer-reviewed publications and professional standards.",
        ],
      },
      {
        heading: "Values",
        body: [
          "Evidence-based scholarship, transparency, and responsible deployment of AI systems.",
        ],
      },
    ],
  },
  {
    slug: "editorial-policy",
    path: "/about/editorial-policy",
    title: "Editorial Policy",
    summary: "Explain how submissions are reviewed and published.",
    sections: [
      {
        heading: "Review process",
        body: [
          "All submissions are screened by editors and, when appropriate, sent for peer review.",
          "Decisions are recorded with rationale and tracked in audit logs.",
        ],
      },
      {
        heading: "Disclosures",
        body: [
          "Authors must disclose funding, conflicts of interest, and ethical considerations.",
        ],
      },
    ],
  },
  {
    slug: "code-of-conduct",
    path: "/about/code-of-conduct",
    title: "Code of Conduct",
    summary: "Set expectations for respectful, professional behavior.",
    sections: [
      {
        heading: "Standards",
        body: [
          "Members must engage respectfully, avoid harassment, and disclose conflicts when reviewing or endorsing work.",
        ],
      },
      {
        heading: "Enforcement",
        body: [
          "Violations may result in warnings, suspension, or content removal.",
        ],
      },
    ],
  },
  {
    slug: "governance",
    path: "/about/governance",
    title: "Governance",
    summary: "Outline committees and decision-making responsibilities.",
    sections: [
      {
        heading: "Committees",
        body: [
          "Editorial Board oversees publications, Membership Committee manages grade reviews, Fellows Committee handles nominations.",
        ],
      },
      {
        heading: "Transparency",
        body: [
          "Committee decisions are logged and can be audited by authorized staff.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    path: "/about/privacy",
    title: "Privacy Policy",
    summary: "Describe data collection, storage, and user controls.",
    sections: [
      {
        heading: "Data handling",
        body: [
          "We collect only the data needed to operate membership, publishing, and review workflows.",
        ],
      },
      {
        heading: "Controls",
        body: [
          "Members can request exports or account deletion; public visibility can be adjusted in profile settings.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    path: "/about/terms",
    title: "Terms of Use",
    summary: "Define acceptable use and content ownership.",
    sections: [
      {
        heading: "Acceptable use",
        body: [
          "Content must be lawful, non-infringing, and aligned with the Code of Conduct.",
        ],
      },
      {
        heading: "Content rights",
        body: [
          "Authors retain rights to their content subject to selected publication license.",
        ],
      },
    ],
  },
  {
    slug: "membership-grades",
    path: "/membership-grades",
    title: "Membership Grades & Criteria",
    summary: "View grade definitions, criteria, and upgrade pathways.",
    sections: [],
  },
];
