import { weddingCategory } from "./wedding";
import { engagementCategory } from "./engagement";
import { birthdayCategory } from "./birthday";
import { housewarmingCategory } from "./housewarming";
import { retirementCategory } from "./retirement";
import { halfsareeCategory } from "./halfsaree";
import { babyshowerCategory } from "./babyshower";
import { namingceremonyCategory } from "./namingceremony";
import { corporateCategory } from "./corporate";
import { festivalCategory } from "./festival";
import { CategoryDefinition } from "./types";

export * from "./types";
export { weddingCategory } from "./wedding";
export { engagementCategory } from "./engagement";
export { birthdayCategory } from "./birthday";
export { housewarmingCategory } from "./housewarming";
export { retirementCategory } from "./retirement";
export { halfsareeCategory } from "./halfsaree";
export { babyshowerCategory } from "./babyshower";
export { namingceremonyCategory } from "./namingceremony";
export { corporateCategory } from "./corporate";
export { festivalCategory } from "./festival";

/**
 * Array of all supported invitation category definitions.
 * Useful for listing, selecting, and iterating over the categories.
 */
export const ALL_CATEGORIES: CategoryDefinition[] = [
  weddingCategory,
  engagementCategory,
  birthdayCategory,
  housewarmingCategory,
  retirementCategory,
  halfsareeCategory,
  babyshowerCategory,
  namingceremonyCategory,
  corporateCategory,
  festivalCategory,
];

/**
 * Map of category IDs to their respective category definitions.
 * Allows quick lookup of a category and its metadata configuration by ID.
 */
export const CATEGORY_MAP: Record<string, CategoryDefinition> = {
  wedding: weddingCategory,
  engagement: engagementCategory,
  birthday: birthdayCategory,
  housewarming: housewarmingCategory,
  retirement: retirementCategory,
  halfsaree: halfsareeCategory,
  babyshower: babyshowerCategory,
  namingceremony: namingceremonyCategory,
  corporate: corporateCategory,
  festival: festivalCategory,
};
