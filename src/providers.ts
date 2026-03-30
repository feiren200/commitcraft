export interface ModelEntry {
  value: string;
  label: string;
}

export interface ProviderPreset {
  name: string;
  baseUrl: string;
  models: ModelEntry[];
}

export const PROVIDERS: ProviderPreset[] = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { value: 'gpt-4.1', label: 'GPT-4.1' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'o3', label: 'o3' },
      { value: 'o3-mini', label: 'o3-mini' },
      { value: 'o4-mini', label: 'o4-mini' },
      { value: 'o1', label: 'o1' },
    ],
  },
  {
    name: 'Anthropic (Claude)',
    baseUrl: '',
    models: [
      { value: 'claude-opus-4', label: 'Claude Opus 4' },
      { value: 'claude-sonnet-4', label: 'Claude Sonnet 4' },
      { value: 'claude-3.7-sonnet', label: 'Claude 3.7 Sonnet' },
      { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
    ],
  },
  {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      { value: 'deepseek-chat', label: 'DeepSeek V3 (chat)' },
      { value: 'deepseek-r1', label: 'DeepSeek R1 (reasoning)' },
    ],
  },
  {
    name: 'Google (Gemini)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    models: [
      { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
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
      { value: 'glm-4-long', label: 'GLM-4 Long' },
    ],
  },
  {
    name: 'Alibaba (Qwen)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { value: 'qwen-max', label: 'Qwen Max' },
      { value: 'qwen-plus', label: 'Qwen Plus' },
      { value: 'qwen-turbo', label: 'Qwen Turbo' },
      { value: 'qwen-long', label: 'Qwen Long' },
    ],
  },
  {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      { value: 'openai/gpt-4.1', label: 'OpenAI GPT-4.1' },
      { value: 'openai/gpt-4o', label: 'OpenAI GPT-4o' },
      { value: 'openai/o3-mini', label: 'OpenAI o3-mini' },
      { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
      { value: 'anthropic/claude-opus-4', label: 'Claude Opus 4' },
      { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { value: 'deepseek/deepseek-chat', label: 'DeepSeek V3' },
      { value: 'deepseek/deepseek-r1', label: 'DeepSeek R1' },
      { value: 'meta-llama/llama-4-scout', label: 'Llama 4 Scout' },
    ],
  },
  {
    name: 'Custom',
    baseUrl: '',
    models: [],
  },
];
