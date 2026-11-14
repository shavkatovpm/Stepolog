// O'zbekcha imkoniyat sahifalari (SEO + GEO).
// Har bir sahifa bitta qidiruv ehtiyojiga javob beradi.
// Narx va raqamlar bosh sahifadagi bilan bir xil bo'lishi shart.

export type LandingPost = { title: string; body: string; why: string; source: string; time: string; views: string };

export type Landing = {
  slug: string;
  status: "open" | "soon";
  nav: string; // havolalar va breadcrumb uchun qisqa nom
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  lead: string;
  answer: string; // GEO: AI iqtibos qiladigan qisqa javob
  featuresTitle: string;
  features: { title: string; text: string }[];
  stepsTitle: string;
  steps: { title: string; text: string }[];
  postTitle: string;
  post: LandingPost;
  audienceTitle: string;
  audience: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  related: string[];
  cta: string;
  app?: boolean; // SoftwareApplication schema
};

const marketingPost: LandingPost = {
  title: "Google Ads'da Performance Max uchun kanal hisobotlari ochildi",
  body: "Endi reklama Qidiruv, YouTube va Discover'da qanday ishlayotganini alohida ko'rish mumkin. Oldin bu ma'lumot yopiq edi.",
  why: "Byudjetning qaysi qismi samarasiz ketayotganini endi aniq ko'rasiz.",
  source: "Google Ads Blog",
  time: "08:15",
  views: "1,4K",
};

export const landings: Landing[] = [
  {
    slug: "telegram-yangiliklar-boti",
    status: "open",
    nav: "Telegram yangiliklar boti",
    keyword: "telegram yangiliklar boti",
    metaTitle: "Telegram yangiliklar boti o'zbek tilida | Stepolog",
    metaDescription:
      "Stepolog boti siz tanlagan soha bo'yicha muhim yangiliklarni saralab, o'zbek tilida qisqa post qilib Telegram'ga yuboradi. Bepul boshlash mumkin.",
    kicker: "Telegram bot",
    h1: "Sohangiz yangiliklarini o'zbek tilida yuboradigan Telegram bot",
    lead: "Stepolog yuzlab xorijiy saytlarni kuzatadi, takroriy va reklama materiallarini chiqarib tashlaydi, qolganini qisqa o'zbekcha postga aylantiradi. Sizga faqat o'qish qoladi.",
    answer:
      "Stepolog (@stepologbot) siz tanlagan soha bo'yicha xorijiy saytlardagi muhim yangiliklarni avtomatik saralab, o'zbek tilida qisqa post qilib Telegram'ga yuboradigan bot. Bepul botda kuniga eng muhim 1-2 yangilik kechki dayjestda keladi. Hozir Marketing yo'nalishi ishlaydi, boshqa sohalar navbatda.",
    featuresTitle: "Bot nimalar qila oladi",
    features: [
      { title: "Yangiliklarni saralaydi", text: "Kuniga yuzlab material ko'rib chiqiladi. Takroriy, reklama va shov-shuv maqsadidagilari tushib qoladi, sizga ishingizga ta'sir qiladiganlari yetib keladi." },
      { title: "O'zbek tilida yozadi", text: "Ingliz va rus tilidagi maqolalar so'zma-so'z tarjima qilinmaydi, mazmuni o'zbekcha qayta yoziladi. Atamalar tushuntiriladi." },
      { title: "30 soniyada o'qiladi", text: "Har bir post uch qismdan iborat: nima bo'ldi, bu siz uchun nima degani va asl manba havolasi." },
      { title: "Kechki dayjest yuboradi", text: "Bepul botda kun davomidagi eng muhim 1-2 yangilik kechqurun bitta xabarda keladi. Kun bo'yi bildirishnoma bezovta qilmaydi." },
      { title: "O'zingiz kuzatadigan saytni qo'shadi", text: "Kerakli sayt ro'yxatda bo'lmasa, havolasini botga yuborasiz. Undagi yangi maqolalar ham sizga keladi." },
      { title: "Muharrir tekshiradi", text: "Postlarni sun'iy intellekt tayyorlaydi, kanalga chiqishdan oldin muharrir har birini ko'rib chiqadi." },
    ],
    stepsTitle: "Botni qanday ishga tushirish mumkin",
    steps: [
      { title: "Botni oching", text: "Telegram'da @stepologbot ni oching va Start tugmasini bosing. Ro'yxatdan o'tish shart emas." },
      { title: "Sohani tanlang", text: "Qaysi yo'nalish yangiliklari kerakligini belgilang. Hozir Marketing ochiq." },
      { title: "O'qing", text: "Har kuni kechqurun eng muhim yangiliklar bitta dayjestda keladi." },
    ],
    postTitle: "Botdan keladigan post shunday ko'rinadi",
    post: marketingPost,
    audienceTitle: "Bot kimlar uchun",
    audience: [
      { title: "Marketolog va SMM mutaxassislari", text: "Reklama platformalari va ijtimoiy tarmoqlardagi o'zgarishlarni birinchilardan bilish uchun." },
      { title: "Biznes egalari", text: "Sohadagi muhim o'zgarishlarni ko'p vaqt sarflamasdan kuzatib borish uchun." },
      { title: "Ingliz tilini yaxshi bilmaydiganlar", text: "Xorijiy manbalardagi yangiliklarni o'z tilida, tushunarli qilib o'qish uchun." },
      { title: "Jamoa rahbarlari", text: "Jamoaga ulashsa bo'ladigan, manbasi ko'rsatilgan qisqa yangiliklar uchun." },
    ],
    faq: [
      { q: "Telegram yangiliklar boti bepulmi?", a: "Ha. Bot bepul: kuniga eng muhim 1-2 yangilik kechki dayjestda keladi. Barcha yangiliklarni chiqishi bilan olish uchun soha kanaliga obuna bo'lish mumkin, narxi oyiga 49 000 so'm." },
      { q: "Bot qaysi sohalar bo'yicha yangilik yuboradi?", a: "Hozir Marketing yo'nalishi ishlaydi. Sun'iy intellekt, dasturlash, SMM, dizayn va biznes navbatda turibdi. Qaysi biri ko'proq so'ralsa, o'sha birinchi ochiladi." },
      { q: "Oddiy RSS botdan farqi nima?", a: "RSS bot saytdagi hamma narsani asl tilida, saralamasdan yuboradi. Stepolog avval muhimini ajratadi, keyin uni o'zbek tilida qisqa qilib yozadi va bu yangilik ishingiz uchun nima degani ekanini qo'shadi." },
      { q: "Yangiliklar qayerdan olinadi?", a: "Har bir soha bo'yicha rasmiy bloglar va yirik nashrlardan. Har bir post ostida manba havolasi turadi." },
      { q: "Botni qanday to'xtatish mumkin?", a: "Botni istalgan vaqtda Telegram'da to'xtatish yoki o'chirib qo'yish mumkin. Bepul botda hech qanday to'lov yo'q." },
    ],
    related: ["sayt-yangiliklarini-telegramga-yuborish", "xorijiy-yangiliklar-ozbek-tilida", "marketing-yangiliklari"],
    cta: "Botni ochish",
    app: true,
  },
  {
    slug: "sayt-yangiliklarini-telegramga-yuborish",
    status: "open",
    nav: "Sayt yangiliklarini Telegram'ga yuborish",
    keyword: "sayt yangiliklarini telegramga yuborish",
    metaTitle: "Sayt yangiliklarini Telegram'ga yuborish | Stepolog",
    metaDescription:
      "Kuzatadigan saytingiz havolasini botga yuboring: unda chiqqan yangi maqolalar o'zbek tilida qisqa xabar bo'lib Telegram'ga keladi. Saytda RSS bo'lishi shart emas.",
    kicker: "Sayt kuzatish",
    h1: "Istalgan sayt yangiliklarini Telegram'ga oling",
    lead: "Saytga har kuni kirib tekshirish shart emas. Havolani botga yuborasiz, yangi maqola chiqqanda Stepolog uni o'qib, qisqa o'zbekcha xabar qilib yuboradi.",
    answer:
      "Saytdagi yangiliklarni Telegram'ga olish uchun Stepolog botiga (@stepologbot) sayt havolasini yuborish kifoya. Bot saytni muntazam tekshiradi va yangi maqola chiqqanda uning mazmunini o'zbek tilida qisqa qilib yuboradi. Saytda RSS lentasi bo'lishi shart emas.",
    featuresTitle: "Sayt kuzatish imkoniyatlari",
    features: [
      { title: "RSS bo'lmasa ham ishlaydi", text: "Yangi maqola saytning RSS lentasi, sitemap fayli yoki sahifadagi o'zgarishlar orqali topiladi." },
      { title: "Faqat yangi maqolalar", text: "Bir marta yuborilgan material qayta kelmaydi. Eski sahifalardagi kichik tahrirlar yangilik hisoblanmaydi." },
      { title: "Qisqa mazmun", text: "Uzun maqolaning to'liq matni o'rniga 2-3 gapli mazmun va asl havola keladi." },
      { title: "Istalgan tildagi saytlar", text: "Ingliz, rus yoki boshqa tildagi saytlarning yangiliklari o'zbekcha mazmun bilan keladi." },
      { title: "Bir nechta sayt bir joyda", text: "Bir necha saytni qo'shib, ularning hammasini bitta Telegram chatida kuzatasiz." },
      { title: "Mavzu bo'yicha filtr", text: "Saytda turli mavzular bo'lsa, faqat sizni qiziqtirgan yo'nalishdagi maqolalarni olish mumkin." },
    ],
    stepsTitle: "Saytni ulash uch qadamda",
    steps: [
      { title: "Saytni tanlang", text: "Kuzatmoqchi bo'lgan blog, yangiliklar sahifasi yoki raqobatchi sayti." },
      { title: "Havolani yuboring", text: "@stepologbot ga sayt havolasini yuboring. Bot uni tekshirib, kuzatishni boshlaydi." },
      { title: "Yangiliklarni oling", text: "Saytda yangi maqola chiqqanda qisqa o'zbekcha xabar keladi." },
    ],
    postTitle: "Saytdan kelgan xabar namunasi",
    post: marketingPost,
    audienceTitle: "Bu imkoniyat kimga kerak",
    audience: [
      { title: "Raqobatchilarni kuzatadiganlar", text: "Raqobatchi saytidagi yangi mahsulot, narx yoki aksiya haqida birinchilardan bilish uchun." },
      { title: "Rasmiy e'lonlarni kutadiganlar", text: "Soha portallari, platformalarning yangiliklar sahifasi va rasmiy bloglarni kuzatish uchun." },
      { title: "Kontent menejerlar", text: "Kanal yoki blog uchun mavzu topishda manbalarni bitta joyda yig'ish uchun." },
      { title: "Sevimli blogini o'tkazib yubormaslik istaganlar", text: "Har kuni tekshirmasdan, yangi maqola chiqqanda xabar olish uchun." },
    ],
    faq: [
      { q: "Saytda RSS bo'lmasa ham yangiliklarni Telegram'ga olsa bo'ladimi?", a: "Ha. Stepolog yangi maqolani RSS lentasi, sitemap fayli yoki sahifadagi o'zgarishlar orqali topadi. Sizdan faqat sayt havolasi kerak." },
      { q: "RSS botdan nimasi bilan farq qiladi?", a: "RSS bot maqolani asl tilida va to'liq yuboradi. Stepolog mazmunini o'zbek tilida 2-3 gapga qisqartiradi va asl havolani qoldiradi." },
      { q: "Nechta sayt qo'shish mumkin?", a: "Bepul botda qo'shiladigan saytlar soni cheklangan. Ko'proq sayt kuzatish pullik tarifda bo'ladi." },
      { q: "Login talab qiladigan saytlar ishlaydimi?", a: "Yo'q. Faqat hamma uchun ochiq sahifalarni kuzatish mumkin." },
      { q: "Yangi maqola qanchalik tez keladi?", a: "Bot qo'shilgan saytlarni kun davomida muntazam tekshiradi. Yangi maqola chiqqanidan ko'p o'tmay xabar keladi." },
    ],
    related: ["telegram-yangiliklar-boti", "xorijiy-yangiliklar-ozbek-tilida", "telegram-kanalga-avtopost"],
    cta: "Sayt qo'shish",
  },
  {
    slug: "xorijiy-yangiliklar-ozbek-tilida",
    status: "open",
    nav: "Xorijiy yangiliklar o'zbek tilida",
    keyword: "xorijiy yangiliklarni tarjima qiladigan bot",
    metaTitle: "Xorijiy yangiliklar o'zbek tilida, Telegram botda | Stepolog",
    metaDescription:
      "Ingliz va rus tilidagi soha yangiliklarini so'zma-so'z tarjima emas, tushunarli o'zbekcha qisqa post qilib yuboramiz. Har postda asl manba havolasi bor.",
    kicker: "Tarjima va qisqartirish",
    h1: "Ingliz va rus tilidagi yangiliklar, o'zbek tilida va qisqa",
    lead: "Sohangizdagi eng tezkor yangiliklar ko'pincha ingliz tilida chiqadi. Stepolog ularni so'zma-so'z tarjima qilmaydi, mazmunini tushunarli o'zbek tilida qayta yozadi.",
    answer:
      "Stepolog ingliz va rus tilidagi xorijiy yangiliklarni o'zbek tiliga moslab qayta yozadigan Telegram bot. Har bir post 2-3 gapli mazmun, yangilikning ishingiz uchun ahamiyati va asl manba havolasidan iborat. Ingliz tilini bilmasangiz ham sohangizdagi o'zgarishlardan o'z vaqtida xabardor bo'lasiz.",
    featuresTitle: "Oddiy tarjimadan farqi",
    features: [
      { title: "Tarjima emas, qayta yozish", text: "Matn o'zbek tilida tabiiy o'qiladigan qilib yoziladi. Ingliz tilidagi gap tuzilishi ko'chirilmaydi." },
      { title: "Atamalar tushuntiriladi", text: "CTR, CPC kabi atamalar birinchi uchraganda oddiy so'z bilan izohlanadi." },
      { title: "Bo'rttirishlarsiz", text: "Sarlavhadagi shov-shuvli so'zlar olib tashlanadi, faqat fakt qoladi." },
      { title: "O'zbek bozoriga moslab", text: "Yangilik O'zbekistondagi ishingizga qanday ta'sir qilishi alohida yoziladi." },
      { title: "Asl manba doim yonida", text: "Tekshirmoqchi yoki to'liq o'qimoqchi bo'lsangiz, havola post ostida turadi." },
      { title: "Inson tekshiruvi", text: "Matnni sun'iy intellekt tayyorlaydi, muharrir ma'no to'g'ri berilganini tekshiradi." },
    ],
    stepsTitle: "Inglizcha maqoladan o'zbekcha postgacha",
    steps: [
      { title: "Asl maqola o'qiladi", text: "Xorijiy saytdagi to'liq matn olinadi, o'rtacha 1 500-2 000 so'z." },
      { title: "Mohiyati ajratiladi", text: "Asosiy fakt, uning ahamiyati va amaliy xulosa topiladi." },
      { title: "O'zbekcha yoziladi", text: "Natija o'rtacha 60-80 so'zli, 30 soniyada o'qiladigan post." },
    ],
    postTitle: "Inglizcha maqoladan tayyorlangan post",
    post: marketingPost,
    audienceTitle: "Kimlarga qulay",
    audience: [
      { title: "Ingliz tilini o'rganayotgan mutaxassislar", text: "Til to'sig'i sabab muhim yangilikni kech bilmaslik uchun." },
      { title: "Vaqti tig'iz rahbarlar", text: "Uzun maqola o'qimasdan, mohiyatini bir daqiqada bilish uchun." },
      { title: "Talabalar va yangi boshlovchilar", text: "Sohadagi jarayonlarni o'z tilida, tushuntirish bilan kuzatish uchun." },
      { title: "Jamoasiga yangilik ulashadigan menejerlar", text: "Jamoaga o'zbekcha, manbasi bilan tayyor xabar yuborish uchun." },
    ],
    faq: [
      { q: "Bu oddiy mashina tarjimasimi?", a: "Yo'q. Matn so'zma-so'z tarjima qilinmaydi, mazmuni o'zbek tilida qisqa va tushunarli qilib qayta yoziladi. Har bir postni muharrir tekshiradi." },
      { q: "Qaysi tillardagi manbalar kuzatiladi?", a: "Asosan ingliz va rus tilidagi rasmiy bloglar va soha nashrlari." },
      { q: "Postlar qaysi alifboda?", a: "Postlar o'zbek tilida, lotin alifbosida yoziladi." },
      { q: "Ma'noda xato bo'lsa nima qilaman?", a: "Har bir post ostida asl manba havolasi bor, solishtirib ko'rishingiz mumkin. Xato topsangiz, botga yozing, tuzatamiz." },
      { q: "Ingliz tilini bilmasam ham foydalanaveramanmi?", a: "Ha. Postlar to'liq o'zbek tilida, atamalar ham tushuntiriladi." },
    ],
    related: ["telegram-yangiliklar-boti", "marketing-yangiliklari", "suniy-intellekt-yangiliklari"],
    cta: "Botni ochish",
  },
  {
    slug: "marketing-yangiliklari",
    status: "open",
    nav: "Marketing yangiliklari",
    keyword: "marketing yangiliklari bot",
    metaTitle: "Marketing yangiliklari o'zbek tilida, Telegram kanal | Stepolog",
    metaDescription:
      "Google Ads, Meta, TikTok, Instagram va qidiruv tizimlaridagi o'zgarishlar o'zbek tilida, izoh bilan. Bepul botda kunlik dayjest, kanalda barcha yangiliklar.",
    kicker: "Marketing kanali · ochiq",
    h1: "Marketing yangiliklari o'zbek tilida, har kuni Telegram'da",
    lead: "Reklama platformalari, ijtimoiy tarmoqlar va qidiruv tizimlaridagi o'zgarishlarni biz kuzatamiz. Sizga ishingizga ta'sir qiladiganlari o'zbekcha va izoh bilan keladi.",
    answer:
      "Stepolog Marketing kanali Google Ads, Meta, TikTok, Instagram va qidiruv tizimlaridagi muhim o'zgarishlarni o'zbek tilida, kuniga o'rtacha 6 ta qisqa post qilib yetkazadi. Obuna oyiga 49 000 so'm. Bepul botda esa eng muhim 1-2 yangilik kechki dayjestda keladi.",
    featuresTitle: "Kanalda qaysi mavzular bor",
    features: [
      { title: "Reklama platformalari", text: "Google Ads, Meta Ads, TikTok Ads va Telegram Ads'dagi yangi formatlar, qoidalar va hisobotlar." },
      { title: "Ijtimoiy tarmoq algoritmlari", text: "Instagram, TikTok va YouTube tavsiya tizimlaridagi o'zgarishlar va ular qamrovga qanday ta'sir qilishi." },
      { title: "Qidiruv va AI javoblari", text: "Google qidiruvi, SEO va ChatGPT kabi AI javoblarida brend ko'rinishiga oid yangiliklar." },
      { title: "Kontent va formatlar", text: "Qaysi formatlar yaxshi ishlayapti, platformalar qaysi kontentga ustunlik beryapti." },
      { title: "Analitika va o'lchov", text: "Hisobotlar, atributsiya va o'lchov vositalaridagi o'zgarishlar." },
      { title: "Haftalik xulosa", text: "Har dushanba o'tgan haftaning eng muhim o'zgarishlari bitta postda." },
    ],
    stepsTitle: "Qanday obuna bo'linadi",
    steps: [
      { title: "Bepul boshlang", text: "@stepologbot ni ochib, Marketing yo'nalishini tanlang. Kechki dayjest bepul keladi." },
      { title: "Muddatni tanlang", text: "Kanal uchun 1, 3, 6 oy yoki 1 yil. Uzoq muddatda 15% gacha arzon." },
      { title: "Kanalga qo'shiling", text: "To'lov tasdiqlangach, bot kanalga kirish havolasini yuboradi." },
    ],
    postTitle: "Marketing kanalidagi post namunasi",
    post: marketingPost,
    audienceTitle: "Kanal kimlar uchun",
    audience: [
      { title: "Marketologlar", text: "Strategiyaga ta'sir qiladigan o'zgarishlarni o'z vaqtida bilish uchun." },
      { title: "SMM mutaxassislari", text: "Algoritm va format o'zgarishlariga birinchilardan moslashish uchun." },
      { title: "Targetologlar", text: "Reklama kabinetlaridagi yangi sozlama va qoidalarni kuzatish uchun." },
      { title: "Agentlik va biznes egalari", text: "Jamoa va mijozlar oldida sohadagi o'zgarishlardan xabardor bo'lish uchun." },
    ],
    faq: [
      { q: "Marketing yangiliklarini o'zbek tilida qayerdan kuzatish mumkin?", a: "Stepolog Marketing kanalida. Google Ads, Meta, TikTok, Instagram va qidiruv tizimlaridagi muhim o'zgarishlar o'zbek tilida, manbasi va izohi bilan chiqadi." },
      { q: "Kanalda kuniga nechta post chiqadi?", a: "O'rtacha 6 ta. Faqat ishingizga ta'sir qiladigan yangiliklar chiqadi, shuning uchun son kundan kunga farq qilishi mumkin." },
      { q: "Obuna narxi qancha?", a: "Oyiga 49 000 so'm. 3 oyga olsangiz 5%, 6 oyga 10%, 1 yilga 15% arzon. Pul avtomatik yechilmaydi." },
      { q: "Instagram yoki Google Ads'da o'zgarish bo'lsa, qachon bilaman?", a: "Kanalda yangilik manbada chiqqanidan keyin tez orada joylanadi. Bepul botda esa shu kunning kechki dayjestida keladi." },
      { q: "Bepul variant bormi?", a: "Ha. @stepologbot bepul: har kuni kechqurun eng muhim 1-2 marketing yangiligi keladi." },
    ],
    related: ["telegram-yangiliklar-boti", "xorijiy-yangiliklar-ozbek-tilida", "suniy-intellekt-yangiliklari"],
    cta: "Kanalga obuna bo'lish",
  },
  {
    slug: "suniy-intellekt-yangiliklari",
    status: "soon",
    nav: "Sun'iy intellekt yangiliklari",
    keyword: "sun'iy intellekt yangiliklari telegram bot",
    metaTitle: "Sun'iy intellekt yangiliklari o'zbek tilida | Stepolog",
    metaDescription:
      "ChatGPT, Gemini va boshqa AI vositalaridagi amaliy yangiliklar o'zbek tilida, qisqa va izoh bilan. Kanal tez orada ochiladi, navbatga yoziling.",
    kicker: "Sun'iy intellekt kanali · tez orada",
    h1: "Sun'iy intellekt yangiliklari o'zbek tilida",
    lead: "AI vositalari har hafta yangilanadi. Ishingizda haqiqatan foydalanish mumkin bo'lganlarini ajratib, o'zbekcha va qisqa qilib yetkazamiz.",
    answer:
      "Stepolog Sun'iy intellekt kanali ChatGPT, Gemini va boshqa AI vositalaridagi amaliy yangiliklarni o'zbek tilida qisqa post qilib yetkazadi. Kanal hali ochilmagan. Navbatga yozilish uchun @stepologbot da Sun'iy intellekt yo'nalishini belgilang, kanal ochilganda birinchilardan xabar olasiz.",
    featuresTitle: "Kanalda nimalar bo'ladi",
    features: [
      { title: "Yangi vositalar va funksiyalar", text: "Mashhur AI xizmatlaridagi yangi imkoniyatlar va ular nimaga yarashi." },
      { title: "Amaliy qo'llash", text: "Har bir yangilik ostida undan ishda qanday foydalanish mumkinligi." },
      { title: "Narx va cheklovlar", text: "Tariflar, limitlar va mintaqaviy cheklovlardagi o'zgarishlar." },
      { title: "Biznesga ta'siri", text: "AI javoblarida brend ko'rinishi kabi marketing va biznesga tegishli yangiliklar." },
      { title: "Shov-shuvsiz", text: "Har kuni chiqadigan baland e'lonlardan faqat haqiqiy o'zgarishlar qoladi." },
      { title: "Texnik bilimsiz tushunarli", text: "Murakkab atamalar oddiy so'z bilan tushuntiriladi." },
    ],
    stepsTitle: "Navbatga qanday yoziladi",
    steps: [
      { title: "Botni oching", text: "Telegram'da @stepologbot ni oching." },
      { title: "Yo'nalishni belgilang", text: "Sun'iy intellekt yo'nalishini tanlang." },
      { title: "Xabarni kuting", text: "Kanal ochilganda bot sizga birinchilardan xabar beradi." },
    ],
    postTitle: "Kanaldagi post qanday bo'ladi",
    post: {
      title: "ChatGPT'da kompaniyalar o'z biznes profilini qo'sha oladigan bo'ldi",
      body: "Bizneslar endi nomi, xizmatlari va aloqa ma'lumotlarini to'g'ridan-to'g'ri ChatGPT'ga taqdim eta oladi.",
      why: "Brendingiz AI javoblarida to'g'ri ko'rinishi uchun profilni hozirdan to'ldiring.",
      source: "OpenAI Blog",
      time: "10:40",
      views: "namuna",
    },
    audienceTitle: "Kanal kimlarga foydali bo'ladi",
    audience: [
      { title: "Mutaxassislar", text: "AI vositalarini ishida qo'llab, vaqt tejamoqchi bo'lganlar." },
      { title: "Biznes egalari", text: "AI biznesiga qanday ta'sir qilishini kuzatib borish uchun." },
      { title: "Marketologlar", text: "AI qidiruv va kontent vositalaridagi o'zgarishlar uchun." },
      { title: "Talabalar", text: "Sohani o'z tilida, tushuntirish bilan o'rganish uchun." },
    ],
    faq: [
      { q: "Sun'iy intellekt kanali qachon ochiladi?", a: "Qaysi soha ko'proq so'ralsa, o'sha birinchi ochiladi. Botda Sun'iy intellekt yo'nalishini belgilasangiz, ochilganda birinchilardan xabar olasiz." },
      { q: "Qaysi AI vositalari haqida yoziladi?", a: "Keng qo'llaniladigan chat-yordamchilar, rasm va video yaratuvchi vositalar hamda biznes uchun AI xizmatlari haqida." },
      { q: "Texnik bilim kerakmi?", a: "Yo'q. Postlar oddiy tilda yoziladi, atamalar tushuntiriladi." },
      { q: "Narxi qancha bo'ladi?", a: "Boshqa soha kanallari bilan bir xil: oyiga 49 000 so'm, uzoq muddatga olsangiz arzonroq." },
    ],
    related: ["marketing-yangiliklari", "xorijiy-yangiliklar-ozbek-tilida", "telegram-yangiliklar-boti"],
    cta: "Navbatga yozilish",
  },
  {
    slug: "telegram-kanalga-avtopost",
    status: "soon",
    nav: "Telegram kanalga avtopost",
    keyword: "telegram kanalga avtomatik post joylash bot",
    metaTitle: "Telegram kanalga avtomatik post joylash | Stepolog",
    metaDescription:
      "Siz tanlagan saytlardagi yangiliklar kanalingiz uslubida yozilib, jadval bo'yicha joylanadi. Telegram kanal egalari uchun avtopost xizmati tez orada.",
    kicker: "Kanal egalari uchun · tez orada",
    h1: "Telegram kanalingiz uchun avtomatik yangilik postlari",
    lead: "Siz tanlagan saytlardagi yangiliklar kanalingiz uslubida yoziladi va belgilangan jadval bo'yicha joylanadi. Kanal yuritishga ketadigan vaqt sezilarli qisqaradi.",
    answer:
      "Stepolog Telegram kanal egalari uchun avtopost xizmatini tayyorlamoqda. Siz manbalar va uslubni belgilaysiz, bot yangiliklarni shu uslubda matnli post qilib, jadval bo'yicha kanalingizga joylaydi. Xizmat hali ishga tushmagan, navbatga @stepologbot orqali yozilish mumkin.",
    featuresTitle: "Avtopost imkoniyatlari",
    features: [
      { title: "O'z manbalaringiz", text: "Qaysi saytlardan yangilik olinishini o'zingiz tanlaysiz." },
      { title: "Kanalingiz uslubida", text: "Bir nechta namuna postingiz asosida ohang, uzunlik va format moslanadi." },
      { title: "Jadval bo'yicha", text: "Kuniga yoki haftasiga nechta post, qaysi soatda chiqishini belgilaysiz." },
      { title: "Tasdiqlash rejimi", text: "Post avval sizga keladi, bir tugma bilan joylaysiz yoki tahrirlaysiz. Xohlasangiz to'liq avtomatik rejim." },
      { title: "Matnli postlar", text: "Boshida matnli postlar. Rasmli postlar keyingi bosqichda qo'shiladi." },
      { title: "Manba ko'rsatiladi", text: "Postlar asl matnni ko'chirmaydi, mazmunni qayta yozadi va manbani ko'rsatadi." },
    ],
    stepsTitle: "Qanday ishlaydi",
    steps: [
      { title: "Manbalarni belgilang", text: "Kanalingiz mavzusiga mos saytlarni tanlang." },
      { title: "Uslubni ko'rsating", text: "Kanalingizdan bir nechta namuna post yuboring." },
      { title: "Jadvalni sozlang", text: "Postlar belgilangan vaqtda kanalingizga chiqadi." },
    ],
    postTitle: "Kanalingizga chiqadigan post namunasi",
    post: marketingPost,
    audienceTitle: "Xizmat kimlar uchun",
    audience: [
      { title: "Soha kanallari egalari", text: "Har kuni yangilik qidirib, post yozishga vaqt topolmaydiganlar." },
      { title: "Kompaniya kanallari", text: "Mijozlariga soha yangiliklarini muntazam yetkazmoqchi bo'lgan bizneslar." },
      { title: "SMM agentliklar", text: "Bir nechta mijoz kanalini yuritayotgan jamoalar." },
      { title: "Bloggerlar", text: "Asosiy kontent orasida kanalni faol ushlab turmoqchi bo'lganlar." },
    ],
    faq: [
      { q: "Bu xizmat qachon ishga tushadi?", a: "Hozir tayyorlanmoqda. @stepologbot orqali navbatga yozilsangiz, ishga tushganda birinchilardan xabar olasiz." },
      { q: "Kanalim uslubini qanday o'rganadi?", a: "Kanalingizdan bir nechta namuna post yuborasiz. Ohang, uzunlik va formatlash shu namunalar asosida moslanadi." },
      { q: "Postlar avtomatik chiqadimi yoki men tasdiqlaymanmi?", a: "Ikkala rejim ham bo'ladi. Boshida har bir postni o'zingiz tasdiqlashingiz mumkin, keyin xohlasangiz to'liq avtomatik rejimga o'tasiz." },
      { q: "Mualliflik huquqi buzilmaydimi?", a: "Postlar asl matnni ko'chirmaydi. Mazmun qayta yoziladi va har bir postda manba ko'rsatiladi." },
      { q: "Rasmli postlar bo'ladimi?", a: "Boshida matnli postlar bo'ladi. Rasmli postlar keyingi bosqichda qo'shiladi." },
    ],
    related: ["sayt-yangiliklarini-telegramga-yuborish", "telegram-yangiliklar-boti", "marketing-yangiliklari"],
    cta: "Navbatga yozilish",
  },
];

export const getLanding = (slug: string) => landings.find((l) => l.slug === slug);
