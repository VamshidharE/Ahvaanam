import { CategoryDefinition } from "./types";

/**
 * Definition for the Naming Ceremony invitation category.
 * Officially welcomes and names the newborn child.
 */
export const namingceremonyCategory: CategoryDefinition = {
  id: "namingceremony",
  name: "Naming Ceremony",
  icon: "smile",
  description: "Welcome your newborn and share their name with the community.",
  supportsCouple: false,
  templateCategory: "namingceremony",
  fields: [
    {
      key: "baby.name",
      label: "Baby Name",
      placeholder: "Enter baby's name (or TBD)",
      type: "text",
      required: true,
      group: "basics",
      description: "The name being given to the baby."
    },
    {
      key: "parents",
      label: "Parents",
      placeholder: "Enter parents' names",
      type: "text",
      required: true,
      group: "hosts",
      description: "The names of the baby's parents."
    }
  ]
};
