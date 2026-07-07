import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { submitFindTaExplorationChallenge } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type ExplorationRouteProps = {
  params: Promise<{
    code: string;
    participantId: string;
  }>;
};

export async function POST(request: Request, props: ExplorationRouteProps) {
  try {
    const params = await props.params;
    const body = (await request.json()) as { caption?: unknown; photoDataUrl?: unknown };

    return NextResponse.json(await submitFindTaExplorationChallenge(params.code, params.participantId, body));
  } catch (error) {
    return findTaApiError(error);
  }
}
