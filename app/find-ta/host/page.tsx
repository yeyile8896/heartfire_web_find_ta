import type { Metadata } from "next";
import { FindTaHostRoom } from "@/components/FindTaHostRoom";

export const metadata: Metadata = {
  title: "寻找那个 TA 主持人后台 | 心火欧洲青年事工",
  description: "创建活动房间，查看营员真实身份，并随机生成四人匿名小队。"
};

export default function FindTaHostPage() {
  return <FindTaHostRoom />;
}
