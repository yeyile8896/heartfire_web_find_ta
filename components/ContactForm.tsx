import { ArrowUpRight, ClipboardList, Mail } from "lucide-react";
import { CONTACT_EMAIL, GOOGLE_FORM_URL } from "@/lib/site";

type Language = "zh" | "en";

const contactFormCopy: Record<
  Language,
  {
    emailButton: string;
    emailDescription: string;
    emailTitle: string;
    formButton: string;
    formDescription: string;
    formTitle: string;
    stepItems: string[];
    stepTitle: string;
    supportText: string;
    supportTitle: string;
  }
> = {
  zh: {
    emailButton: "发送邮件给我们",
    emailDescription: "如果你更习惯邮件沟通，也欢迎直接来信，我们会尽快回复。",
    emailTitle: "邮箱联系",
    formButton: "打开 Google 表单",
    formDescription: "报名参加、成为同工、代祷回应、奉献支持与一般咨询，都可以通过 Google 表单告诉我们。",
    formTitle: "Google 表单联系",
    stepItems: [
      "填写你的基本信息与所在国家。",
      "选择你希望如何参与或与我们保持联系。",
      "提交后，我们会按你留下的方式继续跟进。"
    ],
    stepTitle: "填写表单后会发生什么",
    supportText: "如果你更适合用邮件联系，我们也很乐意从邮件开始交流。",
    supportTitle: "也欢迎直接来信"
  },
  en: {
    emailButton: "Write to us by email",
    emailDescription:
      "If email feels more natural for you, you are welcome to write to us and we will follow up from there.",
    emailTitle: "Email",
    formButton: "Open Google Form",
    formDescription:
      "Event sign-up, serving interest, prayer partnership, giving, and general questions can all begin through the Google Form.",
    formTitle: "Google Form",
    stepItems: [
      "Share your basic details and the country you are currently in.",
      "Let us know how you would like to connect or participate.",
      "After that, we will follow up using the contact method you leave."
    ],
    stepTitle: "What happens after you fill it out",
    supportText: "If you would rather begin by email, we are glad to continue the conversation there.",
    supportTitle: "Email is welcome too"
  }
};

type ContactFormProps = {
  lang: Language;
};

export function ContactForm({ lang }: ContactFormProps) {
  const copy = contactFormCopy[lang];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-card">
        <div className="inline-flex rounded-lg bg-white p-3 text-orange-500 shadow-sm">
          <ClipboardList className="h-6 w-6" />
        </div>
        <p className="mt-5 font-display text-2xl font-semibold text-slate-950">{copy.formTitle}</p>
        <p className="mt-3 text-base leading-8 text-slate-700">{copy.formDescription}</p>
        <a
          className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-6 py-3 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#a93616]"
          href={GOOGLE_FORM_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {copy.formButton}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="rounded-xl border border-orange-100 bg-white/95 p-5 shadow-card">
        <p className="font-semibold text-slate-900">{copy.stepTitle}</p>
        <ol className="mt-4 grid gap-3">
          {copy.stepItems.map((item, index) => (
            <li className="grid grid-cols-[2.25rem_1fr] gap-3" key={item}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-semibold text-orange-600">
                {index + 1}
              </span>
              <span className="pt-1.5 text-sm leading-7 text-slate-600 sm:text-base">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-orange-100 bg-white/80 p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900">{copy.emailTitle}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{copy.emailDescription}</p>
            <a
              className="mt-3 inline-flex select-all rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <a
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-[#fbf6ef]"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            <Mail className="h-4 w-4 text-orange-500" />
            {copy.emailButton}
          </a>
        </div>
        <p className="mt-4 border-t border-orange-100 pt-4 text-sm leading-7 text-slate-600">
          <span className="font-semibold text-slate-900">{copy.supportTitle}</span> {copy.supportText}
        </p>
      </div>
    </div>
  );
}
