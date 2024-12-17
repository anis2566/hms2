import {
  FileText,
  LucideIcon,
  Calendar,
  FileSpreadsheet,
  DollarSign,
  User,
  Heart,
  GalleryVertical,
} from "lucide-react";

export const AUTH_COOKIE = "access-token";

export enum ROLE {
  ADMIN = "ADMIN",
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
}

export enum STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum APPOINTMENT_STATUS {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum BLOOD_GROUP {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

export enum TITLE {
  DR = "Dr.",
  MR = "Mr.",
  MRS = "Mrs.",
  MS = "Ms.",
}

export enum MEDICINE_INSTRUCTION {
  BEFORE_MEAL = "Before Meal",
  AFTER_MEAL = "After Meal",
  WITH_FOOD = "With Food",
  WITH_WATER = "With Water",
  AS_NEEDED = "As Needed",
  AS_DIRECTED = "As Directed",
}

export enum MEDICINE_FREQUENCY {
  ONCE_A_DAY = "Once a Day",
  TWICE_A_DAY = "Twice a Day",
  THREE_TIMES_A_DAY = "Three Times a Day",
  FOUR_TIMES_A_DAY = "Four Times a Day",
  FIVE_TIMES_A_DAY = "Five Times a Day",
}

export enum MEDICINE_DOSAGE {
  MORNING = "Morning (M)",
  AFTERNOON = "Afternoon (A)",
  EVENING = "Evening (E)",
}

export enum PAYMENT_METHOD {
  CASH = "Cash",
  BANK_TRANSFER = "Bank_Transfer",
  CARD = "Card",
}

export enum PAYMENT_STATUS {
  PENDING = "Pending",
  PAID = "Paid",
  CANCELLED = "Cancelled",
}

export enum SERVICE_STATUS {
  ENABLED = "Enabled",
  DISABLED = "Disabled",
}

export const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type PatientSidebarNavs = {
  href: string;
  label: string;
  icon: LucideIcon;
  isHome?: boolean;
};

export const patientSidebarNavs: PatientSidebarNavs[] = [
  {
    href: "/",
    label: "Medical Record",
    icon: FileText,
  },
  {
    href: "/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  {
    href: "/invoices",
    label: "Invoices",
    icon: FileSpreadsheet,
  },
  {
    href: "/payments",
    label: "Payments",
    icon: DollarSign,
  },
  {
    href: "/images",
    label: "Images",
    icon: GalleryVertical,
  },
  {
    href: "/profile",
    label: "Personal Information",
    icon: User,
    isHome: true,
  },
  {
    href: "/health",
    label: "Health Information",
    icon: Heart,
  },
];
