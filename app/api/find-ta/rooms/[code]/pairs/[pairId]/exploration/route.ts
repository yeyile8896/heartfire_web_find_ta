import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { markFindTaExplorationComplete } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type ExplorationApprovalRouteProps = {
  params: Promise<{
    code: string;
    pairId: string;
  }>;
};

type ExplorationApprovalRequest = {
  token?: string;
};

export async function POST(request: Request, props: ExplorationApprovalRouteProps) {
  try {
    const params = await props.params;
    const body = (await request.json()) as ExplorationApprovalRequest;

    return NextResponse.json(await markFindTaExplorationComplete(params.code, body.token ?? "", params.pairId));
  } catch (error) {
    return findTaApiError(error);
  }
}
