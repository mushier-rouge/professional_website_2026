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
          "The AI/ML Society exists to advance trustworthy artificial intelligence and machine learning practice through rigorous peer-reviewed research, professional development, and community engagement.",
          "We provide a platform for researchers, practitioners, and educators to share knowledge, collaborate on innovative solutions, and establish standards that promote responsible AI development and deployment.",
        ],
      },
      {
        heading: "Core Values",
        body: [
          "Scientific Rigor: We uphold the highest standards of evidence-based research and peer review.",
          "Transparency: We operate openly, documenting our processes and making our work accessible to the community.",
          "Inclusivity: We welcome diverse perspectives and work to reduce barriers to participation in AI/ML.",
          "Responsibility: We promote ethical considerations and the responsible deployment of AI systems.",
          "Collaboration: We foster partnerships across academia, industry, and government to accelerate progress.",
        ],
      },
      {
        heading: "Strategic Goals",
        body: [
          "Publish high-quality peer-reviewed articles that advance the state of the art in AI/ML research and practice.",
          "Develop professional standards and certifications that recognize expertise and promote best practices.",
          "Build a global community of AI/ML professionals committed to ethical and responsible innovation.",
          "Provide educational resources and mentorship opportunities to support career development in AI/ML.",
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
        heading: "Submission Process",
        body: [
          "Authors submit articles through our online platform, providing all required metadata and ensuring compliance with formatting guidelines.",
          "Initial submissions are screened by editors for scope, quality, and adherence to our submission guidelines.",
          "Articles that pass initial screening are assigned to expert peer reviewers based on their subject matter expertise.",
        ],
      },
      {
        heading: "Peer Review Process",
        body: [
          "All research articles undergo double-blind peer review to ensure impartial evaluation.",
          "Reviewers are given clear guidelines and templates to provide constructive, thorough feedback.",
          "Reviews typically assess originality, methodology, clarity, significance, and ethical considerations.",
          "The editorial board considers reviewer recommendations along with their own assessment to make final decisions.",
        ],
      },
      {
        heading: "Publication Decisions",
        body: [
          "Possible outcomes include: Accept, Accept with Minor Revisions, Major Revisions Required, or Reject.",
          "All decisions are documented with detailed rationale and tracked in our audit system.",
          "Authors receive comprehensive feedback regardless of outcome to support their continued work.",
          "Appeals may be submitted if authors believe the review process was flawed or biased.",
        ],
      },
      {
        heading: "Author Responsibilities",
        body: [
          "Authors must disclose all funding sources and potential conflicts of interest.",
          "Research involving human subjects must have appropriate ethical approval.",
          "Authors must confirm that work is original and has not been previously published.",
          "Data and code should be made available when possible to support reproducibility.",
        ],
      },
      {
        heading: "Post-Publication",
        body: [
          "Published articles may be corrected or retracted if errors or ethical violations are discovered.",
          "Readers can submit comments and engage in scholarly discussion on published articles.",
          "Citations and metrics are tracked to measure impact and reach of published work.",
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
        heading: "Our Commitment",
        body: [
          "The AI/ML Society is committed to providing a welcoming, inclusive, and harassment-free environment for all members, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.",
          "We value diverse perspectives and believe that constructive discourse strengthens our community and advances our mission.",
        ],
      },
      {
        heading: "Expected Behavior",
        body: [
          "Use welcoming and inclusive language in all communications.",
          "Be respectful of differing viewpoints and experiences.",
          "Gracefully accept constructive criticism and provide feedback in a professional manner.",
          "Focus on what is best for the community and the advancement of AI/ML research.",
          "Show empathy towards other community members.",
          "Disclose conflicts of interest when reviewing, endorsing, or discussing work.",
        ],
      },
      {
        heading: "Unacceptable Behavior",
        body: [
          "Harassment, intimidation, or discrimination in any form.",
          "Trolling, insulting/derogatory comments, and personal or political attacks.",
          "Public or private harassment, including unwelcome sexual attention or advances.",
          "Publishing others' private information without explicit permission.",
          "Plagiarism, falsification of data, or other forms of research misconduct.",
          "Other conduct which could reasonably be considered inappropriate in a professional setting.",
        ],
      },
      {
        heading: "Reporting and Enforcement",
        body: [
          "Violations can be reported to conduct@aimlsociety.org with details of the incident.",
          "All reports will be reviewed and investigated promptly and fairly.",
          "Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct.",
          "Consequences may include warnings, temporary suspension, or permanent ban depending on severity and frequency of violations.",
        ],
      },
      {
        heading: "Scope",
        body: [
          "This Code of Conduct applies within all community spaces, including online platforms, in-person events, and when representing the society in public spaces.",
          "It also applies when community members are acting as official representatives of the society.",
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
        heading: "Organizational Structure",
        body: [
          "The AI/ML Society is governed by a multi-tiered structure designed to ensure fair representation, expert oversight, and transparent decision-making.",
          "Leadership includes elected officers, appointed committee chairs, and volunteer members who contribute their expertise to various aspects of the society's operations.",
        ],
      },
      {
        heading: "Editorial Board",
        body: [
          "Oversees all publication activities, including journal strategy, editorial policies, and quality standards.",
          "Editor-in-Chief leads the board and makes final decisions on publication matters.",
          "Associate Editors manage specific topic areas and coordinate peer review processes.",
          "Reviews are conducted with editorial independence, free from commercial or political influence.",
        ],
      },
      {
        heading: "Membership Committee",
        body: [
          "Reviews applications for Senior Member and Fellow grade promotions.",
          "Evaluates candidates based on published criteria including professional achievements, contributions to the field, and service to the community.",
          "Maintains consistency in evaluation standards and provides feedback to applicants.",
          "Decisions are made collegially with documented rationale for transparency.",
        ],
      },
      {
        heading: "Fellows Committee",
        body: [
          "Manages the nomination and selection process for Fellow grade elevation.",
          "Reviews nomination packages including letters of support and evidence of sustained impact.",
          "Ensures Fellow designation recognizes truly exceptional contributions to AI/ML.",
          "Maintains the integrity and prestige of the Fellow grade.",
        ],
      },
      {
        heading: "Ethics and Conduct Committee",
        body: [
          "Investigates reported violations of the Code of Conduct and research integrity policies.",
          "Recommends appropriate responses ranging from warnings to membership termination.",
          "Ensures fair and confidential handling of all complaints.",
          "Provides guidance on ethical issues in AI/ML research and practice.",
        ],
      },
      {
        heading: "Transparency and Accountability",
        body: [
          "All committee decisions are logged in our audit system with detailed rationale.",
          "Annual reports summarize key activities, statistics, and strategic decisions.",
          "Members can request information about governance processes and policies.",
          "Financial records and organizational documents are available to members upon request.",
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
        heading: "Information We Collect",
        body: [
          "Account Information: Email address, name, institutional affiliation, and professional details you provide during registration.",
          "Profile Data: Biography, research interests, publications, and optional social media links.",
          "Submitted Content: Articles, reviews, comments, and other contributions to the platform.",
          "Usage Data: Information about how you interact with our services, including pages visited and features used.",
          "Technical Data: IP address, browser type, device information, and cookies for functionality and analytics.",
        ],
      },
      {
        heading: "How We Use Your Information",
        body: [
          "Membership Management: To create and maintain your account, process membership applications, and communicate society updates.",
          "Publishing Workflow: To facilitate article submission, peer review, and publication processes.",
          "Community Features: To enable member directory, profile pages, and professional networking.",
          "Communication: To send important notifications about your submissions, reviews, and membership status.",
          "Analytics: To understand platform usage and improve our services.",
        ],
      },
      {
        heading: "Data Sharing and Disclosure",
        body: [
          "Public Information: Your profile visibility settings control what information is displayed in the member directory.",
          "Peer Review: Reviewers may see author information depending on review type (single-blind vs. double-blind).",
          "Service Providers: We use trusted third-party services (e.g., Supabase for hosting) that have access to data only as needed to perform their functions.",
          "Legal Requirements: We may disclose information if required by law or to protect our rights and safety.",
          "We never sell your personal information to third parties.",
        ],
      },
      {
        heading: "Your Privacy Controls",
        body: [
          "Profile Visibility: Choose between public, unlisted, or private profile settings.",
          "Directory Opt-Out: Remove yourself from the public member directory while maintaining membership.",
          "Data Export: Request a complete export of your personal data at any time.",
          "Account Deletion: Request permanent deletion of your account and associated data.",
          "Communication Preferences: Control which email notifications you receive.",
        ],
      },
      {
        heading: "Data Security and Retention",
        body: [
          "We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.",
          "Data is encrypted in transit and at rest using modern cryptographic standards.",
          "We retain your data for as long as your account is active or as needed to provide services.",
          "After account deletion, some information may be retained in backups for up to 90 days before permanent deletion.",
          "Published articles and reviews may be retained for archival and academic record purposes.",
        ],
      },
      {
        heading: "Cookies and Tracking",
        body: [
          "Essential Cookies: Required for authentication, security, and basic site functionality.",
          "Analytics Cookies: Help us understand how users interact with our platform to improve user experience.",
          "You can control cookie preferences through your browser settings, though some functionality may be limited if cookies are disabled.",
        ],
      },
      {
        heading: "Contact and Updates",
        body: [
          "For privacy-related questions or to exercise your rights, contact privacy@aimlsociety.org.",
          "We may update this policy periodically. Significant changes will be communicated to members via email.",
          "Last updated: December 2025",
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
        heading: "Acceptance of Terms",
        body: [
          "By accessing or using the AI/ML Society platform, you agree to be bound by these Terms of Use.",
          "If you do not agree to these terms, you may not access or use our services.",
          "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the modified terms.",
        ],
      },
      {
        heading: "Account Registration and Security",
        body: [
          "You must provide accurate and complete information when creating an account.",
          "You are responsible for maintaining the confidentiality of your account credentials.",
          "You agree to notify us immediately of any unauthorized use of your account.",
          "One person may not maintain multiple accounts for the same purpose.",
        ],
      },
      {
        heading: "Acceptable Use",
        body: [
          "You may use our platform for lawful purposes in accordance with our mission and Code of Conduct.",
          "You may not use our services to transmit harmful, offensive, or illegal content.",
          "You may not attempt to gain unauthorized access to our systems or other users' accounts.",
          "You may not use automated tools to scrape or harvest data from the platform without permission.",
          "You may not impersonate other individuals or organizations.",
        ],
      },
      {
        heading: "Content and Intellectual Property",
        body: [
          "You retain ownership of content you submit to the platform, including articles, reviews, and comments.",
          "By submitting content, you grant the AI/ML Society a non-exclusive license to use, display, and distribute your content as necessary to provide our services.",
          "For published articles, specific license terms are selected at the time of publication (e.g., Creative Commons, All Rights Reserved).",
          "You represent that you have the right to submit all content and that it does not infringe on others' intellectual property rights.",
          "You may not submit plagiarized content or content that violates copyright, trademark, or other intellectual property laws.",
        ],
      },
      {
        heading: "Review and Moderation",
        body: [
          "We reserve the right to review, moderate, or remove content that violates these terms or our policies.",
          "We may suspend or terminate accounts that repeatedly violate our terms or policies.",
          "Decisions regarding content moderation can be appealed through our formal appeals process.",
        ],
      },
      {
        heading: "Disclaimers",
        body: [
          "Our platform is provided 'as is' without warranties of any kind, express or implied.",
          "We do not guarantee uninterrupted access or error-free operation of our services.",
          "We are not responsible for content submitted by users, though we may moderate such content.",
          "Scientific and technical content is provided for informational purposes and should not be considered professional advice.",
        ],
      },
      {
        heading: "Limitation of Liability",
        body: [
          "To the fullest extent permitted by law, the AI/ML Society shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.",
          "Our total liability for any claims related to our services shall not exceed the amount you paid us in the preceding 12 months.",
        ],
      },
      {
        heading: "Termination",
        body: [
          "You may terminate your account at any time through your account settings.",
          "We may suspend or terminate your access for violations of these terms, our policies, or applicable law.",
          "Upon termination, you lose access to our services, though published articles may remain in our archives.",
        ],
      },
      {
        heading: "Governing Law and Disputes",
        body: [
          "These terms are governed by the laws of the jurisdiction where the AI/ML Society is incorporated.",
          "Disputes shall be resolved through binding arbitration rather than in court, except where prohibited by law.",
          "You may opt out of arbitration by notifying us within 30 days of account creation.",
        ],
      },
      {
        heading: "Contact Information",
        body: [
          "For questions about these terms, contact legal@aimlsociety.org.",
          "Last updated: December 2025",
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
