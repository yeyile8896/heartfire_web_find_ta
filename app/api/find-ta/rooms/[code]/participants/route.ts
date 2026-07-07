import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { joinFindTaRoom } from "@/lib/find-ta-room-store";
import type { FindTaParticipantInput } from "@/lib/find-ta-types";

export const dynamic = "force-dynamic";

type ParticipantsRouteProps = {
  params: {
    code: string;
  };
};

export async function POST(request: Request, { params }: ParticipantsRouteProps) {
  try {
    const input = (await request.json()) as Partial<FindTaParticipantInput>;
    const view = joinFindTaRoom(params.code, input);
    const origin = new URL(request.url).origin;

    return NextResponse.json({
      ...view,
      participantUrl: `${origin}/find-ta/room/${view.room.code}/me/${view.self.id}`
    });
  } catch (error) {
    return findTaApiError(error);
  }
}
