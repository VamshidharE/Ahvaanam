import { InvitationConfig } from "../../components/types/invitation";
import weddingConfig from "../defaults/wedding";
import engagementConfig from "../defaults/engagement";
import birthdayConfig from "../defaults/birthday";
import housewarmingConfig from "../defaults/housewarming";
import retirementConfig from "../defaults/retirement";
import halfsareeConfig from "../defaults/halfsaree";
import babyshowerConfig from "../defaults/babyshower";
import namingceremonyConfig from "../defaults/namingceremony";
import corporateConfig from "../defaults/corporate";
import festivalConfig from "../defaults/festival";

/**
 * Creates and returns a deep clone of the default configuration template for the specified category.
 * Returns a strongly-typed InvitationConfig structure.
 *
 * @param categoryId The category ID to get the default configuration for (e.g., "wedding", "birthday").
 * @returns A deep cloned copy of the default configuration wrapper for the category.
 * @throws Error if the categoryId is invalid, unknown, or not supported.
 */
export function createDefaultConfig(categoryId: string): InvitationConfig {
  let sourceConfig: InvitationConfig;

  switch (categoryId.toLowerCase()) {
    case "wedding":
      sourceConfig = weddingConfig;
      break;
    case "engagement":
      sourceConfig = engagementConfig;
      break;
    case "birthday":
      sourceConfig = birthdayConfig;
      break;
    case "housewarming":
      sourceConfig = housewarmingConfig;
      break;
    case "retirement":
      sourceConfig = retirementConfig;
      break;
    case "halfsaree":
      sourceConfig = halfsareeConfig;
      break;
    case "babyshower":
      sourceConfig = babyshowerConfig;
      break;
    case "namingceremony":
      sourceConfig = namingceremonyConfig;
      break;
    case "corporate":
      sourceConfig = corporateConfig;
      break;
    case "festival":
      sourceConfig = festivalConfig;
      break;
    default:
      throw new Error(`Unknown invitation category: "${categoryId}"`);
  }

  // Deep clone the object using JSON serialization/deserialization to ensure no shared references
  return JSON.parse(JSON.stringify(sourceConfig)) as InvitationConfig;
}
