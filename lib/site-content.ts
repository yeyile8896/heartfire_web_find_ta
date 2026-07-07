import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Mail,
  Monitor,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import type { Language, NavItem } from "@/components/Navbar";
import { getPagePath, type SiteView } from "@/lib/site-routes";

export type CardItem = {
  description: string;
  icon: LucideIcon;
  tag?: string;
  title: string;
};

export type FactItem = {
  label: string;
  value: string;
};

export type MemoryPhoto = {
  alt: string;
  src: string;
};

export type MemoryItem = {
  cover: string;
  description: string;
  photos: MemoryPhoto[];
  theme: string;
  title: string;
  year: string;
};

export type PageContent = {
  about: {
    description: string;
    eyebrow: string;
    positioningItems: string[];
    positioningTitle: string;
    story: string[];
    title: string;
  };
  brand: {
    alt: string;
    formalName: string;
    logoSubtitle: string;
    logoTitle: string;
  };
  contact: {
    audienceDescription: string;
    audienceTitle: string;
    description: string;
    emailDescription: string;
    emailTitle: string;
    eyebrow: string;
    givingDescription: string;
    givingRevolutLabel: string;
    givingTitle: string;
    givingWechatDescription: string;
    givingWechatLabel: string;
    headingEyebrow: string;
    headingTitle: string;
    socialDescription: string;
    socialTitle: string;
    title: string;
  };
  findTa: {
    allowed: string[];
    description: string;
    eyebrow: string;
    forbidden: string[];
    homepageCta: string;
    homepageDescription: string;
    homepageEyebrow: string;
    homepageTitle: string;
    missionDescription: string;
    missionTitle: string;
    primaryCta: string;
    rulesTitle: string;
    steps: Array<{
      description: string;
      title: string;
    }>;
    subtitle: string;
    title: string;
  };
  footer: {
    copyright: string;
    statement: string;
  };
  hero: {
    chip: string;
    description: string;
    facts: FactItem[];
    memoriesCta: string;
    primaryCta: string;
    secondaryCta: string;
    sideCards: FactItem[];
    sideEyebrow: string;
    sideParagraphs: string[];
    sideTitle: string;
    subtitle: string;
    title: string;
  };
  join: {
    description: string;
    eyebrow: string;
    items: CardItem[];
    title: string;
  };
  memories: {
    eyebrow: string;
    items: MemoryItem[];
    title: string;
  };
  navItems: NavItem[];
  navbar: {
    languageToggleLabel: string;
    menuButtonLabel: string;
  };
  origin: {
    cardBody: string;
    cardTitle: string;
    description: string;
    eyebrow: string;
    paragraphs: string[];
    title: string;
  };
  rhythm: {
    description: string;
    eyebrow: string;
    items: CardItem[];
    quoteBody: string;
    quoteTitle: string;
    title: string;
  };
  vision: {
    cards: CardItem[];
    description: string;
    eyebrow: string;
    goals: FactItem[];
    goalsDescription: string;
    goalsHeading: string;
    goalsTitle: string;
    strategies: string[];
    strategyTitle: string;
    title: string;
  };
  whatWeDo: {
    description: string;
    eyebrow: string;
    items: CardItem[];
    title: string;
  };
};

export const siteContent: Record<Language, PageContent> = {
  zh: {
    about: {
      description:
        "心火欧洲青年事工承接跨国青年营多年累积的同行传统，连结欧洲各地青年，建立跨文化、跨城市、跨阶段的属灵同行群体。",
      eyebrow: "关于我们",
      positioningItems: [
        "连接分散在欧洲各地的青年、同工与支持伙伴。",
        "建立跨文化、跨国家、跨代际的真实属灵同行关系。",
        "帮助青年不只参与活动，也在真理、关系与使命中持续成长。"
      ],
      positioningTitle: "我们的定位",
      story: [
        "2019 年，一位对东欧青年福音事工深具负担的年轻传道人，与来自东欧各国、同样愿意投入的青年同工一同发起并主办跨国青年营会。多年下来，这个营会渐渐成为青年彼此连结、信仰成长与世代同行的重要平台。",
        "如今，心火欧洲青年事工承接这份历史传统。自 2025 年起，我们开始承办年度东欧青年营会，并持续连结欧洲各地青年，帮助他们在真理中扎根、在关系中被陪伴、在各自国家与城市里回应呼召、活出使命。"
      ],
      title: "一个连接欧洲青年、超越单一机构归属的跨国平台"
    },
    brand: {
      alt: "心火欧洲青年事工 Logo",
      formalName: "心火欧洲青年事工",
      logoSubtitle: "HEARTS ON FIRE",
      logoTitle: "心火欧洲青年事工"
    },
    contact: {
      audienceDescription:
        "如果你想报名参加活动、成为同工、参与代祷，或以奉献支持事工，都欢迎先透过表单或邮件与我们联系。",
      audienceTitle: "这些情况都欢迎联系",
      description:
        "你可以通过 Google 表单留下信息；如果你更习惯直接来信，也可以使用下方邮箱与我们联系。若想奉献支持，也可以使用下方 Revolut 或微信转账方式。",
      emailDescription: "若你希望直接写信沟通，欢迎发送邮件到",
      emailTitle: "邮箱联系",
      eyebrow: "联系我们",
      givingDescription:
        "如你愿意以奉献支持事工，可以通过 Revolut 链接转账，或加微信后使用微信转账。转账时请在备注中留下姓名、联系方式或所在城市，方便我们确认与跟进。",
      givingRevolutLabel: "通过 Revolut 奉献",
      givingTitle: "奉献支持",
      givingWechatDescription: "加微信后可通过微信转账，请备注个人信息",
      givingWechatLabel: "微信号",
      headingEyebrow: "联系方式",
      headingTitle: "用表单、邮件或奉献方式与我们保持连接",
      socialDescription: "欢迎先在 Instagram 关注我们，最新动态、营会消息与服事更新会优先发布在那里。",
      socialTitle: "社交媒体",
      title: "把你的回应告诉我们"
    },
    findTa: {
      allowed: ["分享兴趣爱好", "提供当天穿搭细节", "使用指定暗号互相确认", "提供模糊但不暴露身份的线索"],
      description:
        "通过四人匿名小队、线索交换与线下寻找，打破陌生感，帮助营员建立第一份真实连接。",
      eyebrow: "主题活动",
      forbidden: ["直接说出姓名", "展示个人照片", "询问或透露房间号等明显身份信息"],
      homepageCta: "进入活动",
      homepageDescription:
        "活动当天，营员可以从这里进入「寻找那个 TA」说明页，查看四人小队分组、线索规则与线下相认任务。",
      homepageEyebrow: "当前活动入口",
      homepageTitle: "寻找那个 TA",
      missionDescription:
        "在匿名线索中收集信息后，前往营地寻找同组队友。你们需要通过观察、交流与推理确认彼此身份。",
      missionTitle: "破冰任务：《你是谁？》",
      primaryCta: "查看活动流程",
      rulesTitle: "保持神秘，也保持尊重",
      steps: [
        {
          description: "营员进入官网活动页或扫描现场二维码，主持人开始后，系统随机分成四人匿名小队。",
          title: "随机分组"
        },
        {
          description: "队友之间只看到兴趣、穿搭和暗号线索，不显示姓名、头像和小组。",
          title: "匿名线索"
        },
        {
          description: "带着线索前往营地，通过观察、交流与推理找到同组队友。",
          title: "线下寻找"
        },
        {
          description: "小队成员成功相认后完成击掌，全队确认后解锁小队任务。",
          title: "成功会合"
        }
      ],
      subtitle: "先认识一个人的想法、兴趣和个性，再发现他是谁。",
      title: "寻找那个 TA"
    },
    footer: {
      copyright: "心火欧洲青年事工 Hearts on Fire.",
      statement: "在真理中被点燃，在欧洲各地彼此同行。"
    },
    hero: {
      chip: "Hearts on Fire Youth Ministry of Europe",
      description:
        "心火欧洲青年事工是一个跨国青年平台，不隶属于单一教会或机构。我们盼望连结欧洲各地青年，使他们在真理中被建立、在关系中彼此扶持，并在各自城市与处境里活出使命。",
      facts: [
        { label: "历史承接", value: "2019 年起跨国青年营传统" },
        { label: "年度转承", value: "2025 年起承办营会" },
        { label: "平台定位", value: "跨文化属灵同行群体" }
      ],
      memoriesCta: "查看往期回顾",
      primaryCta: "了解我们",
      secondaryCta: "参与同行",
      sideCards: [
        { label: "关键词", value: "跨国、真理、陪伴、使命" },
        { label: "核心节奏", value: "小而稳定，持续成长" }
      ],
      sideEyebrow: "WHO WE ARE",
      sideParagraphs: [
        "我们承接东欧青年营多年累积的同行传统，透过营会、线上聚会与持续陪伴，让分散各地的青年能在信仰旅程中重新连结。",
        "不论你身处校园、职场、移居生活或跨文化处境，这里都盼望成为你被理解、被装备、被差遣的同行平台。"
      ],
      sideTitle: "在欧洲点燃青年心火",
      subtitle: "连接欧洲青年，扎根真理，活出使命。",
      title: "心火欧洲青年事工"
    },
    join: {
      description: "无论你想参加聚会、投入服事、代祷守望，或以资源支持事工，都欢迎先与我们联系。",
      eyebrow: "参与方式",
      items: [
        {
          description: "加入营会或线上聚会，认识一群在欧洲同行、扎根真理的青年。",
          icon: Sparkles,
          title: "报名参加"
        },
        {
          description: "参与接待、行政、内容策划、敬拜或陪伴服事，一起承担平台建设。",
          icon: Users,
          title: "成为同工"
        },
        {
          description: "为欧洲青年、营会、线上群体与领袖培育长期守望，成为看不见却关键的同行者。",
          icon: HandHeart,
          title: "成为代祷伙伴"
        },
        {
          description: "以资源参与跨国青年事工，让更多青年在真理中被装备、被点燃、被差遣。",
          icon: Mail,
          title: "支持奉献"
        }
      ],
      title: "你可以用不同方式，加入这段同行旅程"
    },
    memories: {
      eyebrow: "往年回顾",
      title: "往年回顾",
      items: [
        {
          cover: "/memories/2023-cover.jpg",
          description: "青年营会中的合照、分组与相聚片段，记录那一年一起走过的时间。",
          photos: [
            { alt: "2023 青年营会团体合照", src: "/memories/2023-group.jpg" },
            { alt: "2023 青年营会现场片段", src: "/memories/2023-moment.jpg" }
          ],
          theme: "想见你之2023青春有你",
          title: "2023 青年营会",
          year: "2023"
        },
        {
          cover: "/memories/2024-cover.jpg",
          description: "营会中的敬拜、信息、小组活动与同工同行片段。",
          photos: [
            { alt: "2024 营会敬拜现场", src: "/memories/2024-worship.jpg" },
            { alt: "2024 营会小组活动", src: "/memories/2024-small-group.jpg" },
            { alt: "2024 营会同工合照", src: "/memories/2024-team.jpg" }
          ],
          theme: "真诚，真实，真理",
          title: "2024 青年营会",
          year: "2024"
        },
        {
          cover: "/memories/2025-cover.jpg",
          description: "同工团建中的合照、信息分享与城市同行片段。",
          photos: [
            { alt: "2025 团建信息分享", src: "/memories/2025-session.jpg" },
            { alt: "2025 团建合照", src: "/memories/2025-group.jpg" }
          ],
          theme: "关于信仰，使命，关系，文化",
          title: "2025 团建",
          year: "2025"
        }
      ]
    },
    navItems: [
      { label: "关于", href: "/about" },
      { label: "名称由来", href: "/origin" },
      { label: "异象", href: "/vision" },
      { label: "事工", href: "/what-we-do" },
      { label: "回顾", href: "/memories" },
      { label: "寻找那个 TA", href: "/find-ta" },
      { label: "参与方式", href: "/join" },
      { label: "联系", href: "/contact" }
    ],
    navbar: {
      languageToggleLabel: "选择网站语言",
      menuButtonLabel: "切换导航菜单"
    },
    origin: {
      cardBody: "象征一群青年在信仰旅程中彼此同行，在上帝的话语中不断被更新、被激励，让心中的火重新燃起。",
      cardTitle: "心火同行",
      description: "“心火”取意于以马忤斯路上“心里火热”的意象：当人与基督同行、聆听主的话语，心灵会再次被点燃。",
      eyebrow: "名称由来",
      paragraphs: [
        "我们相信，青年并不只需要一次热闹的活动，而是需要在真实关系里，被主的话持续开启、澄清与坚固。",
        "因此，“心火”不只是一个名称，也是我们的服事方向：与欧洲青年一起走路、一起聆听、一起辨明、一起回应呼召。"
      ],
      title: "以马忤斯路上的“心里火热”"
    },
    rhythm: {
      description: "我们正借着营会、线上聚会与关系陪伴，逐步建立一个跨国家、跨城市、跨阶段的青年同行网络。",
      eyebrow: "真实同行",
      items: [
        {
          description: "围绕年度东欧青年营会的承办与预备，持续连接不同国家与城市的青年。",
          icon: CalendarDays,
          tag: "营会节奏",
          title: "年度营会"
        },
        {
          description: "透过线上聚会、查经与祷告，让分散各地的人仍能规律相遇、彼此守望。",
          icon: Monitor,
          tag: "线上连接",
          title: "线上同行"
        },
        {
          description: "在校园、职场、移居生活与跨文化处境中，陪伴青年把信仰落实到日常。",
          icon: HeartHandshake,
          tag: "关系陪伴",
          title: "门徒陪伴"
        }
      ],
      quoteBody:
        "这一切或许从营会开始，却不止于营会；我们盼望每一次相遇，最终都能延伸为长期关系、真实成长与持续回应。",
      quoteTitle: "我们更看重长期同行，而不是短暂热度",
      title: "这不是一次活动，而是一段持续展开的旅程"
    },
    vision: {
      cards: [
        {
          description:
            "在欧洲建立一个跨国且具影响力的青年基督徒平台，使年轻人在真理中扎根、在信仰中成长，并在各自的国家与城市中活出使命。",
          icon: Target,
          title: "异象 Vision"
        },
        {
          description:
            "透过营会、线上聚会与持续陪伴，连结并装备欧洲青年，使他们在信仰、生活与领导力上持续成长，彼此支持，同奔使命。",
          icon: Users,
          title: "使命 Mission"
        }
      ],
      description:
        "我们盼望的不只是聚集活动参与者，而是建立一个能持续影响城市与国家的青年属灵网络，并以稳定节奏推进长期同行。",
      eyebrow: "异象、使命、目标与策略",
      goals: [
        { label: "青年连结网络", value: "100+" },
        { label: "欧洲国家覆盖", value: "10+" },
        { label: "核心同工团队", value: "15+" },
        { label: "领袖传承培育", value: "长期" }
      ],
      goalsDescription: "我们期待建立跨国青年门徒网络，并坚持稳健发展，不以关系质量或属灵深度换取表面扩张。",
      goalsHeading: "以清晰目标推进，以稳定节奏成长",
      goalsTitle: "目标 Goal",
      strategies: [
        "坚持“小而稳定”的发展节奏，先建立真实同行的关系密度，再逐步拓展影响力。",
        "结合线上聚会与线下营会，让分散在欧洲各地的青年都能持续参与并彼此连接。",
        "把属灵建造与领袖培育放在核心位置，不只举办活动，更陪伴生命成长。",
        "维持伙伴关系与财务透明，建立可信任、可持续的事工基础。"
      ],
      strategyTitle: "策略 Strategy",
      title: "让青年在真理中扎根，并以清晰目标稳健成长"
    },
    whatWeDo: {
      description: "活动只是起点，真正重要的是活动之后持续发生的关系、装备与使命实践。",
      eyebrow: "我们在做什么",
      items: [
        {
          description:
            "承接自 2019 年起累积的东欧青年营传统，自 2025 年起由心火欧洲青年事工承办，继续成为彼此连结与灵命更新的平台。",
          icon: CalendarDays,
          title: "营会"
        },
        {
          description: "透过线上聚会、祷告与查经，让分散在不同国家和城市的青年持续相遇、彼此守望。",
          icon: Monitor,
          title: "线上聚会"
        },
        {
          description: "在真实关系中陪伴青年，将信仰落实到校园、职场、家庭与跨文化生活里。",
          icon: HeartHandshake,
          title: "门徒陪伴"
        },
        {
          description: "投资核心同工与新一代领袖，帮助他们在品格、属灵生命与团队服事上持续成长。",
          icon: GraduationCap,
          title: "领袖培育"
        }
      ],
      title: "聚集、陪伴、装备，让青年进入长期成长"
    }
  },
  en: {
    about: {
      description:
        "Hearts on Fire Youth Ministry of Europe builds on the companionship tradition formed through cross-border youth camps, connecting young people across Europe into a spiritually rooted, culturally aware community.",
      eyebrow: "About",
      positioningItems: [
        "Connecting young people, co-workers, and ministry partners across Europe.",
        "Nurturing genuine spiritual companionship across cultures, generations, and national borders.",
        "Helping young people move beyond event participation into long-term growth, service, and mission."
      ],
      positioningTitle: "How We See Our Role",
      story: [
        "In 2019, a young preacher carrying a burden for youth ministry in Eastern Europe joined with young co-workers from several countries to launch and host a cross-border youth camp. Over the years, that camp became an important place of connection, formation, and intergenerational companionship.",
        "Today, Hearts on Fire Youth Ministry of Europe carries that legacy forward. Since 2025, we have been stewarding the annual Eastern Europe youth camp while continuing to connect young people across Europe, helping them be rooted in truth, strengthened in community, and equipped to live out their calling in the cities and nations where God has placed them."
      ],
      title: "A cross-border platform for young people in Europe, beyond the boundaries of any single institution"
    },
    brand: {
      alt: "Hearts on Fire Youth Ministry of Europe logo",
      formalName: "Hearts on Fire Youth Ministry of Europe",
      logoSubtitle: "HEARTS ON FIRE",
      logoTitle: "Hearts on Fire"
    },
    contact: {
      audienceDescription:
        "If you would like to join an event, explore serving, stand with us in prayer, or support the ministry through giving, we would love to hear from you.",
      audienceTitle: "You Are Welcome to Reach Out",
      description:
        "You are welcome to respond through the Google Form, or write to us directly by email if that feels more natural. If you would like to give, you can also use Revolut or WeChat below.",
      emailDescription: "If you prefer direct email, feel free to write to",
      emailTitle: "Email",
      eyebrow: "Contact",
      givingDescription:
        "If you would like to support the ministry financially, you can give through Revolut or add WeChat and transfer there. Please include your name, contact information, or city in the transfer note so we can confirm and follow up.",
      givingRevolutLabel: "Give through Revolut",
      givingTitle: "Giving",
      givingWechatDescription: "Add this WeChat account to arrange a transfer, and include your personal details in the note",
      givingWechatLabel: "WeChat ID",
      headingEyebrow: "WAYS TO CONNECT",
      headingTitle: "Connect with us through the form, email, or giving options",
      socialDescription:
        "Follow us on Instagram for updates, gathering news, and ministry rhythms as they unfold.",
      socialTitle: "Social",
      title: "Tell us how you would like to journey with us"
    },
    findTa: {
      allowed: [
        "Share hobbies and interests",
        "Offer outfit details from the day",
        "Use the assigned code phrase to confirm",
        "Offer vague clues without revealing identity"
      ],
      description:
        "An icebreaker that uses anonymous four-person teams, clue exchange, and in-person discovery to help campers form their first real connection.",
      eyebrow: "Theme Activity",
      forbidden: [
        "Say your name directly",
        "Show personal photos",
        "Ask for or reveal room numbers or other obvious identity details"
      ],
      homepageCta: "Enter Activity",
      homepageDescription:
        "During camp, participants can use this entry point to view the team flow, clue rules, and in-person discovery mission.",
      homepageEyebrow: "Current Activity Entry",
      homepageTitle: "Find That Person",
      missionDescription:
        "After collecting clues anonymously, walk around the camp venue to find your mystery teammates. Confirm through observation, conversation, and the assigned code phrase.",
      missionTitle: "Icebreaker Mission: Who Are You?",
      primaryCta: "View Activity Flow",
      rulesTitle: "Keep the Mystery, Keep Respect",
      steps: [
        {
          description:
            "Participants open the website activity page or scan the on-site QR code, then the host randomly creates four-person teams.",
          title: "Random Teams"
        },
        {
          description:
            "Teammates see anonymous clues about interests, outfit details, and code phrases without names or profile photos.",
          title: "Anonymous Clues"
        },
        {
          description:
            "Participants use the clues to search the camp venue and identify their mystery teammates in person.",
          title: "In-person Search"
        },
        {
          description:
            "Once the team recognizes each other, they high-five and unlock the next team mission.",
          title: "Successful Meet-up"
        }
      ],
      subtitle: "Meet a person's thoughts, interests, and personality before discovering who they are.",
      title: "Find That Person"
    },
    footer: {
      copyright: "Hearts on Fire Youth Ministry of Europe.",
      statement: "Rooted in truth, walking together across Europe."
    },
    hero: {
      chip: "Hearts on Fire Youth Ministry of Europe",
      description:
        "Hearts on Fire Youth Ministry of Europe is a cross-border platform for young people and is not owned by any single church or organization. We long to connect young adults across Europe, see them rooted in truth, strengthened in community, and sent into their own cities and contexts with clarity and purpose.",
      facts: [
        { label: "Shared legacy", value: "Cross-border camp tradition since 2019" },
        { label: "Current stewardship", value: "Annual camp led since 2025" },
        { label: "Platform identity", value: "Cross-cultural spiritual companionship" }
      ],
      memoriesCta: "View Memories",
      primaryCta: "Explore Our Story",
      secondaryCta: "Join the Journey",
      sideCards: [
        { label: "Key themes", value: "Cross-border, truth, companionship, mission" },
        { label: "Core rhythm", value: "Small, steady, and sustainable" }
      ],
      sideEyebrow: "WHO WE ARE",
      sideParagraphs: [
        "We build on a long-standing tradition of companionship formed through Eastern Europe youth camps, expressed through camps, online gatherings, and ongoing relational care.",
        "Whether you are in university, at work, rebuilding life in a new country, or navigating a cross-cultural season, we hope this can be a place where you are understood, equipped, and sent."
      ],
      sideTitle: "Kindling a gospel-centered fire among young people in Europe",
      subtitle: "Connecting young people in Europe, rooting them in truth, and calling them into mission.",
      title: "Hearts on Fire Youth Ministry of Europe"
    },
    join: {
      description:
        "Whether you want to join a gathering, serve with the ministry, stand with us in prayer, or support the work financially, there is a place to begin.",
      eyebrow: "Ways to Join",
      items: [
        {
          description: "Join a camp or online gathering and meet other young people across Europe who are seeking to be rooted in truth and community.",
          icon: Sparkles,
          title: "Join a Gathering"
        },
        {
          description: "Serve through hospitality, coordination, worship, logistics, mentoring, or planning as we build this ministry together.",
          icon: Users,
          title: "Serve with the Team"
        },
        {
          description: "Stand with young people, camps, online communities, and leadership formation through faithful and ongoing prayer.",
          icon: HandHeart,
          title: "Become a Prayer Partner"
        },
        {
          description: "Support cross-border youth ministry through financial giving so more young people can be equipped, strengthened, and sent.",
          icon: Mail,
          title: "Support through Giving"
        }
      ],
      title: "There are different ways to step into this shared journey"
    },
    memories: {
      eyebrow: "Memories",
      title: "Past Memories",
      items: [
        {
          cover: "/memories/2023-cover.jpg",
          description: "Group photos, shared moments, and scenes from the 2023 youth camp.",
          photos: [
            { alt: "2023 youth camp group photo", src: "/memories/2023-group.jpg" },
            { alt: "2023 youth camp moment", src: "/memories/2023-moment.jpg" }
          ],
          theme: "想见你之2023青春有你",
          title: "2023 Youth Camp",
          year: "2023"
        },
        {
          cover: "/memories/2024-cover.jpg",
          description: "Worship, messages, small-group activities, and team moments from the 2024 camp.",
          photos: [
            { alt: "2024 camp worship gathering", src: "/memories/2024-worship.jpg" },
            { alt: "2024 camp small-group activity", src: "/memories/2024-small-group.jpg" },
            { alt: "2024 camp team photo", src: "/memories/2024-team.jpg" }
          ],
          theme: "Sincerity, Reality, Truth",
          title: "2024 Youth Camp",
          year: "2024"
        },
        {
          cover: "/memories/2025-cover.jpg",
          description: "Team-building photos, message sharing, and city moments from 2025.",
          photos: [
            { alt: "2025 team-building message session", src: "/memories/2025-session.jpg" },
            { alt: "2025 team-building group photo", src: "/memories/2025-group.jpg" }
          ],
          theme: "Faith, Mission, Relationship, Culture",
          title: "2025 Team Building",
          year: "2025"
        }
      ]
    },
    navItems: [
      { label: "About", href: "/en/about" },
      { label: "Origin", href: "/en/origin" },
      { label: "Vision", href: "/en/vision" },
      { label: "Ministry", href: "/en/what-we-do" },
      { label: "Memories", href: "/en/memories" },
      { label: "Find That Person", href: "/en/find-ta" },
      { label: "Join", href: "/en/join" },
      { label: "Contact", href: "/en/contact" }
    ],
    navbar: {
      languageToggleLabel: "Choose site language",
      menuButtonLabel: "Toggle navigation menu"
    },
    origin: {
      cardBody:
        "It points to a journey where young people walk together, are renewed by the word of God, and find their hearts set ablaze again with faith, clarity, and hope.",
      cardTitle: "Hearts on Fire",
      description:
        "The name draws from the Emmaus road image of hearts burning within as people walk with Christ and hear His word opened to them.",
      eyebrow: "Origin",
      paragraphs: [
        "We believe young people need more than a memorable event. They need real relationships in which the word of God continues to awaken, clarify, and strengthen them.",
        "For us, “Hearts on Fire” is not only a name. It expresses a ministry posture: walking with young people across Europe as we listen, discern, and respond together."
      ],
      title: "The Emmaus road image of hearts burning within"
    },
    rhythm: {
      description:
        "Through camps, online gatherings, and relational accompaniment, we are slowly building a network of companionship that spans cities, cultures, and life stages.",
      eyebrow: "Current Rhythm",
      items: [
        {
          description:
            "We continue connecting young people from different countries and cities through the steady rhythm of preparing for and hosting the annual Eastern Europe youth camp.",
          icon: CalendarDays,
          tag: "CAMP RHYTHM",
          title: "Annual Camp"
        },
        {
          description:
            "Online gatherings, Bible study, and prayer create a way for people spread across Europe to keep meeting and walking together consistently.",
          icon: Monitor,
          tag: "ONLINE CONNECTION",
          title: "Online Companionship"
        },
        {
          description:
            "We accompany young people through university, work, migration, and cross-cultural life so that faith is lived in ordinary places, not only at special events.",
          icon: HeartHandshake,
          tag: "RELATIONAL CARE",
          title: "Discipleship"
        }
      ],
      quoteBody:
        "A camp may be where the story begins, but we do not want it to end there. We hope each encounter can deepen into long-term relationship, formation, and response.",
      quoteTitle: "We care more about lasting companionship than short-lived momentum",
      title: "This is not just an event. It is a journey that keeps unfolding."
    },
    vision: {
      cards: [
        {
          description:
            "To build a cross-border platform of Christian young people in Europe where lives are rooted in truth, mature in faith, and live out God’s call in their own cities and nations.",
          icon: Target,
          title: "Vision"
        },
        {
          description:
            "Through camps, online gatherings, and ongoing companionship, we connect and equip young people across Europe for spiritual growth, resilient community, and faithful leadership.",
          icon: Users,
          title: "Mission"
        }
      ],
      description:
        "Our aim is not simply to gather event participants, but to nurture a spiritual network of young people that can continue to shape cities and nations through a steady rhythm of companionship.",
      eyebrow: "Vision, Mission, Goals & Strategy",
      goals: [
        { label: "Young people connected", value: "100+" },
        { label: "European countries reached", value: "10+" },
        { label: "Core team members", value: "15+" },
        { label: "Leadership succession", value: "Long-term" }
      ],
      goalsDescription:
        "We want to build a cross-border discipleship network for young people while growing steadily, without sacrificing relational depth or spiritual formation.",
      goalsHeading: "Moving forward with clear goals and a steady rhythm",
      goalsTitle: "Goals",
      strategies: [
        "We choose a small and steady pace, strengthening genuine relationships before expanding influence.",
        "We combine online gatherings with in-person camps so young people across Europe can remain connected over time.",
        "We place spiritual formation and leadership development at the center, not just event production.",
        "We cultivate trusted partnerships and transparent stewardship so the ministry can grow on a healthy foundation."
      ],
      strategyTitle: "Strategy",
      title: "Rooted in truth, growing with clarity and steadiness"
    },
    whatWeDo: {
      description:
        "Events are only the starting point. What matters most is the ongoing rhythm of relationship, formation, and mission that follows.",
      eyebrow: "What We Do",
      items: [
        {
          description:
            "We continue the Eastern Europe youth camp tradition that began in 2019. Since 2025, Hearts on Fire has been stewarding this annual gathering as a place of connection and renewal.",
          icon: CalendarDays,
          title: "Camps"
        },
        {
          description:
            "Young people across countries and cities meet regularly online for Bible study, prayer, and honest conversations about faith and everyday life.",
          icon: Monitor,
          title: "Online Gatherings"
        },
        {
          description:
            "We walk relationally with young people so they can grow beyond event-based participation into grounded discipleship and spiritual maturity.",
          icon: HeartHandshake,
          title: "Discipleship"
        },
        {
          description:
            "We invest in core co-workers and emerging leaders so disciples can raise up disciples and the work can continue across Europe.",
          icon: GraduationCap,
          title: "Leadership Formation"
        }
      ],
      title: "Gathering, accompanying, and equipping young people for lasting growth"
    }
  }
};

function getViewTitle(copy: PageContent, view: SiteView) {
  switch (view) {
    case "home":
      return copy.brand.logoTitle;
    case "about":
      return copy.about.eyebrow;
    case "origin":
      return copy.origin.eyebrow;
    case "vision":
      return copy.vision.eyebrow;
    case "what-we-do":
      return copy.whatWeDo.eyebrow;
    case "memories":
      return copy.memories.eyebrow;
    case "find-ta":
      return copy.findTa.eyebrow;
    case "join":
      return copy.join.eyebrow;
    case "contact":
      return copy.contact.eyebrow;
  }
}

function getViewDescription(copy: PageContent, view: SiteView) {
  switch (view) {
    case "home":
      return copy.hero.subtitle;
    case "about":
      return copy.about.description;
    case "origin":
      return copy.origin.description;
    case "vision":
      return copy.vision.description;
    case "what-we-do":
      return copy.whatWeDo.description;
    case "memories":
      return copy.memories.title;
    case "find-ta":
      return copy.findTa.description;
    case "join":
      return copy.join.description;
    case "contact":
      return copy.contact.description;
  }
}

export function getPageMetadata(lang: Language, view: SiteView): Metadata {
  const copy = siteContent[lang];
  const title =
    view === "home" ? copy.brand.logoTitle : `${getViewTitle(copy, view)} | ${copy.brand.logoTitle}`;

  return {
    alternates: {
      canonical: getPagePath(lang, view),
      languages: {
        "zh-CN": getPagePath("zh", view),
        "en-US": getPagePath("en", view)
      }
    },
    description: getViewDescription(copy, view),
    title
  };
}
