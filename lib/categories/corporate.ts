import { CategoryDefinition } from "./types";

/**
 * Definition for the Corporate invitation category.
 * For professional business events, product launches, or seminars.
 */
export const corporateCategory: CategoryDefinition = {
  id: "corporate",
  name: "Corporate Event",
  icon: "briefcase",
  description: "Invite clients and colleagues to professional events, seminars, or summits.",
  supportsCouple: false,
  templateCategory: "corporate",
  fields: [
    {
      key: "company",
      label: "Company",
      placeholder: "Enter company name",
      type: "text",
      required: true,
      group: "basics",
      description: "The company hosting the corporate event."
    },
    {
      key: "eventTitle",
      label: "Event Title",
      placeholder: "Enter event title",
      type: "text",
      required: true,
      group: "basics",
      description: "The title/name of the corporate event."
    },
    {
      key: "speaker",
      label: "Speaker",
      placeholder: "Enter guest speaker's name",
      type: "text",
      required: true,
      group: "basics",
      description: "The primary speaker or presenter at the event."
    },
    {
      key: "venue",
      label: "Venue",
      placeholder: "Enter event venue address",
      type: "textarea",
      required: true,
      group: "event_details",
      description: "The venue where the corporate event takes place."
    }
  ]
};
