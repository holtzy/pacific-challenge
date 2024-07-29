export type Island = "Kiribati" | "Marshall Islands" | "Nauru" | "Palau" | "Tonga" | "Tuvalu" | "Vanuatu"
export const allIslandNames: Island[] = ["Kiribati", "Marshall Islands", "Nauru", "Palau", "Tonga", "Tuvalu", "Vanuatu"]

export type Sex = "Male" | "Female"

export type AgeGroup = "25-54" | "55-64"

export type EducationLevel = "Early childhood education" | "Primary education" | "Lower secondary education" | "Upper secondary education" | "Post-secondary non-tertiary education" | "Tertiary education"
export const allEducationLevels: EducationLevel[] = ["Early childhood education", "Primary education", "Lower secondary education", "Upper secondary education", "Post-secondary non-tertiary education", "Tertiary education"]

export type EducationLevelItem = {
    island: Island;
    year: number;
    count: number;
    sex: Sex;
    age: AgeGroup;
    level: EducationLevel;
};
