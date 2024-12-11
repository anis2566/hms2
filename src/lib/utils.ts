import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInYears, differenceInMonths } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateAge = (dob: Date) => {
  const today = new Date();
  const years = differenceInYears(today, dob);
  if (years === 0) {
    const months = differenceInMonths(today, dob);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
  return `${years} year${years !== 1 ? "s" : ""}`;
};
