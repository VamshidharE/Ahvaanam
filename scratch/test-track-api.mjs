import pkg from "@next/env";
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

import { POST } from "../app/api/invitation/[id]/analytics/track/route.js";

async function testApi() {
  const req = new Request("http://localhost:3000/api/invitation/nitin-sriyuktha/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: "test-api-session-" + Date.now(),
      device_type: "mobile",
      event_type: "session_start",
      duration_seconds: 0,
      scroll_depth: 0,
    }),
  });

  const res = await POST(req, { params: Promise.resolve({ id: "nitin-sriyuktha" }) });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Response:", data);
}

testApi().catch(console.error);
