import type { Metadata } from "next";
import { FindTaLobbyScreen } from "@/components/FindTaLobbyScreen";

type FindTaScreenPageProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function generateMetadata(props: FindTaScreenPageProps): Promise<Metadata> {
  const params = await props.params;

  return {
    title: `寻找那个 TA 大屏幕 ${params.code.toUpperCase()} | 心火欧洲青年事工`,
    description: "显示房间二维码、房间码与已加入营员的匿名代号。"
  };
}

export default async function FindTaScreenPage(props: FindTaScreenPageProps) {
  const params = await props.params;

  return <FindTaLobbyScreen roomCode={params.code} />;
}
