import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { createFindTaRoom } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const room = createFindTaRoom();
    const origin = new URL(request.url).origin;

    return NextResponse.json({
      ...room,
      hostUrl: `${origin}/find-ta/host?room=${room.code}&token=${room.hostToken}`,
      joinUrl: `${origin}/find-ta/join/${room.code}`
    });
  } catch (error) {
    return findTaApiError(error);
  }
}
