import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { pairFindTaRoom } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type PairRouteProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function POST(request: Request, props: PairRouteProps) {
  try {
    const params = await props.params;
    const body = (await request.json()) as { token?: string };

    return NextResponse.json(await pairFindTaRoom(params.code, body.token ?? ""));
  } catch (error) {
    return findTaApiError(error);
  }
}
