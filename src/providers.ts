export interface ModelEntry {
  value: string;
  label: string;
}

export interface ProviderPreset {
  name: string;
  baseUrl: string;
  models: ModelEntry[];
  note?: string; // shown as warning
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
    note: '⚠️ Anthropic native API is NOT OpenAI-compatible. Use OpenRouter, a proxy, or one of the Chinese providers below that offer Claude access.',
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
      { value: 'deepseek-chat', label: 'DeepSeek V3' },
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
      { value: 'kimi-k2.5', label: 'Kimi K2.5' },
    ],
  },
  {
    name: 'Zhipu (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { value: 'glm-5', label: 'GLM-5' },
      { value: 'glm-4-plus', label: 'GLM-4 Plus' },
      { value: 'glm-4-flash', label: 'GLM-4 Flash' },
      { value: 'glm-4-long', label: 'GLM-4 Long' },
      { value: 'glm-4v', label: 'GLM-4V' },
    ],
  },
  {
    name: 'Alibaba (Qwen / Bailian)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { value: 'qwen-max', label: 'Qwen Max' },
      { value: 'qwen-plus', label: 'Qwen Plus' },
      { value: 'qwen-turbo', label: 'Qwen Turbo' },
      { value: 'qwen-long', label: 'Qwen Long' },
      { value: 'qwen-vl-max', label: 'Qwen VL Max' },
    ],
  },
  {
    name: 'StepFun (阶跃星辰)',
    baseUrl: 'https://api.stepfun.ai/v1',
    models: [
      { value: 'step-3.5-flash', label: 'Step 3.5 Flash' },
      { value: 'step-3', label: 'Step 3' },
      { value: 'step-2-16k', label: 'Step 2 16K' },
    ],
  },
  {
    name: 'MiniMax',
    baseUrl: 'https://api.minimaxi.com/v1',
    models: [
      { value: 'MiniMax-M2.7', label: 'MiniMax M2.7' },
      { value: 'MiniMax-Text-01', label: 'MiniMax Text 01' },
    ],
  },
  {
    name: 'SiliconFlow (硅基流动)',
    baseUrl: 'https://api.siliconflow.cn/v1',
    models: [
      { value: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' },
      { value: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1' },
      { value: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen 2.5 72B' },
      { value: 'meta-llama/Meta-Llama-3.1-70B-Instruct', label: 'Llama 3.1 70B' },
      { value: 'THUDM/glm-4-9b-chat', label: 'GLM-4 9B' },
    ],
  },
  {
    name: 'ByteDance (Doubao / 豆包)',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: [
      { value: 'doubao-seed-2-0-code-preview-latest', label: 'Doubao Seed 2.0 Code' },
      { value: 'doubao-1.5-pro-32k', label: 'Doubao 1.5 Pro 32K' },
      { value: 'doubao-1.5-lite-32k', label: 'Doubao 1.5 Lite 32K' },
    ],
  },
  {
    name: 'ModelScope (魔搭)',
    baseUrl: 'https://api-inference.modelscope.cn/v1',
    models: [
      { value: 'ZhipuAI/GLM-5', label: 'GLM-5' },
      { value: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen 2.5 72B' },
      { value: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' },
    ],
  },
  {
    name: 'Nvidia NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: [
      { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
      { value: 'meta/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout' },
      { value: 'deepseek-ai/deepseek-v3', label: 'DeepSeek V3' },
    ],
  },
  {
    name: 'Xiaomi MiMo',
    baseUrl: 'https://api.xiaomimimo.com/v1',
    models: [
      { value: 'mimo-v2-pro', label: 'MiMo V2 Pro' },
      { value: 'mimo-v2-omni', label: 'MiMo V2 Omni' },
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
      { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
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
