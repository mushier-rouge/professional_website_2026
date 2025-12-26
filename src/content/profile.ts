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
  name: "John Doe",
  location: "Remote",
  email: "john.doe@example.com",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  photo: {
    src: "/profile.svg",
    alt: "Profile picture for John Doe",
  },
  membershipGrade: "member",
  education: [
    { school: "State University", degree: "M.S., Computer Science" },
    {
      school: "Example Institute of Technology",
      degree: "B.S., Electrical Engineering",
    },
  ],
  experience: [
    {
      company: "Example Labs",
      title: "Engineering Manager",
      start: "Jan 2022",
      end: "Present",
    },
    {
      company: "Fictional Tech Co.",
      title: "Senior Software Engineer",
      start: "May 2019",
      end: "Dec 2021",
    },
    {
      company: "Sample Systems",
      title: "Software Engineer",
      start: "Jun 2016",
      end: "Apr 2019",
    },
    {
      company: "Acme Hardware",
      title: "Systems Engineer",
      start: "Jul 2013",
      end: "May 2016",
    },
  ],
};
