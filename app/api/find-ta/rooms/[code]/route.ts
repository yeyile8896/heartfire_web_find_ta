import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { getRoomSummary } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type RoomRouteProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(_request: Request, props: RoomRouteProps) {
  try {
    const params = await props.params;

    return NextResponse.json(await getRoomSummary(params.code));
  } catch (error) {
    return findTaApiError(error);
  }
}
