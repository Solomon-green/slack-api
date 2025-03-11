import { NextResponse } from "next/server";

interface SlackEvent {
  type: string;
  challenge?: string;
  event?: {
    type: string;
    user: string;
    channel: string;
    message_ts: string;
    links: { url: string; domain: string }[];
    source: string;
    unfurl_id: string;
    is_bot_user_member: boolean;
    event_ts: string;
  };
}

export async function POST(req: Request) {
  const { type, challenge, event }: SlackEvent = await req.json();

  // Handle Slack URL verification challenge
  if (type === "url_verification") {
    return NextResponse.json({ challenge });
  }

  // Handle Slack events
  if (type === "event_callback") {
    // Process the event here
    const upworkUrlRegex =
      /^https:\/\/www\.upwork\.com\/jobs\/[^]*[0-9a-f]{16,24}\/?$/;
    const jobLinks = event?.links
      ?.filter((link) => upworkUrlRegex.test(link.url))
      ?.map((link) => link.url) || [];

    if (jobLinks.length > 0) {
      const response = await fetch("https://slack-api-peach.vercel.app/api/apply" as string, {
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
