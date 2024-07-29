import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EducationLevel, Island } from "./types";
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

type IslandItem = {
  name: Island,
  coordinates: [number, number]
}

export const islandCoordinates: IslandItem[] = [
  {
    name: "Kiribati",
    coordinates: [
      -157.3625, 1.8639
    ]
  },
  {
    name: "Marshall Islands",
    coordinates: [
      171.1845, 7.1315
    ]
  },
  {
    name: "Nauru",
    coordinates: [
      166.9315, -0.5228
    ]
  },
  {
    name: "Palau",
    coordinates: [
      134.5825, 7.5150
    ]
  },
  {
    name: "Tonga",
    coordinates: [
      -175.1982, -21.1790
    ]
  },
  {
    name: "Tuvalu",
    coordinates: [
      179.1940, -7.1095
    ]
  },
  {
    name: "Vanuatu",
    coordinates: [
      167.9547, -15.3767
    ]
  }
];
