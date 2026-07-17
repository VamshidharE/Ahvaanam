import { CategoryDefinition } from "./types";

/**
 * Definition for the Wedding invitation category.
 * Captures core details about the groom, bride, and ceremony event.
 */
export const weddingCategory: CategoryDefinition = {
  id: "wedding",
  name: "Wedding",
  icon: "heart",
  description: "Create a beautiful digital invitation for your wedding ceremony.",
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
      placeholder: "Enter wedding ceremony venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "Location where the wedding ceremony will be held."
    },
    {
      key: "date",
      label: "Date",
      placeholder: "Select wedding ceremony date",
      type: "date",
      required: true,
      group: "event_details",
      description: "The date of the wedding ceremony."
    },
    {
      key: "time",
      label: "Time",
      placeholder: "Select wedding ceremony time",
      type: "time",
      required: true,
      group: "event_details",
      description: "The auspicious time (muhurtham) of the ceremony."
    }
  ]
};
