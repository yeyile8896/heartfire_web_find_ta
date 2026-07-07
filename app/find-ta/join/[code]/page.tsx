import type { Metadata } from "next";
import { FindTaJoinRoom } from "@/components/FindTaJoinRoom";

type FindTaJoinPageProps = {
  params: {
    code: string;
  };
};

export function generateMetadata({ params }: FindTaJoinPageProps): Metadata {
  return {
    title: `加入寻找那个 TA 房间 ${params.code.toUpperCase()} | 心火欧洲青年事工`,
    description: "填写真实身份给主持人核对，并提交匿名线索给小队队友。"
  };
}

export default function FindTaJoinPage({ params }: FindTaJoinPageProps) {
  return <FindTaJoinRoom roomCode={params.code} />;
}
