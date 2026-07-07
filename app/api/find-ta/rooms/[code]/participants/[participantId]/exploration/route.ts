import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { submitFindTaExplorationChallenge } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type ExplorationRouteProps = {
  params: {
    code: string;
    participantId: string;
  };
};

export async function POST(request: Request, { params }: ExplorationRouteProps) {
  try {
    const body = (await request.json()) as { caption?: unknown; photoDataUrl?: unknown };

    return NextResponse.json(submitFindTaExplorationChallenge(params.code, params.participantId, body));
  } catch (error) {
    return findTaApiError(error);
  }
}
