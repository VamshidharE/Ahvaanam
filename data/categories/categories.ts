import { Category } from "../../types/category";

export const CATEGORIES: Category[] = [
  {
    id: "wedding",
    slug: "wedding",
    name: "Wedding",
    description: "Traditional and modern wedding invitations",
    icon: "Heart",
    coverImage: "/images/categories/wedding.jpg",
    gradient: "from-rose-500 to-pink-500",
    enabled: true,
    displayOrder: 1
  },
  {
    id: "birthday",
    slug: "birthday",
    name: "Birthday",
    description: "Celebrate milestones with fun themes",
    icon: "Cake",
    coverImage: "/images/categories/birthday.jpg",
    gradient: "from-amber-400 to-orange-500",
    enabled: true,
    displayOrder: 2
  },
  {
    id: "engagement",
    slug: "engagement",
    name: "Engagement",
    description: "Ring ceremony layouts and profiles",
    icon: "Sparkles",
    coverImage: "/images/categories/engagement.jpg",
    gradient: "from-cyan-400 to-blue-500",
    enabled: false,
    displayOrder: 3
  },
  {
    id: "anniversary",
    slug: "anniversary",
    name: "Anniversary",
    description: "Milestone anniversary invitations",
    icon: "Gift",
    coverImage: "/images/categories/anniversary.jpg",
    gradient: "from-emerald-400 to-teal-600",
    enabled: false,
    displayOrder: 4
  },
  {
    id: "temple-ceremony",
    slug: "temple-ceremony",
    name: "Temple Ceremony",
    description: "Sacred rituals and temple events",
    icon: "Calendar",
    coverImage: "/images/categories/temple.jpg",
    gradient: "from-yellow-500 to-red-600",
    enabled: false,
    displayOrder: 5
  },
  {
    id: "house-warming",
    slug: "house-warming",
    name: "House Warming",
    description: "Welcome friends to your new home",
    icon: "Home",
    coverImage: "/images/categories/housewarming.jpg",
    gradient: "from-indigo-500 to-purple-600",
    enabled: false,
    displayOrder: 6
  },
  {
    id: "baby-shower",
    slug: "baby-shower",
    name: "Baby Shower",
    description: "Joyous baby shower invitations",
    icon: "Baby",
    coverImage: "/images/categories/babyshower.jpg",
    gradient: "from-pink-300 to-rose-400",
    enabled: false,
    displayOrder: 7
  },
  {
    id: "naming-ceremony",
    slug: "naming-ceremony",
    name: "Naming Ceremony",
    description: "Traditional baby naming functions",
    icon: "Smile",
    coverImage: "/images/categories/naming.jpg",
    gradient: "from-teal-300 to-cyan-500",
    enabled: false,
    displayOrder: 8
  },
  {
    id: "retirement",
    slug: "retirement",
    name: "Retirement",
    description: "Honor a lifetime of achievements",
    icon: "Compass",
    coverImage: "/images/categories/retirement.jpg",
    gradient: "from-violet-400 to-indigo-600",
    enabled: false,
    displayOrder: 9
  },
  {
    id: "graduation",
    slug: "graduation",
    name: "Graduation",
    description: "Commemorate academic success",
    icon: "GraduationCap",
    coverImage: "/images/categories/graduation.jpg",
    gradient: "from-blue-600 to-indigo-800",
    enabled: false,
    displayOrder: 10
  },
  {
    id: "corporate-event",
    slug: "corporate-event",
    name: "Corporate Event",
    description: "Professional conferences and galas",
    icon: "Briefcase",
    coverImage: "/images/categories/corporate.jpg",
    gradient: "from-slate-600 to-zinc-800",
    enabled: false,
    displayOrder: 11
  },
  {
    id: "custom-event",
    slug: "custom-event",
    name: "Custom Event",
    description: "Bespoke designs for unique events",
    icon: "Plus",
    coverImage: "/images/categories/custom.jpg",
    gradient: "from-fuchsia-500 to-pink-600",
    enabled: false,
    displayOrder: 12
  }
];
