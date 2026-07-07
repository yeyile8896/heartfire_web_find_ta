import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { getFindTaLobbyView } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type LobbyRouteProps = {
  params: {
    code: string;
  };
};

export async function GET(_request: Request, { params }: LobbyRouteProps) {
  try {
    return NextResponse.json(getFindTaLobbyView(params.code));
  } catch (error) {
    return findTaApiError(error);
  }
}
