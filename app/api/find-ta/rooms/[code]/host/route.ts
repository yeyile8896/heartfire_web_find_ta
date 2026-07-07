import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { getHostRoomView } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type HostRouteProps = {
  params: {
    code: string;
  };
};

export async function GET(request: Request, { params }: HostRouteProps) {
  try {
    const token = new URL(request.url).searchParams.get("token") ?? "";

    return NextResponse.json(getHostRoomView(params.code, token));
  } catch (error) {
    return findTaApiError(error);
  }
}
