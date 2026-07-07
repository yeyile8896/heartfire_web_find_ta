import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { submitFindTaHarmonyChallenge } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type HarmonyRouteProps = {
  params: Promise<{
    code: string;
    participantId: string;
  }>;
};

export async function POST(request: Request, props: HarmonyRouteProps) {
  try {
    const params = await props.params;
    const body = (await request.json()) as { answers?: unknown };

    return NextResponse.json(submitFindTaHarmonyChallenge(params.code, params.participantId, body));
  } catch (error) {
    return findTaApiError(error);
  }
}
