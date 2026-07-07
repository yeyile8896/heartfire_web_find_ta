import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { getHostRoomView } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type HostRouteProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(request: Request, props: HostRouteProps) {
  try {
    const params = await props.params;
    const token = new URL(request.url).searchParams.get("token") ?? "";

    return NextResponse.json(await getHostRoomView(params.code, token));
  } catch (error) {
    return findTaApiError(error);
  }
}
