import { CategoryDefinition } from "./types";

/**
 * Definition for the Birthday invitation category.
 * Captures details for celebrating a milestone birthday.
 */
export const birthdayCategory: CategoryDefinition = {
  id: "birthday",
  name: "Birthday",
  icon: "cake",
  description: "Invite friends and family to celebrate a special birthday milestone.",
  supportsCouple: false,
  templateCategory: "birthday",
  fields: [
    {
      key: "celebrant.name",
      label: "Celebrant Name",
      placeholder: "Enter birthday person's name",
      type: "text",
      required: true,
      group: "basics",
      description: "The name of the person celebrating their birthday."
    },
    {
      key: "age",
      label: "Age",
      placeholder: "Enter age being celebrated",
      type: "number",
      required: true,
      group: "basics",
      description: "The age the celebrant is turning."
    },
    {
      key: "venue",
      label: "Venue",
      placeholder: "Enter party venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "The location of the birthday party."
    },
    {
      key: "date",
      label: "Date",
      placeholder: "Select party date",
      type: "date",
      required: true,
      group: "event_details",
      description: "The date of the birthday party."
    },
    {
      key: "time",
      label: "Time",
      placeholder: "Select party time",
      type: "time",
      required: true,
      group: "event_details",
      description: "The start time of the party."
    }
  ]
};
