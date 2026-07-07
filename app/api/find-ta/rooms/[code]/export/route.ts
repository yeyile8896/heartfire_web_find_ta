import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { exportFindTaRoomCsv } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type ExportRouteProps = {
  params: {
    code: string;
  };
};

export async function GET(request: Request, { params }: ExportRouteProps) {
  try {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    const csv = exportFindTaRoomCsv(params.code, token);
    const filename = `find-ta-${params.code.toUpperCase()}.csv`;

    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "text/csv; charset=utf-8"
      }
    });
  } catch (error) {
    return findTaApiError(error);
  }
}
