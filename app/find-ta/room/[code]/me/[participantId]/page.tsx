import type { Metadata } from "next";
import { FindTaParticipantView } from "@/components/FindTaParticipantView";

type FindTaParticipantPageProps = {
  params: Promise<{
    code: string;
    participantId: string;
  }>;
};

export const metadata: Metadata = {
  title: "我的寻找那个 TA 小队页 | 心火欧洲青年事工",
  description: "查看匿名小队线索，并完成线下会合确认。"
};

export default async function FindTaParticipantPage(props: FindTaParticipantPageProps) {
  const params = await props.params;

  return <FindTaParticipantView participantId={params.participantId} roomCode={params.code} />;
}
