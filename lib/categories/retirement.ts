import { CategoryDefinition } from "./types";

/**
 * Definition for the Retirement invitation category.
 * Commemorates a career milestone and retirement party.
 */
export const retirementCategory: CategoryDefinition = {
  id: "retirement",
  name: "Retirement",
  icon: "gift",
  description: "Honor a distinguished career and celebrate a well-deserved retirement.",
  supportsCouple: false,
  templateCategory: "retirement",
  fields: [
    {
      key: "honoree.name",
      label: "Honoree Name",
      placeholder: "Enter retiree's name",
      type: "text",
      required: true,
      group: "basics",
      description: "The name of the person who is retiring."
    },
    {
      key: "organization",
      label: "Organization",
      placeholder: "Enter organization/company name",
      type: "text",
      required: true,
      group: "basics",
      description: "The organization the honoree is retiring from."
    },
    {
      key: "venue",
      label: "Venue",
      placeholder: "Enter celebration venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "The venue where the retirement party is hosted."
    },
    {
      key: "date",
      label: "Date",
      placeholder: "Select celebration date",
      type: "date",
      required: true,
      group: "event_details",
      description: "The date of the retirement celebration."
    }
  ]
};
