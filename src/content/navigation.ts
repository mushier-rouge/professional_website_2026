export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Members", href: "/members" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
];

export const memberNav: NavItem[] = [
  { label: "Account", href: "/account" },
  { label: "Edit profile", href: "/profile/edit" },
  { label: "Membership grades", href: "/membership-grades" },
];
