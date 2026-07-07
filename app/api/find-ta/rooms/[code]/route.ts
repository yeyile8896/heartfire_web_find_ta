import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { getRoomSummary } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type RoomRouteProps = {
  params: {
    code: string;
  };
};

export async function GET(_request: Request, { params }: RoomRouteProps) {
  try {
    return NextResponse.json(getRoomSummary(params.code));
  } catch (error) {
    return findTaApiError(error);
  }
}
