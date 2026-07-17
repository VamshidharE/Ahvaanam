import { CategoryDefinition } from "./types";

/**
 * Definition for the Baby Shower invitation category.
 * Celebrates upcoming parenthood and the new baby.
 */
export const babyshowerCategory: CategoryDefinition = {
  id: "babyshower",
  name: "Baby Shower",
  icon: "baby",
  description: "Celebrate the upcoming arrival of a new baby with family and friends.",
  supportsCouple: false,
  templateCategory: "babyshower",
  fields: [
    {
      key: "mother.name",
      label: "Mother Name",
      placeholder: "Enter mother's name",
      type: "text",
      required: true,
      group: "basics",
      description: "The name of the mother-to-be."
    },
    {
      key: "father.name",
      label: "Father Name",
      placeholder: "Enter father's name",
      type: "text",
      required: true,
      group: "basics",
      description: "The name of the father-to-be."
    },
    {
      key: "venue",
      label: "Venue",
      placeholder: "Enter baby shower venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "The venue where the baby shower will be held."
    }
  ]
};
