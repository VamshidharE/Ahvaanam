import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "@/lib/auth/isAdmin";
import {
  getAllDemoShowcases,
  getDemoShowcase,
  updateDemoShowcaseStatus,
  SUPPORTED_DEMO_SLUGS,
} from "@/lib/demo/demoService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/admin/demos
 * Retrieves the publication statuses of all 4 demo templates.
 */
export async function GET() {
  try {
    const demos = await getAllDemoShowcases();
    return NextResponse.json({ demos }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve demo showcases" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/demos
 * Toggles or updates the publication status of a specific demo showcase.
 * Strictly restricted to authorized administrators.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminUser(user.email)) {
    return NextResponse.json(
      { error: "Forbidden. Administrator privileges required." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { slug, is_published } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "A valid demo slug is required." },
        { status: 400 }
      );
    }

    const normalizedSlug = slug.toLowerCase().trim();
    if (!SUPPORTED_DEMO_SLUGS.includes(normalizedSlug)) {
      return NextResponse.json(
        { error: `Unsupported demo slug: "${slug}". Supported: ${SUPPORTED_DEMO_SLUGS.join(", ")}` },
        { status: 400 }
      );
    }

    if (typeof is_published !== "boolean") {
      return NextResponse.json(
        { error: "'is_published' boolean flag is required." },
        { status: 400 }
      );
    }

    const updateRes = await updateDemoShowcaseStatus(normalizedSlug, is_published);
    if (!updateRes.success) {
      return NextResponse.json(
        { error: updateRes.error || "Failed to update demo status" },
        { status: 500 }
      );
    }

    const updatedItem = await getDemoShowcase(normalizedSlug);
    return NextResponse.json({ success: true, demo: updatedItem }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
