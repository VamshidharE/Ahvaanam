import { CategoryDefinition } from "./types";

/**
 * Definition for the Half Saree invitation category.
 * A traditional South Indian milestone ceremony.
 */
export const halfsareeCategory: CategoryDefinition = {
  id: "halfsaree",
  name: "Half Saree",
  icon: "sparkles",
  description: "Invite guests to celebrate the traditional half saree ceremony (Langa Voni).",
  supportsCouple: false,
  templateCategory: "halfsaree",
  fields: [
    {
      key: "celebrant.name",
      label: "Celebrant Name",
      placeholder: "Enter girl's name",
      type: "text",
      required: true,
      group: "basics",
      description: "The name of the girl celebrating this transition milestone."
    },
    {
      key: "parents",
      label: "Parents",
      placeholder: "Enter parents' names",
      type: "text",
      required: true,
      group: "hosts",
      description: "The names of the parents hosting the ceremony."
    },
    {
      key: "venue",
      label: "Venue",
      placeholder: "Enter ceremony venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "The location of the ceremony."
    }
  ]
};
