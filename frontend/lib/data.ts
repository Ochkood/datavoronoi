import type { PostData } from "@/components/post-card"

export const posts: PostData[] = [
  {
    id: "1",
    title: "Монголын ДНБ-ний өсөлт: Сүүлийн 10 жилийн дата шинжилгээ",
    excerpt:
      "Монголын эдийн засгийн өсөлтийн чиг хандлагыг тоон мэдээлэлд суурилсан инфографикаар харуулж байна.",
    category: "Эдийн засаг",
    categorySlug: "economy",
    categoryColor: "bg-chart-1/15 text-chart-1",
    image: "/images/infographic-1.jpg",
    author: "Б. Болормаа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    date: "2 цагийн өмнө",
    views: "12.4K",
    comments: 45,
  },
  {
    id: "2",
    title: "Дэлхийн сэргээгдэх эрчим хүчний хэрэглээ улс бүрээр",
    excerpt:
      "Сэргээгдэх эрчим хүчний тэргүүлэгч орнууд болон ирээдүйн хандлагын дата визуализаци.",
    category: "Байгаль орчин",
    categorySlug: "environment",
    categoryColor: "bg-chart-4/15 text-chart-4",
    image: "/images/infographic-2.jpg",
    author: "Д. Ганзориг",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
    date: "5 цагийн өмнө",
    views: "8.2K",
    comments: 23,
  },
  {
    id: "3",
    title: "Дэлхийн хүн амын тархалт тив бүрээр: 2025 оны байдлаар",
    excerpt:
      "8 тэрбум давсан дэлхийн хүн амын статистик мэдээллийг тив болон бүс нутгаар ангилан харуулав.",
    category: "Дэлхий",
    categorySlug: "world",
    categoryColor: "bg-chart-3/15 text-chart-3",
    image: "/images/infographic-3.jpg",
    author: "Ц. Сарантуяа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
    date: "8 цагийн өмнө",
    views: "6.9K",
    comments: 18,
  },
  {
    id: "4",
    title: "Технологийн компаниудын зах зээлийн үнэлгээний харьцуулалт",
    excerpt:
      "Apple, Microsoft, NVIDIA зэрэг дэлхийн том компаниудын зах зээлийн үнэлгээг хооронд нь жишив.",
    category: "Технологи",
    categorySlug: "technology",
    categoryColor: "bg-chart-2/15 text-chart-2",
    image: "/images/infographic-4.jpg",
    author: "Э. Тэмүүлэн",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
    date: "12 цагийн өмнө",
    views: "11.3K",
    comments: 56,
  },
  {
    id: "5",
    title: "Дэлхийн нүүрсхүчлийн хийн ялгарал салбар тус бүрээр",
    excerpt:
      "Эрчим хүч, тээвэр, үйлдвэрлэл зэрэг салбаруудын нүүрсхүчлийн хийн ялгарлын хэмжээг шинжлэв.",
    category: "Байгаль орчин",
    categorySlug: "environment",
    categoryColor: "bg-chart-4/15 text-chart-4",
    image: "/images/infographic-5.jpg",
    author: "Б. Болормаа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    date: "1 өдрийн өмнө",
    views: "5.4K",
    comments: 12,
  },
  {
    id: "6",
    title: "Крипто зах зээлийн тойм: Bitcoin, Ethereum-ын үнийн чиг хандлага",
    excerpt:
      "2025 оны крипто зах зээлийн нөхцөл байдал, гол тоон үзүүлэлтүүдийг нэг дороос харна уу.",
    category: "Санхүү",
    categorySlug: "finance",
    categoryColor: "bg-chart-5/15 text-chart-5",
    image: "/images/infographic-6.jpg",
    author: "Д. Ганзориг",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
    date: "1 өдрийн өмнө",
    views: "9.7K",
    comments: 34,
  },
  {
    id: "7",
    title: "Хиймэл оюуны салбарын өсөлт ба хөрөнгө оруулалтын чиг хандлага",
    excerpt:
      "AI стартап, том компаниудын хөрөнгө оруулалт, хэрэглээний статистикийн инфографик.",
    category: "Технологи",
    categorySlug: "technology",
    categoryColor: "bg-chart-2/15 text-chart-2",
    image: "/images/infographic-7.jpg",
    author: "Э. Тэмүүлэн",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
    date: "2 өдрийн өмнө",
    views: "14.1K",
    comments: 67,
  },
  {
    id: "8",
    title: "Дэлхийн худалдааны зам: Импорт, экспортын гол урсгал",
    excerpt:
      "Олон улсын худалдааны гол маршрут, бараа бүтээгдэхүүний урсгалыг газрын зураг дээр харуулав.",
    category: "Эдийн засаг",
    categorySlug: "economy",
    categoryColor: "bg-chart-1/15 text-chart-1",
    image: "/images/infographic-8.jpg",
    author: "Ц. Сарантуяа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
    date: "2 өдрийн өмнө",
    views: "4.8K",
    comments: 9,
  },
  {
    id: "9",
    title: "Эрүүл мэндийн зардал: Дэлхийн улсуудын харьцуулалт",
    excerpt:
      "Улс орнуудын эрүүл мэндийн салбарт зарцуулж буй хөрөнгийг ДНБ-д эзлэх хувиар нь жишив.",
    category: "Эрүүл мэнд",
    categorySlug: "health",
    categoryColor: "bg-destructive/15 text-destructive",
    image: "/images/infographic-9.jpg",
    author: "Б. Болормаа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    date: "3 өдрийн өмнө",
    views: "3.6K",
    comments: 15,
  },
  {
    id: "10",
    title: "Монголын төсвийн орлого, зарлагын бүтэц 2025",
    excerpt:
      "Улсын төсвийн гол эх үүсвэр, зарцуулалтын чиглэлүүдийг харьцуулсан инфографик.",
    category: "Эдийн засаг",
    categorySlug: "economy",
    categoryColor: "bg-chart-1/15 text-chart-1",
    image: "/images/infographic-1.jpg",
    author: "Б. Болормаа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    date: "4 өдрийн өмнө",
    views: "7.2K",
    comments: 28,
  },
  {
    id: "11",
    title: "Монголын инфляцийн түүх ба төлөв",
    excerpt:
      "Сүүлийн 20 жилийн инфляцийн хэлбэлзэл, нөлөөлсөн хүчин зүйлсийн шинжилгээ.",
    category: "Эдийн засаг",
    categorySlug: "economy",
    categoryColor: "bg-chart-1/15 text-chart-1",
    image: "/images/infographic-8.jpg",
    author: "Д. Ганзориг",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
    date: "5 өдрийн өмнө",
    views: "5.8K",
    comments: 19,
  },
]

export interface CategoryInfo {
  slug: string
  name: string
  description: string
  color: string
  bgColor: string
  icon?: string
  bannerImage?: string
}

export const categories: CategoryInfo[] = [
  {
    slug: "economy",
    name: "Эдийн засаг",
    description: "Монгол болон дэлхийн эдийн засгийн мэдээ, шинжилгээ",
    color: "text-chart-1",
    bgColor: "bg-chart-1",
    icon: "TrendingUp",
    bannerImage: "/images/infographic-1.jpg",
  },
  {
    slug: "technology",
    name: "Технологи",
    description: "Технологийн салбарын мэдээ, инноваци, стартап",
    color: "text-chart-2",
    bgColor: "bg-chart-2",
    icon: "Cpu",
    bannerImage: "/images/infographic-4.jpg",
  },
  {
    slug: "environment",
    name: "Байгаль орчин",
    description: "Байгаль орчин, уур амьсгалын өөрчлөлт, тогтвортой хөгжил",
    color: "text-chart-4",
    bgColor: "bg-chart-4",
    icon: "Leaf",
    bannerImage: "/images/infographic-2.jpg",
  },
  {
    slug: "health",
    name: "Эрүүл мэнд",
    description: "Эрүүл мэндийн салбарын мэдээ, судалгаа, статистик",
    color: "text-destructive",
    bgColor: "bg-destructive",
    icon: "Heart",
    bannerImage: "/images/infographic-9.jpg",
  },
  {
    slug: "finance",
    name: "Санхүү",
    description: "Санхүү, банк, хөрөнгийн зах зээлийн мэдээлэл",
    color: "text-chart-5",
    bgColor: "bg-chart-5",
    icon: "Wallet",
    bannerImage: "/images/infographic-6.jpg",
  },
  {
    slug: "world",
    name: "Дэлхий",
    description: "Олон улсын мэдээ, геополитик, глобал хандлага",
    color: "text-chart-3",
    bgColor: "bg-chart-3",
    icon: "Globe",
    bannerImage: "/images/infographic-3.jpg",
  },
]

export function getPostsByCategory(slug: string): PostData[] {
  return posts.filter((post) => post.categorySlug === slug)
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((cat) => cat.slug === slug)
}

// Category Statistics Data
export interface StatItem {
  label: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  description?: string
  icon?: string
  link?: string
}

export interface ChartDataPoint {
  name: string
  value: number
  value2?: number
  value3?: number
  value4?: number
}

export interface CategoryStats {
  highlights: StatItem[]
  charts: {
    title: string
    type: "line" | "bar" | "area" | "pie"
    data: ChartDataPoint[]
    dataKey?: string
    dataKey2?: string
    dataKey3?: string
    dataKey4?: string
    dataLabel?: string
    dataLabel2?: string
    dataLabel3?: string
    dataLabel4?: string
    icon?: string
    link?: string
  }[]
}

export const categoryStats: Record<string, CategoryStats> = {
  economy: {
    highlights: [
      {
        label: "ДНБ (2025)",
        value: "21.8 тэрбум $",
        change: "+5.2%",
        changeType: "positive",
        description: "Өмнөх оноос",
      },
      {
        label: "Инфляци",
        value: "8.4%",
        change: "-2.1%",
        changeType: "positive",
        description: "Өмнөх оноос буурсан",
      },
      {
        label: "Төсвийн алдагдал",
        value: "2.8%",
        change: "+0.3%",
        changeType: "negative",
        description: "ДНБ-д эзлэх хувь",
      },
      {
        label: "Гадаад худалдааны тэнцэл",
        value: "+1.2 тэрбум $",
        change: "+15%",
        changeType: "positive",
        description: "Ашигтай тэнцэл",
      },
      {
        label: "Гадаадын хөрөнгө оруулалт",
        value: "2.1 тэрбум $",
        change: "+18%",
        changeType: "positive",
        description: "Өмнөх оноос",
      },
      {
        label: "Ажилгүйдэл",
        value: "6.2%",
        change: "-0.8%",
        changeType: "positive",
        description: "Өмнөх оноос буурсан",
      },
    ],
    charts: [
      {
        title: "ДНБ-ийн өсөлт (жилээр, %)",
        type: "area",
        data: [
          { name: "2019", value: 5.2 },
          { name: "2020", value: -4.4 },
          { name: "2021", value: 1.6 },
          { name: "2022", value: 5.0 },
          { name: "2023", value: 7.0 },
          { name: "2024", value: 5.8 },
          { name: "2025", value: 5.2 },
        ],
        dataKey: "value",
      },
      {
        title: "Инфляцийн түвшин (%)",
        type: "line",
        data: [
          { name: "2019", value: 7.3 },
          { name: "2020", value: 3.8 },
          { name: "2021", value: 7.4 },
          { name: "2022", value: 15.2 },
          { name: "2023", value: 10.5 },
          { name: "2024", value: 10.5 },
          { name: "2025", value: 8.4 },
        ],
        dataKey: "value",
      },
      {
        title: "Төсвийн орлого ба зарлага (тэрбум ₮)",
        type: "bar",
        data: [
          { name: "2021", value: 11200, value2: 13500 },
          { name: "2022", value: 14800, value2: 16200 },
          { name: "2023", value: 17500, value2: 18900 },
          { name: "2024", value: 19200, value2: 20100 },
          { name: "2025", value: 21000, value2: 21800 },
        ],
        dataKey: "value",
        dataKey2: "value2",
      },
      {
        title: "Гадаадын шууд хөрөнгө оруулалт (сая $)",
        type: "bar",
        data: [
          { name: "2020", value: 1540 },
          { name: "2021", value: 1680 },
          { name: "2022", value: 1820 },
          { name: "2023", value: 1950 },
          { name: "2024", value: 1780 },
          { name: "2025", value: 2100 },
        ],
        dataKey: "value",
      },
    ],
  },
  technology: {
    highlights: [
      {
        label: "IT салбарын хувь",
        value: "3.2%",
        change: "+0.4%",
        changeType: "positive",
        description: "ДНБ-д эзлэх хувь",
      },
      {
        label: "Интернэт хэрэглэгч",
        value: "2.8 сая",
        change: "+12%",
        changeType: "positive",
        description: "Нийт хүн амын 82%",
      },
      {
        label: "Стартап тоо",
        value: "450+",
        change: "+25%",
        changeType: "positive",
        description: "Бүртгэлтэй стартап",
      },
      {
        label: "IT ажилтан",
        value: "32,000",
        change: "+18%",
        changeType: "positive",
        description: "Салбарын ажилтан",
      },
      {
        label: "Экспорт",
        value: "85 сая $",
        change: "+22%",
        changeType: "positive",
        description: "IT үйлчилгээний экспорт",
      },
      {
        label: "5G хамрах хүрээ",
        value: "45%",
        change: "+20%",
        changeType: "positive",
        description: "Улаанбаатар хотод",
      },
    ],
    charts: [
      {
        title: "IT салбарын орлого (тэрбум ₮)",
        type: "area",
        data: [
          { name: "2020", value: 580 },
          { name: "2021", value: 720 },
          { name: "2022", value: 890 },
          { name: "2023", value: 1050 },
          { name: "2024", value: 1280 },
          { name: "2025", value: 1520 },
        ],
        dataKey: "value",
      },
      {
        title: "Интернэт хэрэглэгчийн өсөлт (сая)",
        type: "line",
        data: [
          { name: "2020", value: 2.1 },
          { name: "2021", value: 2.3 },
          { name: "2022", value: 2.5 },
          { name: "2023", value: 2.6 },
          { name: "2024", value: 2.7 },
          { name: "2025", value: 2.8 },
        ],
        dataKey: "value",
      },
      {
        title: "Стартап хөрөнгө оруулалт (сая $)",
        type: "bar",
        data: [
          { name: "2020", value: 8 },
          { name: "2021", value: 15 },
          { name: "2022", value: 22 },
          { name: "2023", value: 35 },
          { name: "2024", value: 42 },
          { name: "2025", value: 58 },
        ],
        dataKey: "value",
      },
    ],
  },
  environment: {
    highlights: [
      {
        label: "CO2 ялгарал",
        value: "32.5 сая тн",
        change: "-3%",
        changeType: "positive",
        description: "Жилийн нийт ялгарал",
      },
      {
        label: "Сэргээгдэх эрчим хүч",
        value: "12%",
        change: "+2%",
        changeType: "positive",
        description: "Нийт эрчим хүчний хувь",
      },
      {
        label: "Ойн талбай",
        value: "7.9%",
        change: "-0.2%",
        changeType: "negative",
        description: "Нийт газар нутгийн хувь",
      },
      {
        label: "Агаарын бохирдол (PM2.5)",
        value: "75 µg/m³",
        change: "-8%",
        changeType: "positive",
        description: "Улаанбаатар, өвөл",
      },
      {
        label: "Хамгаалалттай газар",
        value: "21%",
        change: "+1%",
        changeType: "positive",
        description: "Нийт газар нутгийн хувь",
      },
      {
        label: "Нар, салхины станц",
        value: "245 МВт",
        change: "+35%",
        changeType: "positive",
        description: "Нийт суурилагдсан хүчин чадал",
      },
    ],
    charts: [
      {
        title: "CO2 ялгарал (сая тонн)",
        type: "area",
        data: [
          { name: "2019", value: 35.2 },
          { name: "2020", value: 33.1 },
          { name: "2021", value: 34.5 },
          { name: "2022", value: 34.8 },
          { name: "2023", value: 33.5 },
          { name: "2024", value: 33.2 },
          { name: "2025", value: 32.5 },
        ],
        dataKey: "value",
      },
      {
        title: "Сэргээгдэх эрчим хүчний хувь (%)",
        type: "line",
        data: [
          { name: "2019", value: 5 },
          { name: "2020", value: 6 },
          { name: "2021", value: 7 },
          { name: "2022", value: 8 },
          { name: "2023", value: 10 },
          { name: "2024", value: 11 },
          { name: "2025", value: 12 },
        ],
        dataKey: "value",
      },
      {
        title: "Агаарын бохирдол PM2.5 (µg/m³) - УБ",
        type: "bar",
        data: [
          { name: "2019", value: 120 },
          { name: "2020", value: 95 },
          { name: "2021", value: 88 },
          { name: "2022", value: 85 },
          { name: "2023", value: 82 },
          { name: "2024", value: 78 },
          { name: "2025", value: 75 },
        ],
        dataKey: "value",
      },
    ],
  },
  health: {
    highlights: [
      {
        label: "Эрүүл мэндийн зардал",
        value: "4.2%",
        change: "+0.3%",
        changeType: "positive",
        description: "ДНБ-д эзлэх хувь",
      },
      {
        label: "Дундаж наслалт",
        value: "71.5 жил",
        change: "+0.8 жил",
        changeType: "positive",
        description: "Өмнөх оноос",
      },
      {
        label: "Эмч/10,000 хүн",
        value: "38.5",
        change: "+2.1",
        changeType: "positive",
        description: "2024 оны байдлаар",
      },
      {
        label: "Эмнэлгийн ор",
        value: "28,500",
        change: "+5%",
        changeType: "positive",
        description: "Улсын хэмжээнд",
      },
      {
        label: "Вакцинжуулалт",
        value: "95%",
        change: "+2%",
        changeType: "positive",
        description: "Хүүхдийн вакцин",
      },
      {
        label: "Эх нярайн эндэгдэл",
        value: "12.5‰",
        change: "-1.2‰",
        changeType: "positive",
        description: "1000 төрөлтөд",
      },
    ],
    charts: [
      {
        title: "Эрүүл мэндийн зардал (тэрбум ₮)",
        type: "area",
        data: [
          { name: "2020", value: 1850 },
          { name: "2021", value: 2100 },
          { name: "2022", value: 2450 },
          { name: "2023", value: 2780 },
          { name: "2024", value: 3050 },
          { name: "2025", value: 3400 },
        ],
        dataKey: "value",
      },
      {
        title: "Дундаж наслалт (жил)",
        type: "line",
        data: [
          { name: "2015", value: 69.5 },
          { name: "2017", value: 69.8 },
          { name: "2019", value: 70.2 },
          { name: "2021", value: 70.5 },
          { name: "2023", value: 70.8 },
          { name: "2025", value: 71.5 },
        ],
        dataKey: "value",
      },
      {
        title: "Эмч, сувилагчийн тоо",
        type: "bar",
        data: [
          { name: "2020", value: 11200, value2: 18500 },
          { name: "2021", value: 11800, value2: 19200 },
          { name: "2022", value: 12200, value2: 19800 },
          { name: "2023", value: 12800, value2: 20500 },
          { name: "2024", value: 13200, value2: 21200 },
          { name: "2025", value: 13800, value2: 22000 },
        ],
        dataKey: "value",
        dataKey2: "value2",
      },
    ],
  },
  finance: {
    highlights: [
      {
        label: "Банкны нийт актив",
        value: "52.4 их наяд ₮",
        change: "+12%",
        changeType: "positive",
        description: "2025 оны байдлаар",
      },
      {
        label: "Хөрөнгийн биржийн индекс",
        value: "32,450",
        change: "+18%",
        changeType: "positive",
        description: "ТОР-20 индекс",
      },
      {
        label: "Бодлогын хүү",
        value: "11%",
        change: "-2%",
        changeType: "positive",
        description: "Төв банк",
      },
      {
        label: "Гадаад валютын нөөц",
        value: "4.8 тэрбум $",
        change: "+8%",
        changeType: "positive",
        description: "Төв банкны нөөц",
      },
      {
        label: "Зээлийн өсөлт",
        value: "15.2%",
        change: "+3%",
        changeType: "neutral",
        description: "Жилийн өсөлт",
      },
      {
        label: "Даатгалын зах зээл",
        value: "320 тэрбум ₮",
        change: "+22%",
        changeType: "positive",
        description: "Нийт хураамж",
      },
    ],
    charts: [
      {
        title: "ТОР-20 индексийн хөдөлгөөн",
        type: "area",
        data: [
          { name: "1-р сар", value: 28500 },
          { name: "3-р сар", value: 29200 },
          { name: "5-р сар", value: 30100 },
          { name: "7-р сар", value: 29800 },
          { name: "9-р сар", value: 31200 },
          { name: "11-р сар", value: 32450 },
        ],
        dataKey: "value",
      },
      {
        title: "Банкны зээл ба хадгаламж (их наяд ₮)",
        type: "bar",
        data: [
          { name: "2021", value: 28, value2: 22 },
          { name: "2022", value: 32, value2: 25 },
          { name: "2023", value: 36, value2: 28 },
          { name: "2024", value: 42, value2: 32 },
          { name: "2025", value: 48, value2: 38 },
        ],
        dataKey: "value",
        dataKey2: "value2",
      },
      {
        title: "$/₮ ханш",
        type: "line",
        data: [
          { name: "2020", value: 2850 },
          { name: "2021", value: 2860 },
          { name: "2022", value: 3150 },
          { name: "2023", value: 3450 },
          { name: "2024", value: 3420 },
          { name: "2025", value: 3380 },
        ],
        dataKey: "value",
      },
    ],
  },
  world: {
    highlights: [
      {
        label: "Дэлхийн хүн ам",
        value: "8.1 тэрбум",
        change: "+0.9%",
        changeType: "neutral",
        description: "2025 оны байдлаар",
      },
      {
        label: "Дэлхийн ДНБ",
        value: "105 их наяд $",
        change: "+3.2%",
        changeType: "positive",
        description: "2025 оны таамаг",
      },
      {
        label: "Глобал инфляци",
        value: "5.8%",
        change: "-1.5%",
        changeType: "positive",
        description: "Дундаж түвшин",
      },
      {
        label: "Интернэт хэрэглэгч",
        value: "5.5 тэрбум",
        change: "+4%",
        changeType: "positive",
        description: "Дэлхий даяар",
      },
      {
        label: "Сэргээгдэх эрчим хүч",
        value: "30%",
        change: "+3%",
        changeType: "positive",
        description: "Дэлхийн нийт эрчим хүч",
      },
      {
        label: "AI зах зээл",
        value: "185 тэрбум $",
        change: "+38%",
        changeType: "positive",
        description: "Глобал зах зээлийн хэмжээ",
      },
    ],
    charts: [
      {
        title: "Дэлхийн ДНБ өсөлт (%)",
        type: "area",
        data: [
          { name: "2020", value: -3.1 },
          { name: "2021", value: 6.0 },
          { name: "2022", value: 3.4 },
          { name: "2023", value: 3.0 },
          { name: "2024", value: 3.1 },
          { name: "2025", value: 3.2 },
        ],
        dataKey: "value",
      },
      {
        title: "Дэлхийн хүн амын өсөлт (тэрбум)",
        type: "line",
        data: [
          { name: "2000", value: 6.1 },
          { name: "2005", value: 6.5 },
          { name: "2010", value: 6.9 },
          { name: "2015", value: 7.4 },
          { name: "2020", value: 7.8 },
          { name: "2025", value: 8.1 },
        ],
        dataKey: "value",
      },
      {
        title: "Бүс нутгийн ДНБ (их наяд $)",
        type: "bar",
        data: [
          { name: "Хойд Америк", value: 28 },
          { name: "Европ", value: 22 },
          { name: "Ази", value: 38 },
          { name: "Бусад", value: 17 },
        ],
        dataKey: "value",
      },
    ],
  },
}

// Topics - Dynamic themes/events (like COP17, Elections, etc.)
export interface TopicInfo {
  slug: string
  name: string
  description: string
  image: string
  color: string
  bgColor: string
  startDate?: string
  endDate?: string
  featured?: boolean
}

export const topics: TopicInfo[] = [
  {
    slug: "cop29",
    name: "COP29 Уур амьсгалын бага хурал",
    description: "2024 оны НҮБ-ын уур амьсгалын өөрчлөлтийн бага хурал, Азербайжан",
    image: "/images/infographic-2.jpg",
    color: "text-chart-4",
    bgColor: "bg-chart-4",
    startDate: "2024-11-11",
    endDate: "2024-11-22",
    featured: true,
  },
  {
    slug: "mongolia-election-2024",
    name: "Монголын Сонгууль 2024",
    description: "УИХ-ын сонгуулийн үр дүн, статистик мэдээлэл",
    image: "/images/infographic-3.jpg",
    color: "text-primary",
    bgColor: "bg-primary",
    startDate: "2024-06-28",
    featured: true,
  },
  {
    slug: "ai-revolution",
    name: "AI Хувьсгал",
    description: "Хиймэл оюуны технологийн хөгжил, нөлөө, ирээдүй",
    image: "/images/infographic-7.jpg",
    color: "text-chart-2",
    bgColor: "bg-chart-2",
    featured: true,
  },
  {
    slug: "global-economy-2025",
    name: "Дэлхийн эдийн засаг 2025",
    description: "2025 оны дэлхийн эдийн засгийн төлөв байдал, таамаглал",
    image: "/images/infographic-8.jpg",
    color: "text-chart-1",
    bgColor: "bg-chart-1",
    featured: false,
  },
  {
    slug: "crypto-market",
    name: "Крипто зах зээл",
    description: "Криптовалют, блокчэйн технологийн мэдээ, шинжилгээ",
    image: "/images/infographic-6.jpg",
    color: "text-chart-5",
    bgColor: "bg-chart-5",
    featured: false,
  },
]

export function getTopicBySlug(slug: string): TopicInfo | undefined {
  return topics.find((topic) => topic.slug === slug)
}

export function getPostsByTopic(topicSlug: string): PostData[] {
  // Map topic slugs to relevant categories/keywords
  const topicCategoryMap: Record<string, string[]> = {
    "cop29": ["environment", "Байгаль орчин"],
    "mongolia-election-2024": ["world", "Дэлхий"],
    "ai-revolution": ["technology", "Технологи"],
    "global-economy-2025": ["economy", "Эдийн засаг"],
    "crypto-market": ["finance", "Санхүү"],
  }
  
  const relatedCategories = topicCategoryMap[topicSlug] || []
  return posts.filter((post) => 
    relatedCategories.includes(post.categorySlug || "") || 
    relatedCategories.includes(post.category)
  )
}

// Topic Statistics
export const topicStats: Record<string, CategoryStats> = {
  "cop29": {
    highlights: [
      {
        label: "Оролцогч орон",
        value: "197",
        change: "+2",
        changeType: "positive",
        description: "НҮБ-ын гишүүн орнууд",
      },
      {
        label: "Санхүүжилтийн зорилт",
        value: "100 тэрбум $",
        change: "Жил бүр",
        changeType: "neutral",
        description: "Хөгжиж буй орнуудад",
      },
      {
        label: "Дулааралын зорилт",
        value: "1.5°C",
        description: "Парисын хэлэлцээр",
      },
      {
        label: "CO2 бууралтын зорилт",
        value: "45%",
        change: "2030 он гэхэд",
        changeType: "neutral",
        description: "2010 оноос",
      },
    ],
    charts: [
      {
        title: "Дэлхийн дундаж температурын өөрчлөлт (°C)",
        type: "area",
        data: [
          { name: "1990", value: 0.45 },
          { name: "2000", value: 0.42 },
          { name: "2010", value: 0.72 },
          { name: "2015", value: 0.90 },
          { name: "2020", value: 1.02 },
          { name: "2024", value: 1.15 },
        ],
        dataKey: "value",
      },
      {
        title: "CO2 ялгарал (гигатонн)",
        type: "line",
        data: [
          { name: "2015", value: 35.5 },
          { name: "2018", value: 36.8 },
          { name: "2020", value: 34.2 },
          { name: "2022", value: 36.8 },
          { name: "2024", value: 37.4 },
        ],
        dataKey: "value",
      },
    ],
  },
  "mongolia-election-2024": {
    highlights: [
      {
        label: "Нийт сонгогч",
        value: "2.1 сая",
        description: "Бүртгэлтэй сонгогч",
      },
      {
        label: "Оролцоо",
        value: "73.2%",
        change: "+5%",
        changeType: "positive",
        description: "2020 оноос",
      },
      {
        label: "УИХ-ын гишүүн",
        value: "126",
        description: "Нийт суудал",
      },
      {
        label: "Нам, эвсэл",
        value: "28",
        description: "Оролцсон",
      },
    ],
    charts: [
      {
        title: "Сонгуулийн оролцоо (%) - Түүхээр",
        type: "bar",
        data: [
          { name: "2008", value: 74.3 },
          { name: "2012", value: 65.2 },
          { name: "2016", value: 72.1 },
          { name: "2020", value: 68.2 },
          { name: "2024", value: 73.2 },
        ],
        dataKey: "value",
      },
    ],
  },
  "ai-revolution": {
    highlights: [
      {
        label: "AI зах зээлийн хэмжээ",
        value: "185 тэрбум $",
        change: "+38%",
        changeType: "positive",
        description: "2025 он",
      },
      {
        label: "AI стартап",
        value: "15,000+",
        change: "+25%",
        changeType: "positive",
        description: "Дэлхий даяар",
      },
      {
        label: "AI-д хөрөнгө оруулалт",
        value: "95 тэрбум $",
        change: "+45%",
        changeType: "positive",
        description: "2024 онд",
      },
      {
        label: "ChatGPT хэрэглэгч",
        value: "200 сая+",
        change: "7 хоногт",
        changeType: "positive",
        description: "Идэвхтэй хэрэглэгч",
      },
    ],
    charts: [
      {
        title: "Глобал AI зах зээлийн хэмжээ (тэрбум $)",
        type: "area",
        data: [
          { name: "2020", value: 50 },
          { name: "2021", value: 65 },
          { name: "2022", value: 87 },
          { name: "2023", value: 120 },
          { name: "2024", value: 155 },
          { name: "2025", value: 185 },
        ],
        dataKey: "value",
      },
      {
        title: "AI-д хөрөнгө оруулалт (тэрбум $)",
        type: "bar",
        data: [
          { name: "2020", value: 36 },
          { name: "2021", value: 52 },
          { name: "2022", value: 68 },
          { name: "2023", value: 75 },
          { name: "2024", value: 95 },
        ],
        dataKey: "value",
      },
    ],
  },
  "global-economy-2025": {
    highlights: [
      {
        label: "Дэлхийн ДНБ өсөлт",
        value: "3.2%",
        change: "+0.1%",
        changeType: "positive",
        description: "2025 оны таамаг",
      },
      {
        label: "Глобал инфляци",
        value: "5.8%",
        change: "-1.5%",
        changeType: "positive",
        description: "Дундаж түвшин",
      },
      {
        label: "Худалдааны өсөлт",
        value: "3.5%",
        change: "+1.2%",
        changeType: "positive",
        description: "Дэлхийн худалдаа",
      },
      {
        label: "Ажилгүйдэл",
        value: "5.2%",
        change: "-0.3%",
        changeType: "positive",
        description: "Дэлхийн дундаж",
      },
    ],
    charts: [
      {
        title: "Дэлхийн ДНБ өсөлт (%)",
        type: "area",
        data: [
          { name: "2020", value: -3.1 },
          { name: "2021", value: 6.0 },
          { name: "2022", value: 3.4 },
          { name: "2023", value: 3.0 },
          { name: "2024", value: 3.1 },
          { name: "2025", value: 3.2 },
        ],
        dataKey: "value",
      },
    ],
  },
  "crypto-market": {
    highlights: [
      {
        label: "Bitcoin үнэ",
        value: "$67,500",
        change: "+120%",
        changeType: "positive",
        description: "Жилийн өсөлт",
      },
      {
        label: "Нийт зах зээл",
        value: "2.8 их наяд $",
        change: "+85%",
        changeType: "positive",
        description: "Крипто зах зээл",
      },
      {
        label: "Ethereum үнэ",
        value: "$3,400",
        change: "+65%",
        changeType: "positive",
        description: "Жилийн өсөлт",
      },
      {
        label: "Идэвхтэй хэтэвч",
        value: "420 сая",
        change: "+35%",
        changeType: "positive",
        description: "Дэлхий даяар",
      },
    ],
    charts: [
      {
        title: "Bitcoin үнэ ($)",
        type: "line",
        data: [
          { name: "2020", value: 29000 },
          { name: "2021", value: 47000 },
          { name: "2022", value: 16500 },
          { name: "2023", value: 42000 },
          { name: "2024", value: 67500 },
        ],
        dataKey: "value",
      },
      {
        title: "Крипто зах зээлийн хэмжээ (их наяд $)",
        type: "area",
        data: [
          { name: "2020", value: 0.76 },
          { name: "2021", value: 2.2 },
          { name: "2022", value: 0.85 },
          { name: "2023", value: 1.5 },
          { name: "2024", value: 2.8 },
        ],
        dataKey: "value",
      },
    ],
  },
}
