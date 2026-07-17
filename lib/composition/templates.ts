import { CompositionSchema, SectionData } from "./types";

export function getWeddingComposition(config: any): CompositionSchema {
  const sectionsOrder = config.sectionOrder || [
    "hero", "couple", "countdown", "events", "story", "gallery", "venue", "families", "rsvp", "faq", "dressCode"
  ];
  
  const sections: SectionData[] = sectionsOrder.map((sId: string) => {
    const isSecEnabled = config[sId]?.enabled !== false;
    let bindings: Record<string, string> = {};

    if (sId === "hero") {
      bindings = {
        title: "hero.title",
        subtitle: "hero.subtitle",
        welcomeMessage: "hero.welcomeMessage",
        heroImage: "hero.heroImage",
        ctaText: "hero.ctaText",
        surname: "hero.surname",
        subText: "hero.subText",
        enableHeaderMedia: "hero.enableHeaderMedia",
        headerMediaType: "hero.headerMediaType",
        selectedGod: "hero.selectedGod",
        selectedSymbol: "hero.selectedSymbol"
      };
    } else if (sId === "couple") {
      bindings = {
        title: "couple.title",
        groomName: "groom.name",
        groomParents: "groom.parents",
        groomImage: "groom.image",
        brideName: "bride.name",
        brideParents: "bride.parents",
        brideImage: "bride.image"
      };
    } else if (sId === "countdown") {
      bindings = {
        title: "countdown.title",
        targetDate: "countdown.targetDate"
      };
    } else if (sId === "events") {
      bindings = {
        events: "events"
      };
    } else if (sId === "story") {
      bindings = {
        title: "story.title",
        timeline: "story.timeline"
      };
    } else if (sId === "gallery") {
      bindings = {
        title: "gallery.title",
        images: "gallery.images"
      };
    } else if (sId === "venue") {
      bindings = {
        title: "venue.title",
        address: "venue.address",
        mapEmbedUrl: "venue.mapEmbedUrl"
      };
    } else if (sId === "families") {
      bindings = {
        title: "families.title",
        brideFamily: "families.brideFamily",
        groomFamily: "families.groomFamily"
      };
    } else if (sId === "rsvp") {
      bindings = {
        title: "rsvp.title",
        contacts: "rsvp.contacts"
      };
    } else if (sId === "faq") {
      bindings = {
        title: "faq.title",
        entries: "faq.entries"
      };
    } else if (sId === "dressCode") {
      bindings = {
        title: "dressCode.title",
        code: "dressCode.code",
        description: "dressCode.description"
      };
    }

    return {
      id: `sec-${sId}-node`,
      type: sId === "venue" ? "venue" : sId,
      bindings,
      properties: {
        enabled: isSecEnabled
      }
    };
  });

  if (config.footer?.enabled && !sections.some(s => s.type === "footer")) {
    sections.push({
      id: "sec-footer-node",
      type: "footer",
      bindings: {
        title: "footer.title",
        creditText: "footer.creditText",
        salutation: "footer.salutation"
      },
      properties: {
        enabled: true
      }
    });
  }

  return {
    templateId: "wedding-general",
    version: "1.0.0",
    theme: config.themeId || "luxury-gold",
    motion: config.motionId || "luxury-motion",
    sections,
    assets: {
      music: config.music?.file
    }
  };
}

export function getBirthdayComposition(config: any): CompositionSchema {
  const sectionsOrder = config.sectionOrder || [
    "hero", "celebrant", "countdown", "events", "gallery", "venue", "rsvp", "faq"
  ];

  const sections: SectionData[] = sectionsOrder.map((sId: string) => {
    const isSecEnabled = config[sId]?.enabled !== false;
    let bindings: Record<string, string> = {};

    if (sId === "hero") {
      bindings = {
        title: "hero.title",
        subtitle: "hero.subtitle",
        welcomeMessage: "hero.welcomeMessage",
        heroImage: "hero.heroImage",
        ctaText: "hero.ctaText",
        surname: "hero.surname",
        subText: "hero.subText"
      };
    } else if (sId === "celebrant") {
      bindings = {
        name: "celebrant.name",
        age: "age"
      };
    } else if (sId === "countdown") {
      bindings = {
        title: "countdown.title",
        targetDate: "countdown.targetDate"
      };
    } else if (sId === "events") {
      bindings = {
        events: "events"
      };
    } else if (sId === "gallery") {
      bindings = {
        title: "gallery.title",
        images: "gallery.images"
      };
    } else if (sId === "venue") {
      bindings = {
        title: "venue.title",
        address: "venue.address",
        mapEmbedUrl: "venue.mapEmbedUrl"
      };
    } else if (sId === "rsvp") {
      bindings = {
        title: "rsvp.title",
        contacts: "rsvp.contacts"
      };
    } else if (sId === "faq") {
      bindings = {
        title: "faq.title",
        entries: "faq.entries"
      };
    }

    return {
      id: `sec-${sId}-node`,
      type: sId === "venue" ? "venue" : sId,
      bindings,
      properties: {
        enabled: isSecEnabled
      }
    };
  });

  if (config.footer?.enabled && !sections.some(s => s.type === "footer")) {
    sections.push({
      id: "sec-footer-node",
      type: "footer",
      bindings: {
        title: "footer.title",
        creditText: "footer.creditText",
        salutation: "footer.salutation"
      },
      properties: {
        enabled: true
      }
    });
  }

  return {
    templateId: "birthday-general",
    version: "1.0.0",
    theme: config.themeId || "luxury-gold",
    motion: config.motionId || "luxury-motion",
    sections,
    assets: {
      music: config.music?.file
    }
  };
}
