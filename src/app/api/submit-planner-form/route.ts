import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
