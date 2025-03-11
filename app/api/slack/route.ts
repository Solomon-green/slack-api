import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { type, challenge, event } = await req.json();

  // Handle Slack URL verification challenge
  if (type === "url_verification") {
    return NextResponse.json({ challenge });
  }

  // Handle Slack events
  if (type === "event_callback") {
    // Process the event here
    console.log("Event received:", event);

    const upworkUrlRegex = /^https:\/\/www\.upwork\.com\/jobs\/[^]*[0-9a-f]{16,24}\/?$/
    const jobLinks = event.links
      .filter((link: { url: string }) => upworkUrlRegex.test(link.url))
      .map((link: { url: string }) => link.url);

    if (jobLinks.length > 0) {
      const API_BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
      const response = await fetch(API_BASE as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ upworkUrl: jobLinks.slice(-1)[0] }),
      });
        console.log("Apply API response:", await response.json());
    }

    // Respond with 200 OK to acknowledge receipt of the event
    return NextResponse.json({ ok: true });
  }

  // If the event type is not handled, respond with 400 Bad Request
  return NextResponse.error();
}
