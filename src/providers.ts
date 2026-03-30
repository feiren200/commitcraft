export interface ProviderPreset {
  name: string;
  baseUrl: string;
  models: { value: string; label: string }[];
}

export const PROVIDERS: ProviderPreset[] = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (fast, cheap)' },
      { value: 'o3-mini', label: 'o3-mini (reasoning)' },
    ],
  },
  {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      { value: 'deepseek-chat', label: 'DeepSeek V3' },
      { value: 'deepseek-reasoner', label: 'DeepSeek R1 (reasoning)' },
    ],
  },
  {
    name: 'Moonshot (Kimi)',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: [
      { value: 'moonshot-v1-8k', label: 'Moonshot v1 8K' },
      { value: 'moonshot-v1-32k', label: 'Moonshot v1 32K' },
      { value: 'moonshot-v1-128k', label: 'Moonshot v1 128K' },
    ],
  },
  {
    name: 'Zhipu (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { value: 'glm-4-plus', label: 'GLM-4 Plus' },
      { value: 'glm-4-flash', label: 'GLM-4 Flash' },
    ],
  },
  {
    name: 'Alibaba (Qwen)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { value: 'qwen-plus', label: 'Qwen Plus' },
      { value: 'qwen-turbo', label: 'Qwen Turbo' },
      { value: 'qwen-max', label: 'Qwen Max' },
    ],
  },
  {
    name: 'Anthropic (via proxy)',
    baseUrl: '',
    models: [
      { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { value: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
    ],
  },
  {
    name: 'Google (Gemini)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    models: [
      { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    ],
  },
  {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
      { value: 'anthropic/claude-opus-4', label: 'Claude Opus 4' },
      { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { value: 'openai/gpt-4o', label: 'GPT-4o' },
      { value: 'deepseek/deepseek-chat', label: 'DeepSeek V3' },
    ],
  },
  {
    name: 'Custom',
    baseUrl: '',
    models: [],
  },
];
