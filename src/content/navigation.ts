export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Members", href: "/members" },
  { label: "Articles", href: "/articles" },
  { label: "Collections", href: "/collections" },
  { label: "Issues", href: "/issues" },
  { label: "About", href: "/about" },
];

export const memberNav: NavItem[] = [
  { label: "Account", href: "/account" },
  { label: "Edit profile", href: "/profile/edit" },
  { label: "My applications", href: "/account/applications" },
  { label: "Membership grades", href: "/membership-grades" },
  { label: "Apply for upgrade", href: "/membership/apply" },
];

export const reviewerNav: NavItem[] = [
  { label: "Reviewer dashboard", href: "/reviewer" },
  { label: "My reviews", href: "/reviewer" },
];

export const editorNav: NavItem[] = [
  { label: "Editor dashboard", href: "/editor" },
  { label: "Submissions", href: "/editor" },
];

export const adminNav: NavItem[] = [
  { label: "Applications", href: "/admin/applications" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Topics", href: "/admin/topics" },
];
