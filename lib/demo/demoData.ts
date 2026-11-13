import { getManifest } from "@/lib/template-manifests";
import roseDemoJson from "@/components/data/invites/demo.json";
import lotusDemoJson from "@/components/data/invites/lotus-mandapam.json";

/**
 * Provides safe, isolated, production-fidelity sample data for the 4 official demo showcases.
 * Leaves all original template configurations, defaults, and source files unmodified.
 */
export function getDemoSampleData(slug: string, templateId: string): any {
  switch (slug) {
    case "pelli-pandiri": {
      const manifestDefaults = getManifest("pelli-pandiri")?.defaults;
      return {
        ...manifestDefaults,
        themeId: "pelli-pandiri",
        status: "published",
        _status: "published",
      };
    }

    case "gopuram": {
      const manifestDefaults = getManifest("gopuram")?.defaults;
      return {
        ...manifestDefaults,
        themeId: "gopuram",
        status: "published",
        _status: "published",
      };
    }

    case "rose-mandap": {
      return {
        ...roseDemoJson,
        themeId: "rose-mandap",
        status: "published",
        _status: "published",
      };
    }

    case "lotus-mandap": {
      return {
        ...lotusDemoJson,
        themeId: "lotus-mandapam",
        status: "published",
        _status: "published",
      };
    }

    default: {
      const manifestDefaults = getManifest(templateId)?.defaults;
      return {
        ...(manifestDefaults || {}),
        themeId: templateId,
        status: "published",
        _status: "published",
      };
    }
  }
}
