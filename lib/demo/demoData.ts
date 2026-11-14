import { getManifest } from "@/lib/template-manifests";
import roseDemoJson from "@/components/data/invites/demo.json";
import lotusDemoJson from "@/components/data/invites/lotus-mandapam.json";

/**
 * Public path to the shared demo wedding video served from /public/demo/.
 */
const DEMO_VIDEO_SRC = "/demo/wedding-video.mp4";

/**
 * Provides safe, isolated, production-fidelity sample data for the 4 official demo showcases.
 * Leaves all original template configurations, defaults, and source files unmodified.
 * All demos use the shared wedding-video.mp4 for their video sections.
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
        // Inject demo video for the pre-wedding video section
        video: {
          ...(manifestDefaults?.video || {}),
          videoSrc: DEMO_VIDEO_SRC,
          enabled: true,
        },
        story: {
          ...(manifestDefaults?.story || {}),
          videoSrc: DEMO_VIDEO_SRC,
        },
      };
    }

    case "gopuram": {
      const manifestDefaults = getManifest("gopuram")?.defaults;
      return {
        ...manifestDefaults,
        themeId: "gopuram",
        status: "published",
        _status: "published",
        // Inject demo video for the pre-wedding video section
        video: {
          ...(manifestDefaults?.video || {}),
          videoSrc: DEMO_VIDEO_SRC,
          enabled: true,
        },
        story: {
          ...(manifestDefaults?.story || {}),
          videoSrc: DEMO_VIDEO_SRC,
        },
      };
    }

    case "rose-mandap": {
      return {
        ...roseDemoJson,
        themeId: "rose-mandap",
        status: "published",
        _status: "published",
        // Inject demo video for the wedding film section (uses videoConfig.url)
        video: {
          ...((roseDemoJson as any).video || {}),
          url: DEMO_VIDEO_SRC,
          enabled: true,
        },
        story: {
          ...((roseDemoJson as any).story || {}),
          videoSrc: DEMO_VIDEO_SRC,
        },
      };
    }

    case "lotus-mandap": {
      return {
        ...lotusDemoJson,
        themeId: "lotus-mandapam",
        status: "published",
        _status: "published",
        // Inject demo video for the wedding film section (uses videoConfig.url)
        video: {
          ...((lotusDemoJson as any).video || {}),
          url: DEMO_VIDEO_SRC,
          enabled: true,
        },
        story: {
          ...((lotusDemoJson as any).story || {}),
          videoSrc: DEMO_VIDEO_SRC,
        },
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
