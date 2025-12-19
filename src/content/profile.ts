import type { MembershipGrade } from "@/lib/membership";

export type EducationEntry = {
  school: string;
  degree: string;
};

export type WorkExperienceEntry = {
  company: string;
  title: string;
  start: string;
  end: string;
};

export type Profile = {
  name: string;
  location: string;
  email: string;
  linkedinUrl: string;
  photo: {
    src: string;
    alt: string;
  };
  membershipGrade: MembershipGrade;
  education: EducationEntry[];
  experience: WorkExperienceEntry[];
};

export const profile: Profile = {
  name: "Sanjay Devnani",
  location: "Palo Alto, California",
  email: "sanjay.devnani@gmail.com",
  linkedinUrl: "https://linkedin.com/in/sanjaydevnani",
  photo: {
    src: "/profile.svg",
    alt: "Profile picture for Sanjay Devnani",
  },
  membershipGrade: "member",
  education: [
    { school: "University of Utah", degree: "M.S., Computer Science" },
    {
      school: "JNTU",
      degree: "B.Tech, Electrical and Electronics Engineering",
    },
  ],
  experience: [
    {
      company: "Google",
      title: "Manager, Systems Security Architecture",
      start: "Jan 2023",
      end: "Present",
    },
    {
      company: "Meta",
      title: "Privacy Engineer / Tech Lead Manager",
      start: "Mar 2022",
      end: "Jan 2023",
    },
    {
      company: "Apple",
      title: "Software Engineer / Engineering Manager",
      start: "Nov 2015",
      end: "Aug 2021",
    },
    {
      company: "Qualcomm",
      title: "Senior Software Engineer",
      start: "Apr 2013",
      end: "Nov 2015",
    },
    {
      company: "LSI",
      title: "Systems Engineer",
      start: "May 2011",
      end: "Apr 2013",
    },
  ],
};

