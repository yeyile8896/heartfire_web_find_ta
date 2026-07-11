import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { saveFindTaBalloonChallenge } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type BalloonRouteProps = {
  params: Promise<{
    code: string;
    pairId: string;
  }>;
};

type BalloonRequest = {
  results?: unknown;
  token?: string;
};

export async function POST(request: Request, props: BalloonRouteProps) {
  try {
    const params = await props.params;
    const body = (await request.json()) as BalloonRequest;

    return NextResponse.json(
      await saveFindTaBalloonChallenge(params.code, body.token ?? "", params.pairId, {
        results: body.results
      })
    );
  } catch (error) {
    return findTaApiError(error);
  }
}
