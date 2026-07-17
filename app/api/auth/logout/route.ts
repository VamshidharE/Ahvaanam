import { NextResponse } from "next/server";
import { AUTH_CONFIG } from "../../../../lib/auth/config";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_CONFIG.COOKIE_NAME);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
