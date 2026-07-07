import { NextResponse } from "next/server";
import { findTaApiError } from "@/lib/find-ta-api";
import { exportFindTaRoomCsv } from "@/lib/find-ta-room-store";

export const dynamic = "force-dynamic";

type ExportRouteProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(request: Request, props: ExportRouteProps) {
  try {
    const params = await props.params;
    const token = new URL(request.url).searchParams.get("token") ?? "";
    const csv = await exportFindTaRoomCsv(params.code, token);
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
