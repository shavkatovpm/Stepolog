export interface BotInfo {
  isBot: boolean;
  isAiBot: boolean;
  botName: string | null;
}

const AI_BOTS: Record<string, string> = {
  gptbot: "GPTBot",
  "chatgpt-user": "ChatGPT",
  "oai-searchbot": "OpenAI SearchBot",
  claudebot: "ClaudeBot",
  "claude-web": "Claude Web",
  "claude-searchbot": "Claude SearchBot",
  perplexitybot: "PerplexityBot",
  "perplexity-user": "Perplexity",
  "google-extended": "Google AI",
  "googleother": "Google AI",
  "applebot-extended": "Apple AI",
  "amazonbot": "Amazon AI",
  bytespider: "ByteDance AI",
  ccbot: "Common Crawl",
  "cohere-ai": "Cohere",
  "anthropic-ai": "Anthropic",
  "mistralai-user": "Mistral",
  "meta-externalagent": "Meta AI",
  "meta-externalfetcher": "Meta AI",
  "diffbot": "Diffbot",
  "ai2bot": "Allen AI",
  "youbot": "You.com",
};

const SEARCH_BOTS: Record<string, string> = {
  googlebot: "Googlebot",
  bingbot: "Bingbot",
  yandexbot: "YandexBot",
  "yandex.com": "YandexBot",
  duckduckbot: "DuckDuckBot",
  baiduspider: "Baiduspider",
  slurp: "Yahoo",
  "yahoo!": "Yahoo",
  applebot: "Applebot",
  sogou: "Sogou",
  "yeti": "Naver",
};

const GENERIC_BOT_KEYWORDS = [
  "bot",
  "crawler",
  "spider",
  "scraper",
  "fetch",
  "curl",
  "wget",
  "python-requests",
  "http-client",
  "axios",
  "node-fetch",
  "headless",
  "phantom",
  "playwright",
  "puppeteer",
  "selenium",
  "monitoring",
  "uptimerobot",
  "pingdom",
];

export function detectBot(userAgent: string | null): BotInfo {
  if (!userAgent) {
    return { isBot: false, isAiBot: false, botName: null };
  }

  const ua = userAgent.toLowerCase();

  for (const [key, name] of Object.entries(AI_BOTS)) {
    if (ua.includes(key)) {
      return { isBot: true, isAiBot: true, botName: name };
    }
  }

  for (const [key, name] of Object.entries(SEARCH_BOTS)) {
    if (ua.includes(key)) {
      return { isBot: true, isAiBot: false, botName: name };
    }
  }

  for (const keyword of GENERIC_BOT_KEYWORDS) {
    if (ua.includes(keyword)) {
      return { isBot: true, isAiBot: false, botName: "Other Bot" };
    }
  }

  return { isBot: false, isAiBot: false, botName: null };
}
