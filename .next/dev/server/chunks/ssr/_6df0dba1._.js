module.exports = [
"[project]/lib/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "categoryStats",
    ()=>categoryStats,
    "getCategoryBySlug",
    ()=>getCategoryBySlug,
    "getPostsByCategory",
    ()=>getPostsByCategory,
    "getPostsByTopic",
    ()=>getPostsByTopic,
    "getTopicBySlug",
    ()=>getTopicBySlug,
    "posts",
    ()=>posts,
    "topicStats",
    ()=>topicStats,
    "topics",
    ()=>topics
]);
const posts = [
    {
        id: "1",
        title: "Монголын ДНБ-ний өсөлт: Сүүлийн 10 жилийн дата шинжилгээ",
        excerpt: "Монголын эдийн засгийн өсөлтийн чиг хандлагыг тоон мэдээлэлд суурилсан инфографикаар харуулж байна.",
        category: "Эдийн засаг",
        categorySlug: "economy",
        categoryColor: "bg-chart-1/15 text-chart-1",
        image: "/images/infographic-1.jpg",
        author: "Б. Болормаа",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
        date: "2 цагийн өмнө",
        views: "12.4K",
        comments: 45
    },
    {
        id: "2",
        title: "Дэлхийн сэргээгдэх эрчим хүчний хэрэглээ улс бүрээр",
        excerpt: "Сэргээгдэх эрчим хүчний тэргүүлэгч орнууд болон ирээдүйн хандлагын дата визуализаци.",
        category: "Байгаль орчин",
        categorySlug: "environment",
        categoryColor: "bg-chart-4/15 text-chart-4",
        image: "/images/infographic-2.jpg",
        author: "Д. Ганзориг",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
        date: "5 цагийн өмнө",
        views: "8.2K",
        comments: 23
    },
    {
        id: "3",
        title: "Дэлхийн хүн амын тархалт тив бүрээр: 2025 оны байдлаар",
        excerpt: "8 тэрбум давсан дэлхийн хүн амын статистик мэдээллийг тив болон бүс нутгаар ангилан харуулав.",
        category: "Дэлхий",
        categorySlug: "world",
        categoryColor: "bg-chart-3/15 text-chart-3",
        image: "/images/infographic-3.jpg",
        author: "Ц. Сарантуяа",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
        date: "8 цагийн өмнө",
        views: "6.9K",
        comments: 18
    },
    {
        id: "4",
        title: "Технологийн компаниудын зах зээлийн үнэлгээний харьцуулалт",
        excerpt: "Apple, Microsoft, NVIDIA зэрэг дэлхийн том компаниудын зах зээлийн үнэлгээг хооронд нь жишив.",
        category: "Технологи",
        categorySlug: "technology",
        categoryColor: "bg-chart-2/15 text-chart-2",
        image: "/images/infographic-4.jpg",
        author: "Э. Тэмүүлэн",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
        date: "12 цагийн өмнө",
        views: "11.3K",
        comments: 56
    },
    {
        id: "5",
        title: "Дэлхийн нүүрсхүчлийн хийн ялгарал салбар тус бүрээр",
        excerpt: "Эрчим хүч, тээвэр, үйлдвэрлэл зэрэг салбаруудын нүүрсхүчлийн хийн ялгарлын хэмжээг шинжлэв.",
        category: "Байгаль орчин",
        categorySlug: "environment",
        categoryColor: "bg-chart-4/15 text-chart-4",
        image: "/images/infographic-5.jpg",
        author: "Б. Болормаа",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
        date: "1 өдрийн өмнө",
        views: "5.4K",
        comments: 12
    },
    {
        id: "6",
        title: "Крипто зах зээлийн тойм: Bitcoin, Ethereum-ын үнийн чиг хандлага",
        excerpt: "2025 оны крипто зах зээлийн нөхцөл байдал, гол тоон үзүүлэлтүүдийг нэг дороос харна уу.",
        category: "Санхүү",
        categorySlug: "finance",
        categoryColor: "bg-chart-5/15 text-chart-5",
        image: "/images/infographic-6.jpg",
        author: "Д. Ганзориг",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
        date: "1 өдрийн өмнө",
        views: "9.7K",
        comments: 34
    },
    {
        id: "7",
        title: "Хиймэл оюуны салбарын өсөлт ба хөрөнгө оруулалтын чиг хандлага",
        excerpt: "AI стартап, том компаниудын хөрөнгө оруулалт, хэрэглээний статистикийн инфографик.",
        category: "Технологи",
        categorySlug: "technology",
        categoryColor: "bg-chart-2/15 text-chart-2",
        image: "/images/infographic-7.jpg",
        author: "Э. Тэмүүлэн",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
        date: "2 өдрийн өмнө",
        views: "14.1K",
        comments: 67
    },
    {
        id: "8",
        title: "Дэлхийн худалдааны зам: Импорт, экспортын гол урсгал",
        excerpt: "Олон улсын худалдааны гол маршрут, бараа бүтээгдэхүүний урсгалыг газрын зураг дээр харуулав.",
        category: "Эдийн засаг",
        categorySlug: "economy",
        categoryColor: "bg-chart-1/15 text-chart-1",
        image: "/images/infographic-8.jpg",
        author: "Ц. Сарантуяа",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
        date: "2 өдрийн өмнө",
        views: "4.8K",
        comments: 9
    },
    {
        id: "9",
        title: "Эрүүл мэндийн зардал: Дэлхийн улсуудын харьцуулалт",
        excerpt: "Улс орнуудын эрүүл мэндийн салбарт зарцуулж буй хөрөнгийг ДНБ-д эзлэх хувиар нь жишив.",
        category: "Эрүүл мэнд",
        categorySlug: "health",
        categoryColor: "bg-destructive/15 text-destructive",
        image: "/images/infographic-9.jpg",
        author: "Б. Болормаа",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
        date: "3 өдрийн өмнө",
        views: "3.6K",
        comments: 15
    },
    {
        id: "10",
        title: "Монголын төсвийн орлого, зарлагын бүтэц 2025",
        excerpt: "Улсын төсвийн гол эх үүсвэр, зарцуулалтын чиглэлүүдийг харьцуулсан инфографик.",
        category: "Эдийн засаг",
        categorySlug: "economy",
        categoryColor: "bg-chart-1/15 text-chart-1",
        image: "/images/infographic-1.jpg",
        author: "Б. Болормаа",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
        date: "4 өдрийн өмнө",
        views: "7.2K",
        comments: 28
    },
    {
        id: "11",
        title: "Монголын инфляцийн түүх ба төлөв",
        excerpt: "Сүүлийн 20 жилийн инфляцийн хэлбэлзэл, нөлөөлсөн хүчин зүйлсийн шинжилгээ.",
        category: "Эдийн засаг",
        categorySlug: "economy",
        categoryColor: "bg-chart-1/15 text-chart-1",
        image: "/images/infographic-8.jpg",
        author: "Д. Ганзориг",
        authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
        date: "5 өдрийн өмнө",
        views: "5.8K",
        comments: 19
    }
];
const categories = [
    {
        slug: "economy",
        name: "Эдийн засаг",
        description: "Монгол болон дэлхийн эдийн засгийн мэдээ, шинжилгээ",
        color: "text-chart-1",
        bgColor: "bg-chart-1",
        icon: "TrendingUp",
        bannerImage: "/images/infographic-1.jpg"
    },
    {
        slug: "technology",
        name: "Технологи",
        description: "Технологийн салбарын мэдээ, инноваци, стартап",
        color: "text-chart-2",
        bgColor: "bg-chart-2",
        icon: "Cpu",
        bannerImage: "/images/infographic-4.jpg"
    },
    {
        slug: "environment",
        name: "Байгаль орчин",
        description: "Байгаль орчин, уур амьсгалын өөрчлөлт, тогтвортой хөгжил",
        color: "text-chart-4",
        bgColor: "bg-chart-4",
        icon: "Leaf",
        bannerImage: "/images/infographic-2.jpg"
    },
    {
        slug: "health",
        name: "Эрүүл мэнд",
        description: "Эрүүл мэндийн салбарын мэдээ, судалгаа, статистик",
        color: "text-destructive",
        bgColor: "bg-destructive",
        icon: "Heart",
        bannerImage: "/images/infographic-9.jpg"
    },
    {
        slug: "finance",
        name: "Санхүү",
        description: "Санхүү, банк, хөрөнгийн зах зээлийн мэдээлэл",
        color: "text-chart-5",
        bgColor: "bg-chart-5",
        icon: "Wallet",
        bannerImage: "/images/infographic-6.jpg"
    },
    {
        slug: "world",
        name: "Дэлхий",
        description: "Олон улсын мэдээ, геополитик, глобал хандлага",
        color: "text-chart-3",
        bgColor: "bg-chart-3",
        icon: "Globe",
        bannerImage: "/images/infographic-3.jpg"
    }
];
function getPostsByCategory(slug) {
    return posts.filter((post)=>post.categorySlug === slug);
}
function getCategoryBySlug(slug) {
    return categories.find((cat)=>cat.slug === slug);
}
const categoryStats = {
    economy: {
        highlights: [
            {
                label: "ДНБ (2025)",
                value: "21.8 тэрбум $",
                change: "+5.2%",
                changeType: "positive",
                description: "Өмнөх оноос"
            },
            {
                label: "Инфляци",
                value: "8.4%",
                change: "-2.1%",
                changeType: "positive",
                description: "Өмнөх оноос буурсан"
            },
            {
                label: "Төсвийн алдагдал",
                value: "2.8%",
                change: "+0.3%",
                changeType: "negative",
                description: "ДНБ-д эзлэх хувь"
            },
            {
                label: "Гадаад худалдааны тэнцэл",
                value: "+1.2 тэрбум $",
                change: "+15%",
                changeType: "positive",
                description: "Ашигтай тэнцэл"
            },
            {
                label: "Гадаадын хөрөнгө оруулалт",
                value: "2.1 тэрбум $",
                change: "+18%",
                changeType: "positive",
                description: "Өмнөх оноос"
            },
            {
                label: "Ажилгүйдэл",
                value: "6.2%",
                change: "-0.8%",
                changeType: "positive",
                description: "Өмнөх оноос буурсан"
            }
        ],
        charts: [
            {
                title: "ДНБ-ийн өсөлт (жилээр, %)",
                type: "area",
                data: [
                    {
                        name: "2019",
                        value: 5.2
                    },
                    {
                        name: "2020",
                        value: -4.4
                    },
                    {
                        name: "2021",
                        value: 1.6
                    },
                    {
                        name: "2022",
                        value: 5.0
                    },
                    {
                        name: "2023",
                        value: 7.0
                    },
                    {
                        name: "2024",
                        value: 5.8
                    },
                    {
                        name: "2025",
                        value: 5.2
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Инфляцийн түвшин (%)",
                type: "line",
                data: [
                    {
                        name: "2019",
                        value: 7.3
                    },
                    {
                        name: "2020",
                        value: 3.8
                    },
                    {
                        name: "2021",
                        value: 7.4
                    },
                    {
                        name: "2022",
                        value: 15.2
                    },
                    {
                        name: "2023",
                        value: 10.5
                    },
                    {
                        name: "2024",
                        value: 10.5
                    },
                    {
                        name: "2025",
                        value: 8.4
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Төсвийн орлого ба зарлага (тэрбум ₮)",
                type: "bar",
                data: [
                    {
                        name: "2021",
                        value: 11200,
                        value2: 13500
                    },
                    {
                        name: "2022",
                        value: 14800,
                        value2: 16200
                    },
                    {
                        name: "2023",
                        value: 17500,
                        value2: 18900
                    },
                    {
                        name: "2024",
                        value: 19200,
                        value2: 20100
                    },
                    {
                        name: "2025",
                        value: 21000,
                        value2: 21800
                    }
                ],
                dataKey: "value",
                dataKey2: "value2"
            },
            {
                title: "Гадаадын шууд хөрөнгө оруулалт (сая $)",
                type: "bar",
                data: [
                    {
                        name: "2020",
                        value: 1540
                    },
                    {
                        name: "2021",
                        value: 1680
                    },
                    {
                        name: "2022",
                        value: 1820
                    },
                    {
                        name: "2023",
                        value: 1950
                    },
                    {
                        name: "2024",
                        value: 1780
                    },
                    {
                        name: "2025",
                        value: 2100
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    technology: {
        highlights: [
            {
                label: "IT салбарын хувь",
                value: "3.2%",
                change: "+0.4%",
                changeType: "positive",
                description: "ДНБ-д эзлэх хувь"
            },
            {
                label: "Интернэт хэрэглэгч",
                value: "2.8 сая",
                change: "+12%",
                changeType: "positive",
                description: "Нийт хүн амын 82%"
            },
            {
                label: "Стартап тоо",
                value: "450+",
                change: "+25%",
                changeType: "positive",
                description: "Бүртгэлтэй стартап"
            },
            {
                label: "IT ажилтан",
                value: "32,000",
                change: "+18%",
                changeType: "positive",
                description: "Салбарын ажилтан"
            },
            {
                label: "Экспорт",
                value: "85 сая $",
                change: "+22%",
                changeType: "positive",
                description: "IT үйлчилгээний экспорт"
            },
            {
                label: "5G хамрах хүрээ",
                value: "45%",
                change: "+20%",
                changeType: "positive",
                description: "Улаанбаатар хотод"
            }
        ],
        charts: [
            {
                title: "IT салбарын орлого (тэрбум ₮)",
                type: "area",
                data: [
                    {
                        name: "2020",
                        value: 580
                    },
                    {
                        name: "2021",
                        value: 720
                    },
                    {
                        name: "2022",
                        value: 890
                    },
                    {
                        name: "2023",
                        value: 1050
                    },
                    {
                        name: "2024",
                        value: 1280
                    },
                    {
                        name: "2025",
                        value: 1520
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Интернэт хэрэглэгчийн өсөлт (сая)",
                type: "line",
                data: [
                    {
                        name: "2020",
                        value: 2.1
                    },
                    {
                        name: "2021",
                        value: 2.3
                    },
                    {
                        name: "2022",
                        value: 2.5
                    },
                    {
                        name: "2023",
                        value: 2.6
                    },
                    {
                        name: "2024",
                        value: 2.7
                    },
                    {
                        name: "2025",
                        value: 2.8
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Стартап хөрөнгө оруулалт (сая $)",
                type: "bar",
                data: [
                    {
                        name: "2020",
                        value: 8
                    },
                    {
                        name: "2021",
                        value: 15
                    },
                    {
                        name: "2022",
                        value: 22
                    },
                    {
                        name: "2023",
                        value: 35
                    },
                    {
                        name: "2024",
                        value: 42
                    },
                    {
                        name: "2025",
                        value: 58
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    environment: {
        highlights: [
            {
                label: "CO2 ялгарал",
                value: "32.5 сая тн",
                change: "-3%",
                changeType: "positive",
                description: "Жилийн нийт ялгарал"
            },
            {
                label: "Сэргээгдэх эрчим хүч",
                value: "12%",
                change: "+2%",
                changeType: "positive",
                description: "Нийт эрчим хүчний хувь"
            },
            {
                label: "Ойн талбай",
                value: "7.9%",
                change: "-0.2%",
                changeType: "negative",
                description: "Нийт газар нутгийн хувь"
            },
            {
                label: "Агаарын бохирдол (PM2.5)",
                value: "75 µg/m³",
                change: "-8%",
                changeType: "positive",
                description: "Улаанбаатар, өвөл"
            },
            {
                label: "Хамгаалалттай газар",
                value: "21%",
                change: "+1%",
                changeType: "positive",
                description: "Нийт газар нутгийн хувь"
            },
            {
                label: "Нар, салхины станц",
                value: "245 МВт",
                change: "+35%",
                changeType: "positive",
                description: "Нийт суурилагдсан хүчин чадал"
            }
        ],
        charts: [
            {
                title: "CO2 ялгарал (сая тонн)",
                type: "area",
                data: [
                    {
                        name: "2019",
                        value: 35.2
                    },
                    {
                        name: "2020",
                        value: 33.1
                    },
                    {
                        name: "2021",
                        value: 34.5
                    },
                    {
                        name: "2022",
                        value: 34.8
                    },
                    {
                        name: "2023",
                        value: 33.5
                    },
                    {
                        name: "2024",
                        value: 33.2
                    },
                    {
                        name: "2025",
                        value: 32.5
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Сэргээгдэх эрчим хүчний хувь (%)",
                type: "line",
                data: [
                    {
                        name: "2019",
                        value: 5
                    },
                    {
                        name: "2020",
                        value: 6
                    },
                    {
                        name: "2021",
                        value: 7
                    },
                    {
                        name: "2022",
                        value: 8
                    },
                    {
                        name: "2023",
                        value: 10
                    },
                    {
                        name: "2024",
                        value: 11
                    },
                    {
                        name: "2025",
                        value: 12
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Агаарын бохирдол PM2.5 (µg/m³) - УБ",
                type: "bar",
                data: [
                    {
                        name: "2019",
                        value: 120
                    },
                    {
                        name: "2020",
                        value: 95
                    },
                    {
                        name: "2021",
                        value: 88
                    },
                    {
                        name: "2022",
                        value: 85
                    },
                    {
                        name: "2023",
                        value: 82
                    },
                    {
                        name: "2024",
                        value: 78
                    },
                    {
                        name: "2025",
                        value: 75
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    health: {
        highlights: [
            {
                label: "Эрүүл мэндийн зардал",
                value: "4.2%",
                change: "+0.3%",
                changeType: "positive",
                description: "ДНБ-д эзлэх хувь"
            },
            {
                label: "Дундаж наслалт",
                value: "71.5 жил",
                change: "+0.8 жил",
                changeType: "positive",
                description: "Өмнөх оноос"
            },
            {
                label: "Эмч/10,000 хүн",
                value: "38.5",
                change: "+2.1",
                changeType: "positive",
                description: "2024 оны байдлаар"
            },
            {
                label: "Эмнэлгийн ор",
                value: "28,500",
                change: "+5%",
                changeType: "positive",
                description: "Улсын хэмжээнд"
            },
            {
                label: "Вакцинжуулалт",
                value: "95%",
                change: "+2%",
                changeType: "positive",
                description: "Хүүхдийн вакцин"
            },
            {
                label: "Эх нярайн эндэгдэл",
                value: "12.5‰",
                change: "-1.2‰",
                changeType: "positive",
                description: "1000 төрөлтөд"
            }
        ],
        charts: [
            {
                title: "Эрүүл мэндийн зардал (тэрбум ₮)",
                type: "area",
                data: [
                    {
                        name: "2020",
                        value: 1850
                    },
                    {
                        name: "2021",
                        value: 2100
                    },
                    {
                        name: "2022",
                        value: 2450
                    },
                    {
                        name: "2023",
                        value: 2780
                    },
                    {
                        name: "2024",
                        value: 3050
                    },
                    {
                        name: "2025",
                        value: 3400
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Дундаж наслалт (жил)",
                type: "line",
                data: [
                    {
                        name: "2015",
                        value: 69.5
                    },
                    {
                        name: "2017",
                        value: 69.8
                    },
                    {
                        name: "2019",
                        value: 70.2
                    },
                    {
                        name: "2021",
                        value: 70.5
                    },
                    {
                        name: "2023",
                        value: 70.8
                    },
                    {
                        name: "2025",
                        value: 71.5
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Эмч, сувилагчийн тоо",
                type: "bar",
                data: [
                    {
                        name: "2020",
                        value: 11200,
                        value2: 18500
                    },
                    {
                        name: "2021",
                        value: 11800,
                        value2: 19200
                    },
                    {
                        name: "2022",
                        value: 12200,
                        value2: 19800
                    },
                    {
                        name: "2023",
                        value: 12800,
                        value2: 20500
                    },
                    {
                        name: "2024",
                        value: 13200,
                        value2: 21200
                    },
                    {
                        name: "2025",
                        value: 13800,
                        value2: 22000
                    }
                ],
                dataKey: "value",
                dataKey2: "value2"
            }
        ]
    },
    finance: {
        highlights: [
            {
                label: "Банкны нийт актив",
                value: "52.4 их наяд ₮",
                change: "+12%",
                changeType: "positive",
                description: "2025 оны байдлаар"
            },
            {
                label: "Хөрөнгийн биржийн индекс",
                value: "32,450",
                change: "+18%",
                changeType: "positive",
                description: "ТОР-20 индекс"
            },
            {
                label: "Бодлогын хүү",
                value: "11%",
                change: "-2%",
                changeType: "positive",
                description: "Төв банк"
            },
            {
                label: "Гадаад валютын нөөц",
                value: "4.8 тэрбум $",
                change: "+8%",
                changeType: "positive",
                description: "Төв банкны нөөц"
            },
            {
                label: "Зээлийн өсөлт",
                value: "15.2%",
                change: "+3%",
                changeType: "neutral",
                description: "Жилийн өсөлт"
            },
            {
                label: "Даатгалын зах зээл",
                value: "320 тэрбум ₮",
                change: "+22%",
                changeType: "positive",
                description: "Нийт хураамж"
            }
        ],
        charts: [
            {
                title: "ТОР-20 индексийн хөдөлгөөн",
                type: "area",
                data: [
                    {
                        name: "1-р сар",
                        value: 28500
                    },
                    {
                        name: "3-р сар",
                        value: 29200
                    },
                    {
                        name: "5-р сар",
                        value: 30100
                    },
                    {
                        name: "7-р сар",
                        value: 29800
                    },
                    {
                        name: "9-р сар",
                        value: 31200
                    },
                    {
                        name: "11-р сар",
                        value: 32450
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Банкны зээл ба хадгаламж (их наяд ₮)",
                type: "bar",
                data: [
                    {
                        name: "2021",
                        value: 28,
                        value2: 22
                    },
                    {
                        name: "2022",
                        value: 32,
                        value2: 25
                    },
                    {
                        name: "2023",
                        value: 36,
                        value2: 28
                    },
                    {
                        name: "2024",
                        value: 42,
                        value2: 32
                    },
                    {
                        name: "2025",
                        value: 48,
                        value2: 38
                    }
                ],
                dataKey: "value",
                dataKey2: "value2"
            },
            {
                title: "$/₮ ханш",
                type: "line",
                data: [
                    {
                        name: "2020",
                        value: 2850
                    },
                    {
                        name: "2021",
                        value: 2860
                    },
                    {
                        name: "2022",
                        value: 3150
                    },
                    {
                        name: "2023",
                        value: 3450
                    },
                    {
                        name: "2024",
                        value: 3420
                    },
                    {
                        name: "2025",
                        value: 3380
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    world: {
        highlights: [
            {
                label: "Дэлхийн хүн ам",
                value: "8.1 тэрбум",
                change: "+0.9%",
                changeType: "neutral",
                description: "2025 оны байдлаар"
            },
            {
                label: "Дэлхийн ДНБ",
                value: "105 их наяд $",
                change: "+3.2%",
                changeType: "positive",
                description: "2025 оны таамаг"
            },
            {
                label: "Глобал инфляци",
                value: "5.8%",
                change: "-1.5%",
                changeType: "positive",
                description: "Дундаж түвшин"
            },
            {
                label: "Интернэт хэрэглэгч",
                value: "5.5 тэрбум",
                change: "+4%",
                changeType: "positive",
                description: "Дэлхий даяар"
            },
            {
                label: "Сэргээгдэх эрчим хүч",
                value: "30%",
                change: "+3%",
                changeType: "positive",
                description: "Дэлхийн нийт эрчим хүч"
            },
            {
                label: "AI зах зээл",
                value: "185 тэрбум $",
                change: "+38%",
                changeType: "positive",
                description: "Глобал зах зээлийн хэмжээ"
            }
        ],
        charts: [
            {
                title: "Дэлхийн ДНБ өсөлт (%)",
                type: "area",
                data: [
                    {
                        name: "2020",
                        value: -3.1
                    },
                    {
                        name: "2021",
                        value: 6.0
                    },
                    {
                        name: "2022",
                        value: 3.4
                    },
                    {
                        name: "2023",
                        value: 3.0
                    },
                    {
                        name: "2024",
                        value: 3.1
                    },
                    {
                        name: "2025",
                        value: 3.2
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Дэлхийн хүн амын өсөлт (тэрбум)",
                type: "line",
                data: [
                    {
                        name: "2000",
                        value: 6.1
                    },
                    {
                        name: "2005",
                        value: 6.5
                    },
                    {
                        name: "2010",
                        value: 6.9
                    },
                    {
                        name: "2015",
                        value: 7.4
                    },
                    {
                        name: "2020",
                        value: 7.8
                    },
                    {
                        name: "2025",
                        value: 8.1
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Бүс нутгийн ДНБ (их наяд $)",
                type: "bar",
                data: [
                    {
                        name: "Хойд Америк",
                        value: 28
                    },
                    {
                        name: "Европ",
                        value: 22
                    },
                    {
                        name: "Ази",
                        value: 38
                    },
                    {
                        name: "Бусад",
                        value: 17
                    }
                ],
                dataKey: "value"
            }
        ]
    }
};
const topics = [
    {
        slug: "cop29",
        name: "COP29 Уур амьсгалын бага хурал",
        description: "2024 оны НҮБ-ын уур амьсгалын өөрчлөлтийн бага хурал, Азербайжан",
        image: "/images/infographic-2.jpg",
        color: "text-chart-4",
        bgColor: "bg-chart-4",
        startDate: "2024-11-11",
        endDate: "2024-11-22",
        featured: true
    },
    {
        slug: "mongolia-election-2024",
        name: "Монголын Сонгууль 2024",
        description: "УИХ-ын сонгуулийн үр дүн, статистик мэдээлэл",
        image: "/images/infographic-3.jpg",
        color: "text-primary",
        bgColor: "bg-primary",
        startDate: "2024-06-28",
        featured: true
    },
    {
        slug: "ai-revolution",
        name: "AI Хувьсгал",
        description: "Хиймэл оюуны технологийн хөгжил, нөлөө, ирээдүй",
        image: "/images/infographic-7.jpg",
        color: "text-chart-2",
        bgColor: "bg-chart-2",
        featured: true
    },
    {
        slug: "global-economy-2025",
        name: "Дэлхийн эдийн засаг 2025",
        description: "2025 оны дэлхийн эдийн засгийн төлөв байдал, таамаглал",
        image: "/images/infographic-8.jpg",
        color: "text-chart-1",
        bgColor: "bg-chart-1",
        featured: false
    },
    {
        slug: "crypto-market",
        name: "Крипто зах зээл",
        description: "Криптовалют, блокчэйн технологийн мэдээ, шинжилгээ",
        image: "/images/infographic-6.jpg",
        color: "text-chart-5",
        bgColor: "bg-chart-5",
        featured: false
    }
];
function getTopicBySlug(slug) {
    return topics.find((topic)=>topic.slug === slug);
}
function getPostsByTopic(topicSlug) {
    // Map topic slugs to relevant categories/keywords
    const topicCategoryMap = {
        "cop29": [
            "environment",
            "Байгаль орчин"
        ],
        "mongolia-election-2024": [
            "world",
            "Дэлхий"
        ],
        "ai-revolution": [
            "technology",
            "Технологи"
        ],
        "global-economy-2025": [
            "economy",
            "Эдийн засаг"
        ],
        "crypto-market": [
            "finance",
            "Санхүү"
        ]
    };
    const relatedCategories = topicCategoryMap[topicSlug] || [];
    return posts.filter((post)=>relatedCategories.includes(post.categorySlug || "") || relatedCategories.includes(post.category));
}
const topicStats = {
    "cop29": {
        highlights: [
            {
                label: "Оролцогч орон",
                value: "197",
                change: "+2",
                changeType: "positive",
                description: "НҮБ-ын гишүүн орнууд"
            },
            {
                label: "Санхүүжилтийн зорилт",
                value: "100 тэрбум $",
                change: "Жил бүр",
                changeType: "neutral",
                description: "Хөгжиж буй орнуудад"
            },
            {
                label: "Дулааралын зорилт",
                value: "1.5°C",
                description: "Парисын хэлэлцээр"
            },
            {
                label: "CO2 бууралтын зорилт",
                value: "45%",
                change: "2030 он гэхэд",
                changeType: "neutral",
                description: "2010 оноос"
            }
        ],
        charts: [
            {
                title: "Дэлхийн дундаж температурын өөрчлөлт (°C)",
                type: "area",
                data: [
                    {
                        name: "1990",
                        value: 0.45
                    },
                    {
                        name: "2000",
                        value: 0.42
                    },
                    {
                        name: "2010",
                        value: 0.72
                    },
                    {
                        name: "2015",
                        value: 0.90
                    },
                    {
                        name: "2020",
                        value: 1.02
                    },
                    {
                        name: "2024",
                        value: 1.15
                    }
                ],
                dataKey: "value"
            },
            {
                title: "CO2 ялгарал (гигатонн)",
                type: "line",
                data: [
                    {
                        name: "2015",
                        value: 35.5
                    },
                    {
                        name: "2018",
                        value: 36.8
                    },
                    {
                        name: "2020",
                        value: 34.2
                    },
                    {
                        name: "2022",
                        value: 36.8
                    },
                    {
                        name: "2024",
                        value: 37.4
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    "mongolia-election-2024": {
        highlights: [
            {
                label: "Нийт сонгогч",
                value: "2.1 сая",
                description: "Бүртгэлтэй сонгогч"
            },
            {
                label: "Оролцоо",
                value: "73.2%",
                change: "+5%",
                changeType: "positive",
                description: "2020 оноос"
            },
            {
                label: "УИХ-ын гишүүн",
                value: "126",
                description: "Нийт суудал"
            },
            {
                label: "Нам, эвсэл",
                value: "28",
                description: "Оролцсон"
            }
        ],
        charts: [
            {
                title: "Сонгуулийн оролцоо (%) - Түүхээр",
                type: "bar",
                data: [
                    {
                        name: "2008",
                        value: 74.3
                    },
                    {
                        name: "2012",
                        value: 65.2
                    },
                    {
                        name: "2016",
                        value: 72.1
                    },
                    {
                        name: "2020",
                        value: 68.2
                    },
                    {
                        name: "2024",
                        value: 73.2
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    "ai-revolution": {
        highlights: [
            {
                label: "AI зах зээлийн хэмжээ",
                value: "185 тэрбум $",
                change: "+38%",
                changeType: "positive",
                description: "2025 он"
            },
            {
                label: "AI стартап",
                value: "15,000+",
                change: "+25%",
                changeType: "positive",
                description: "Дэлхий даяар"
            },
            {
                label: "AI-д хөрөнгө оруулалт",
                value: "95 тэрбум $",
                change: "+45%",
                changeType: "positive",
                description: "2024 онд"
            },
            {
                label: "ChatGPT хэрэглэгч",
                value: "200 сая+",
                change: "7 хоногт",
                changeType: "positive",
                description: "Идэвхтэй хэрэглэгч"
            }
        ],
        charts: [
            {
                title: "Глобал AI зах зээлийн хэмжээ (тэрбум $)",
                type: "area",
                data: [
                    {
                        name: "2020",
                        value: 50
                    },
                    {
                        name: "2021",
                        value: 65
                    },
                    {
                        name: "2022",
                        value: 87
                    },
                    {
                        name: "2023",
                        value: 120
                    },
                    {
                        name: "2024",
                        value: 155
                    },
                    {
                        name: "2025",
                        value: 185
                    }
                ],
                dataKey: "value"
            },
            {
                title: "AI-д хөрөнгө оруулалт (тэрбум $)",
                type: "bar",
                data: [
                    {
                        name: "2020",
                        value: 36
                    },
                    {
                        name: "2021",
                        value: 52
                    },
                    {
                        name: "2022",
                        value: 68
                    },
                    {
                        name: "2023",
                        value: 75
                    },
                    {
                        name: "2024",
                        value: 95
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    "global-economy-2025": {
        highlights: [
            {
                label: "Дэлхийн ДНБ өсөлт",
                value: "3.2%",
                change: "+0.1%",
                changeType: "positive",
                description: "2025 оны таамаг"
            },
            {
                label: "Глобал инфляци",
                value: "5.8%",
                change: "-1.5%",
                changeType: "positive",
                description: "Дундаж түвшин"
            },
            {
                label: "Худалдааны өсөлт",
                value: "3.5%",
                change: "+1.2%",
                changeType: "positive",
                description: "Дэлхийн худалдаа"
            },
            {
                label: "Ажилгүйдэл",
                value: "5.2%",
                change: "-0.3%",
                changeType: "positive",
                description: "Дэлхийн дундаж"
            }
        ],
        charts: [
            {
                title: "Дэлхийн ДНБ өсөлт (%)",
                type: "area",
                data: [
                    {
                        name: "2020",
                        value: -3.1
                    },
                    {
                        name: "2021",
                        value: 6.0
                    },
                    {
                        name: "2022",
                        value: 3.4
                    },
                    {
                        name: "2023",
                        value: 3.0
                    },
                    {
                        name: "2024",
                        value: 3.1
                    },
                    {
                        name: "2025",
                        value: 3.2
                    }
                ],
                dataKey: "value"
            }
        ]
    },
    "crypto-market": {
        highlights: [
            {
                label: "Bitcoin үнэ",
                value: "$67,500",
                change: "+120%",
                changeType: "positive",
                description: "Жилийн өсөлт"
            },
            {
                label: "Нийт зах зээл",
                value: "2.8 их наяд $",
                change: "+85%",
                changeType: "positive",
                description: "Крипто зах зээл"
            },
            {
                label: "Ethereum үнэ",
                value: "$3,400",
                change: "+65%",
                changeType: "positive",
                description: "Жилийн өсөлт"
            },
            {
                label: "Идэвхтэй хэтэвч",
                value: "420 сая",
                change: "+35%",
                changeType: "positive",
                description: "Дэлхий даяар"
            }
        ],
        charts: [
            {
                title: "Bitcoin үнэ ($)",
                type: "line",
                data: [
                    {
                        name: "2020",
                        value: 29000
                    },
                    {
                        name: "2021",
                        value: 47000
                    },
                    {
                        name: "2022",
                        value: 16500
                    },
                    {
                        name: "2023",
                        value: 42000
                    },
                    {
                        name: "2024",
                        value: 67500
                    }
                ],
                dataKey: "value"
            },
            {
                title: "Крипто зах зээлийн хэмжээ (их наяд $)",
                type: "area",
                data: [
                    {
                        name: "2020",
                        value: 0.76
                    },
                    {
                        name: "2021",
                        value: 2.2
                    },
                    {
                        name: "2022",
                        value: 0.85
                    },
                    {
                        name: "2023",
                        value: 1.5
                    },
                    {
                        name: "2024",
                        value: 2.8
                    }
                ],
                dataKey: "value"
            }
        ]
    }
};
}),
"[project]/app/admin/posts/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPostsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const statusOptions = [
    {
        value: "all",
        label: "Бүгд"
    },
    {
        value: "published",
        label: "Нийтэлсэн"
    },
    {
        value: "draft",
        label: "Ноорог"
    },
    {
        value: "review",
        label: "Хянагдаж буй"
    }
];
const categoryOptions = [
    {
        value: "all",
        label: "Бүх ангилал"
    },
    {
        value: "economy",
        label: "Эдийн засаг"
    },
    {
        value: "technology",
        label: "Технологи"
    },
    {
        value: "environment",
        label: "Байгаль орчин"
    },
    {
        value: "health",
        label: "Эрүүл мэнд"
    },
    {
        value: "finance",
        label: "Санхүү"
    },
    {
        value: "world",
        label: "Дэлхий"
    }
];
// Mock extended post data for admin
const adminPosts = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["posts"].map((post, index)=>({
        ...post,
        status: index % 3 === 0 ? "published" : index % 3 === 1 ? "draft" : "review",
        createdAt: "2025-02-15",
        updatedAt: "2025-02-20"
    }));
const statusColors = {
    published: "bg-chart-4/10 text-chart-4",
    draft: "bg-muted text-muted-foreground",
    review: "bg-chart-5/10 text-chart-5"
};
const statusLabels = {
    published: "Нийтэлсэн",
    draft: "Ноорог",
    review: "Хянагдаж буй"
};
function AdminPostsPage() {
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [categoryFilter, setCategoryFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedPosts, setSelectedPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const filteredPosts = adminPosts.filter((post)=>{
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || post.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || post.categorySlug === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });
    const toggleSelectAll = ()=>{
        if (selectedPosts.length === filteredPosts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(filteredPosts.map((p)=>p.id));
        }
    };
    const toggleSelectPost = (id)=>{
        if (selectedPosts.includes(id)) {
            setSelectedPosts(selectedPosts.filter((p)=>p !== id));
        } else {
            setSelectedPosts([
                ...selectedPosts,
                id
            ]);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-16 items-center justify-between px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl font-bold text-foreground",
                                    children: "Мэдээ"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/posts/page.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: [
                                        "Нийт ",
                                        adminPosts.length,
                                        " мэдээ"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/posts/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/posts/page.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin/posts/new",
                            className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/posts/page.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                "Шинэ мэдээ"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/posts/page.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/posts/page.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/posts/page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-1 items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex-1 max-w-md",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 121,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Мэдээ хайх...",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                className: "h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 122,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowFilters(!showFilters),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors", showFilters ? "border-primary bg-primary/5 text-primary" : "border-input bg-background text-foreground hover:bg-secondary"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 139,
                                                columnNumber: 15
                                            }, this),
                                            "Шүүлтүүр"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/posts/page.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            selectedPosts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: [
                                            selectedPosts.length,
                                            " сонгогдсон"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "flex h-9 items-center gap-2 rounded-lg bg-destructive/10 px-3 text-sm font-medium text-destructive hover:bg-destructive/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this),
                                            "Устгах"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/posts/page.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/posts/page.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1.5 block text-xs font-medium text-muted-foreground",
                                        children: "Төлөв"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: statusFilter,
                                        onChange: (e)=>setStatusFilter(e.target.value),
                                        className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none",
                                        children: statusOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: option.value,
                                                children: option.label
                                            }, option.value, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 164,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/posts/page.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1.5 block text-xs font-medium text-muted-foreground",
                                        children: "Ангилал"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: categoryFilter,
                                        onChange: (e)=>setCategoryFilter(e.target.value),
                                        className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none",
                                        children: categoryOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: option.value,
                                                children: option.label
                                            }, option.value, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 186,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/posts/page.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setStatusFilter("all");
                                    setCategoryFilter("all");
                                },
                                className: "mt-auto text-sm text-muted-foreground hover:text-foreground",
                                children: "Цэвэрлэх"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/posts/page.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/posts/page.tsx",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-border bg-card overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-b border-border bg-secondary/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "w-12 p-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectedPosts.length === filteredPosts.length && filteredPosts.length > 0,
                                                            onChange: toggleSelectAll,
                                                            className: "h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                                        children: "Мэдээ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                                        children: "Ангилал"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                                        children: "Зохиогч"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                                        children: "Төлөв"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                                        children: "Үзэлт"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                                        children: "Огноо"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "w-12 p-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 209,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/posts/page.tsx",
                                            lineNumber: 208,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "divide-y divide-border",
                                            children: filteredPosts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("transition-colors hover:bg-secondary/30", selectedPosts.includes(post.id) && "bg-primary/5"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedPosts.includes(post.id),
                                                                onChange: ()=>toggleSelectPost(post.id),
                                                                className: "h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 248,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            src: post.image,
                                                                            alt: post.title,
                                                                            fill: true,
                                                                            className: "object-cover"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                        lineNumber: 258,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                href: `/admin/posts/${post.id}`,
                                                                                className: "block font-medium text-foreground hover:text-primary line-clamp-1",
                                                                                children: post.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                                lineNumber: 267,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "mt-0.5 text-xs text-muted-foreground line-clamp-1",
                                                                                children: post.excerpt
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                                lineNumber: 273,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                        lineNumber: 266,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 257,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-foreground",
                                                                children: post.category
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 280,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 279,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-7 w-7 overflow-hidden rounded-full",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            src: post.authorAvatar,
                                                                            alt: post.author,
                                                                            width: 28,
                                                                            height: 28,
                                                                            className: "h-full w-full object-cover"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                                            lineNumber: 287,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                        lineNumber: 286,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm text-foreground",
                                                                        children: post.author
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                        lineNumber: 295,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 285,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusColors[post.status]),
                                                                children: statusLabels[post.status]
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 301,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: post.views
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 311,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: post.date
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 315,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                                            className: "h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                                            lineNumber: 323,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                        lineNumber: 322,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute right-0 top-full z-10 mt-1 hidden w-40 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:block",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                className: "flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                                        className: "h-4 w-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                                        lineNumber: 327,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    "Засах"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                                lineNumber: 326,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                className: "flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                        className: "h-4 w-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                                        lineNumber: 331,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    "Харах"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                                lineNumber: 330,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                className: "flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                                        className: "h-4 w-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                                        lineNumber: 335,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    "Хуулах"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                                lineNumber: 334,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "my-1 h-px bg-border"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                                lineNumber: 338,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                className: "flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                        className: "h-4 w-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                                        lineNumber: 340,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    "Устгах"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                                lineNumber: 339,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/admin/posts/page.tsx",
                                                                        lineNumber: 325,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/posts/page.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, post.id, true, {
                                                    fileName: "[project]/app/admin/posts/page.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/posts/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/posts/page.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/posts/page.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between border-t border-border px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: [
                                            "1-",
                                            filteredPosts.length,
                                            " / ",
                                            adminPosts.length,
                                            " мэдээ"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 354,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: true,
                                                className: "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/posts/page.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 358,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground",
                                                children: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-secondary",
                                                children: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 367,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-secondary",
                                                children: "3"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 370,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/posts/page.tsx",
                                                    lineNumber: 374,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/posts/page.tsx",
                                                lineNumber: 373,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/posts/page.tsx",
                                        lineNumber: 357,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/posts/page.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/posts/page.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/posts/page.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/posts/page.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_6df0dba1._.js.map