import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { markFindTaPairComplete } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type CompleteRouteProps = {
  params: {
    code: string;
    participantId: string;
  };
};

export async function POST(_request: Request, { params }: CompleteRouteProps) {
  try {
    return NextResponse.json(markFindTaPairComplete(params.code, params.participantId));
  } catch (error) {
    return findTaApiError(error);
  }
}
