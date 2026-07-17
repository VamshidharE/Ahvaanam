import { CategoryDefinition } from "./types";

/**
 * Definition for the Engagement invitation category.
 * Captures core details about the groom, bride, and ring ceremony event.
 */
export const engagementCategory: CategoryDefinition = {
  id: "engagement",
  name: "Engagement",
  icon: "ring",
  description: "Announce and invite guests to your ring exchange and engagement ceremony.",
  supportsCouple: true,
  templateCategory: "wedding",
  fields: [
    {
      key: "groom.name",
      label: "Groom Name",
      placeholder: "Enter groom's full name",
      type: "text",
      required: true,
      group: "basics",
      description: "The full name of the groom."
    },
    {
      key: "bride.name",
      label: "Bride Name",
      placeholder: "Enter bride's full name",
      type: "text",
      required: true,
      group: "basics",
      description: "The full name of the bride."
    },
    {
      key: "venue",
      label: "Venue",
      placeholder: "Enter engagement venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "Location where the engagement ceremony will be held."
    },
    {
      key: "date",
      label: "Date",
      placeholder: "Select engagement date",
      type: "date",
      required: true,
      group: "event_details",
      description: "The date of the engagement ceremony."
    },
    {
      key: "time",
      label: "Time",
      placeholder: "Select engagement time",
      type: "time",
      required: true,
      group: "event_details",
      description: "The time of the engagement ceremony."
    }
  ]
};
