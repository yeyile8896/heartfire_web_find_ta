import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { markFindTaScripturePuzzleComplete } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type PuzzleRouteProps = {
  params: Promise<{
    code: string;
    pairId: string;
  }>;
};

type PuzzleRequest = {
  token?: string;
};

export async function POST(request: Request, props: PuzzleRouteProps) {
  try {
    const params = await props.params;
    const body = (await request.json()) as PuzzleRequest;

    return NextResponse.json(markFindTaScripturePuzzleComplete(params.code, body.token ?? "", params.pairId));
  } catch (error) {
    return findTaApiError(error);
  }
}
