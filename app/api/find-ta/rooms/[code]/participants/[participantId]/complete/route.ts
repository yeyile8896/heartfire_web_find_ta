import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { markFindTaPairComplete } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type CompleteRouteProps = {
  params: Promise<{
    code: string;
    participantId: string;
  }>;
};

export async function POST(_request: Request, props: CompleteRouteProps) {
  try {
    const params = await props.params;

    return NextResponse.json(await markFindTaPairComplete(params.code, params.participantId));
  } catch (error) {
    return findTaApiError(error);
  }
}
