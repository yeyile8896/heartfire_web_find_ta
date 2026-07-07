import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { getFindTaLobbyView } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type LobbyRouteProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(_request: Request, props: LobbyRouteProps) {
  try {
    const params = await props.params;

    return NextResponse.json(getFindTaLobbyView(params.code));
  } catch (error) {
    return findTaApiError(error);
  }
}
