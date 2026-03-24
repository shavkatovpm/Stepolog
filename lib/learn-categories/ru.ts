import type { LearnCategory } from "./index";

export const learnCategories: LearnCategory[] = [
  { slug: "startup-nima", number: "01", title: "Что такое стартап и мышление", description: "Разница между стартапом и обычным бизнесом, мышление основателя", topics: ["Стартап vs обычный бизнес", "Почему люди создают стартапы", "Мышление основателя"] },
  { slug: "goya-topish", number: "02", title: "Поиск идеи", description: "Валидация идеи — проверка идеи и мышление на основе проблемы", topics: ["Как найти идею", "Мышление от проблемы", "Что такое \"хорошая идея\"?"] },
  { slug: "bozor-tushunish", number: "03", title: "Понимание рынка", description: "Исследование рынка — целевая аудитория, TAM/SAM/SOM, конкуренты", topics: ["Целевая аудитория", "TAM / SAM / SOM", "Анализ конкурентов"] },
  { slug: "mvp", number: "04", title: "MVP", description: "Минимально жизнеспособный продукт — быстрый запуск и избежание ошибок", topics: ["Что такое MVP", "Как быстро запустить", "Ошибки overbuild"] },
  { slug: "product-market-fit", number: "05", title: "Product-market fit", description: "Определение соответствия продукта рынку и цикл обратной связи", topics: ["Что такое PMF", "Как понять что продукт работает", "Feedback loop"] },
  { slug: "monetizatsiya", number: "06", title: "Монетизация и бизнес-модель", description: "Модель дохода, стратегия ценообразования и unit economics", topics: ["Как зарабатывать", "Стратегия ценообразования", "Unit economics"] },
  { slug: "marketing", number: "07", title: "Маркетинг и рост", description: "Привлечение пользователей с нуля, органика vs платная реклама", topics: ["Пользователи с нуля", "Органика vs платная", "Growth-хаки"] },
  { slug: "texnologiya", number: "08", title: "Технологии и создание продукта", description: "Выбор технологического стека, масштабируемость, MVP vs production", topics: ["Выбор tech stack", "Масштабируемость", "MVP vs production"] },
  { slug: "scaling", number: "09", title: "Масштабирование и инвестиции", description: "Расширение стартапа, работа с инвесторами и стратегии выхода", topics: ["Расширение стартапа", "Инвесторы", "Exit-стратегии"] },
];
