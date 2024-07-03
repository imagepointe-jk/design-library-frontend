import { Design } from "./dbSchema";

export function deduplicateStrings(strings: string[]) {
  const set = new Set(strings);
  return Array.from(set);
}

export function makeStringTitleCase(str: string) {
  return str
    .split(" ")
    .map((word) => `${word[0].toUpperCase()}${word.substring(1)}`)
    .join(" ");
}

//gets the timestamp of the date X years before the current date.
export function getTimeStampYearsAgo(yearsAgo: number) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);
  return date.getTime();
}

export function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function getDesignTags(design: Design) {
  return design.designTags.map((tag) => tag.name);
}

export function getDesignDefaultBackgroundColor(design: Design) {
  return `#${design.defaultBackgroundColor.hexCode}`;
}

export function splitDesignCategoryHierarchy(hierarchy: string) {
  const split = hierarchy.split(" > ");
  return {
    category: split[0],
    subcategory: split[1],
  };
}

export function isImageTransparent(imageUrl: string) {
  //assume for now that all PNGs are transparent
  return imageUrl.endsWith(".png");
}
