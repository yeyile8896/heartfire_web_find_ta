import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { confirmFindTaCommonChallenge, submitFindTaCommonChallenge } from "@/lib/find-ta-room-store";
import type { FindTaCommonChallengeInput } from "@/lib/find-ta-types";

export const dynamic = "force-dynamic";

type CommonChallengeRouteProps = {
  params: Promise<{
    code: string;
    participantId: string;
  }>;
};

type CommonChallengeRequest = Partial<FindTaCommonChallengeInput> & {
  action?: "confirm" | "submit";
};

export async function POST(request: Request, props: CommonChallengeRouteProps) {
  try {
    const params = await props.params;
    const body = (await request.json()) as CommonChallengeRequest;

    if (body.action === "confirm") {
      return NextResponse.json(confirmFindTaCommonChallenge(params.code, params.participantId));
    }

    return NextResponse.json(submitFindTaCommonChallenge(params.code, params.participantId, body));
  } catch (error) {
    return findTaApiError(error);
  }
}
