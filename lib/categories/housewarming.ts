import { CategoryDefinition } from "./types";

/**
 * Definition for the Housewarming invitation category.
 * Captures details for a new home entry celebration (Griha Pravesham).
 */
export const housewarmingCategory: CategoryDefinition = {
  id: "housewarming",
  name: "Housewarming",
  icon: "home",
  description: "Celebrate moving into a new home with loved ones.",
  supportsCouple: false,
  templateCategory: "housewarming",
  fields: [
    {
      key: "hosts",
      label: "Hosts",
      placeholder: "Enter hosts' name(s)",
      type: "text",
      required: true,
      group: "hosts",
      description: "Names of the family hosts inviting the guests."
    },
    {
      key: "address",
      label: "Address",
      placeholder: "Enter the new home address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "The address of the new residence."
    },
    {
      key: "date",
      label: "Date",
      placeholder: "Select puja/party date",
      type: "date",
      required: true,
      group: "event_details",
      description: "The date of the housewarming ceremony/party."
    },
    {
      key: "time",
      label: "Time",
      placeholder: "Select puja/party time",
      type: "time",
      required: true,
      group: "event_details",
      description: "The time of the housewarming ceremony/party."
    }
  ]
};
