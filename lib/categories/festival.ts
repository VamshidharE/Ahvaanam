import { CategoryDefinition } from "./types";

/**
 * Definition for the Festival invitation category.
 * For traditional seasonal gatherings and events.
 */
export const festivalCategory: CategoryDefinition = {
  id: "festival",
  name: "Festival Celebration",
  icon: "star",
  description: "Celebrate festive seasons and gather for cultural events.",
  supportsCouple: false,
  templateCategory: "festival",
  fields: [
    {
      key: "festivalName",
      label: "Festival Name",
      placeholder: "Enter festival name (e.g., Diwali, Pongal)",
      type: "text",
      required: true,
      group: "basics",
      description: "The name of the festival being celebrated."
    },
    {
      key: "venue",
      label: "Venue",
      placeholder: "Enter celebration venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "The location of the festive celebration."
    }
  ]
};
