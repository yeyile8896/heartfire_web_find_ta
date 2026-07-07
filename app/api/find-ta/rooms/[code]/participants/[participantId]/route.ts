import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { getParticipantView } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type ParticipantRouteProps = {
  params: Promise<{
    code: string;
    participantId: string;
  }>;
};

export async function GET(_request: Request, props: ParticipantRouteProps) {
  try {
    const params = await props.params;

    return NextResponse.json(getParticipantView(params.code, params.participantId));
  } catch (error) {
    return findTaApiError(error);
  }
}
