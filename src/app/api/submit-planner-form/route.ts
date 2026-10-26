import { NextResponse } from "next/server";
import { getPlanInformation } from "@/services";

export async function POST(request: Request) {
  try {
    // TODO: Use zod to parse the incoming body
    const body = await request.json();
    const result = await getPlanInformation(body.stacks);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
