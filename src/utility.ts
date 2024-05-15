// import { TempDesign } from "./sharedTypes";
import { Design } from "./dbSchema";
// import { DesignQueryParams } from "./types";

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
  // const {
  //   Tag1,
  //   Tag2,
  //   Tag3,
  //   Tag4,
  //   Tag5,
  //   Tag6,
  //   Tag7,
  //   Tag8,
  //   Tag9,
  //   Tag10,
  //   Tag11,
  //   Tag12,
  // } = design;
  // return [
  //   Tag1,
  //   Tag2,
  //   Tag3,
  //   Tag4,
  //   Tag5,
  //   Tag6,
  //   Tag7,
  //   Tag8,
  //   Tag9,
  //   Tag10,
  //   Tag11,
  //   Tag12,
  // ];
  return design.designTags.map((tag) => tag.name);
}

// export function getDesignCategoryHierarchies(design: Design) {
//   const {
//     Subcategory1,
//     Subcategory2,
//     Subcategory3,
//     Subcategory4,
//     Subcategory5,
//   } = design;
//   return [Subcategory1, Subcategory2, Subcategory3, Subcategory4, Subcategory5];
// }

// export function getFirstHexCodeInString(str: string) {
//   const match = str.match(/#[a-zA-Z\d]{6}/g);
//   return match ? match[0] : null;
// }

export function getDesignDefaultBackgroundColor(design: Design) {
  return `#${design.defaultBackgroundColor.hexCode}`;
  // const hexCode = getFirstHexCodeInString(design.DefaultBackgroundColor);
  // if (!hexCode) {
  //   console.error(
  //     `Couldn't find hex code in ${design.DefaultBackgroundColor} for design ${design.DesignNumber}`
  //   );
  //   return "";
  // }
  // return hexCode;
}

export function splitDesignCategoryHierarchy(hierarchy: string) {
  const split = hierarchy.split(" > ");
  return {
    category: split[0],
    subcategory: split[1],
  };
}

// type DesignId = {
//   designId: number;
// };

// function isDesignId(param: any): param is DesignId {
//   return param && typeof param.designId === "number";
// }

export function isDesignTransparent(design: Design) {
  //assume for now that all PNGs are transparent
  return design.imageUrl.endsWith(".png");
}
