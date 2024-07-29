import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EducationLevel } from "./types";
import { scaleOrdinal } from "d3-scale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sexColorScale = scaleOrdinal<string>()
  .domain(["Male", "Female"])
  .range(["red", "blue"]);

export const educationLevelItems: { label: string; value: EducationLevel }[] = [
  {
    label: "Childhood",
    value: "Early childhood education",
  },
  {
    label: "Primary",
    value: "Primary education",
  },
  {
    label: "Lower 2nd",
    value: "Lower secondary education",
  },
  {
    label: "Upper 2nd",
    value: "Upper secondary education",
  },
  {
    label: "Post 2nd",
    value: "Post-secondary non-tertiary education",
  },
  {
    label: "Tertiary",
    value: "Tertiary education",
  },
];
