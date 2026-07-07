import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { pairFindTaRoom } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type PairRouteProps = {
  params: {
    code: string;
  };
};

export async function POST(request: Request, { params }: PairRouteProps) {
  try {
    const body = (await request.json()) as { token?: string };

    return NextResponse.json(pairFindTaRoom(params.code, body.token ?? ""));
  } catch (error) {
    return findTaApiError(error);
  }
}
