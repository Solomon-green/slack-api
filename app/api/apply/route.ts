import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { upworkUrl } = await req.json();
  console.log("Upwork URL received:", upworkUrl);
  return NextResponse.json({ ok: true });
}
