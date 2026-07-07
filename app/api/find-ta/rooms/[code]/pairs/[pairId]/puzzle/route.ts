import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { markFindTaScripturePuzzleComplete } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type PuzzleRouteProps = {
  params: {
    code: string;
    pairId: string;
  };
};

type PuzzleRequest = {
  token?: string;
};

export async function POST(request: Request, { params }: PuzzleRouteProps) {
  try {
    const body = (await request.json()) as PuzzleRequest;

    return NextResponse.json(markFindTaScripturePuzzleComplete(params.code, body.token ?? "", params.pairId));
  } catch (error) {
    return findTaApiError(error);
  }
}
