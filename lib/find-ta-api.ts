import { NextResponse } from "next/server";
import { FindTaRoomError } from "@/lib/find-ta-room-store";

export function findTaApiError(error: unknown) {
  if (error instanceof FindTaRoomError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  return NextResponse.json({ message: "系统暂时无法处理，请稍后再试。" }, { status: 500 });
}
