import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Model {
  value: string;
  label: string;
  description?: string;
  provider?: string;
  category?: string;
}

interface ModelsData {
  [provider: string]: {
    [category: string]: Model[];
  };
}

interface SettingsPopupProps {
  modelsData: ModelsData;
  allModels: Model[];
  enabledModels: string[];
  onEnabledModelsChange: (enabledModels: string[]) => void;
}

const ALL_MODEL_VALUES = [
  "gpt-5-2025-08-07",
  "gpt-5",
  "gpt-5-mini-2025-08-07", 
  "gpt-5-mini",
  "gpt-5-nano-2025-08-07",
  "gpt-5-nano",
  "gpt-5-chat-latest",
  "gpt-4o",
  "gpt-4o-mini",
  "o1",
  "o1-mini",
  "o1-pro",
  "o3",
  "o3-mini",
  "o4-mini",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-4.5-preview",
  "claude-sonnet-4-5-20250929",
  "claude-sonnet-4.5",
  "claude-sonnet-4-5",
  "claude-opus-4-1-20250805",
  "claude-opus-4-1",
  "claude-opus-4-20250514",
  "claude-opus-4",
  "claude-opus-4-latest",
  "claude-sonnet-4-20250514",
  "claude-sonnet-4",
  "claude-sonnet-4-latest",
  "claude-3-7-sonnet-20250219",
  "claude-3-7-sonnet-latest",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-latest",
  "claude-3-5-sonnet-20240620",
  "claude-3-haiku-20240307",
  "cartesia/sonic",
  "cartesia/sonic-2",
  "togethercomputer/MoA-1",
  "meta-llama/Meta-Llama-Guard-3-8B",
  "meta-llama/LlamaGuard-2-8b",
  "meta-llama/Llama-3.2-3B-Instruct-Turbo",
  "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  "openai/gpt-oss-20b",
  "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  "openai/gpt-oss-120b",
  "Salesforce/Llama-Rank-V1",
  "mistralai/Mistral-7B-Instruct-v0.3",
  "openai/whisper-large-v3",
  "deepcogito/cogito-v2-preview-llama-405B",
  "deepseek-ai/DeepSeek-R1",
  "black-forest-labs/FLUX.1-schnell",
  "black-forest-labs/FLUX.1-kontext-dev",
  "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
  "arcee-ai/coder-large",
  "meta-llama/Meta-Llama-3-8B-Instruct-Lite",
  "black-forest-labs/FLUX.1-dev",
  "marin-community/marin-8b-instruct",
  "togethercomputer/Refuel-Llm-V2-Small",
  "Alibaba-NLP/gte-modernbert-base",
  "Qwen/Qwen3-Next-80B-A3B-Thinking",
  "arcee_ai/arcee-spotlight",
  "google/gemma-3n-E4B-it",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
  "arize-ai/qwen-2-1.5b-instruct",
  "black-forest-labs/FLUX.1-pro",
  "black-forest-labs/FLUX.1.1-pro",
  "arcee-ai/virtuoso-large",
  "zai-org/GLM-4.5-Air-FP8",
  "black-forest-labs/FLUX.1-krea-dev",
  "arcee-ai/maestro-reasoning",
  "togethercomputer/MoA-1-Turbo",
  "mistralai/Mistral-Small-24B-Instruct-2501",
  "Qwen/Qwen2.5-7B-Instruct-Turbo",
  "arcee-ai/AFM-4.5B",
  "black-forest-labs/FLUX.1-dev-lora",
  "moonshotai/Kimi-K2-Instruct-0905",
  "Qwen/Qwen3-235B-A22B-fp8-tput",
  "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
  "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
  "Qwen/Qwen2.5-VL-72B-Instruct",
  "mistralai/Mixtral-8x7B-Instruct-v0.1",
  "meta-llama/Llama-2-70b-hf",
  "togethercomputer/m2-bert-80M-32k-retrieval",
  "meta-llama/Llama-3-70b-chat-hf",
  "deepseek-ai/DeepSeek-R1-0528-tput",
  "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
  "mixedbread-ai/Mxbai-Rerank-Large-V2",
  "moonshotai/Kimi-K2-Instruct",
  "mistralai/Mistral-7B-Instruct-v0.1",
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
  "scb10x/scb10x-typhoon-2-1-gemma3-12b",
  "meta-llama/Llama-Guard-4-12B",
  "togethercomputer/Refuel-Llm-V2",
  "intfloat/multilingual-e5-large-instruct",
  "meta-llama/Llama-4-Scout-17B-16E-Instruct",
  "Qwen/Qwen2.5-72B-Instruct-Turbo",
  "Qwen/QwQ-32B",
  "deepcogito/cogito-v2-preview-deepseek-671b",
  "black-forest-labs/FLUX.1-kontext-max",
  "deepseek-ai/DeepSeek-V3",
  "Qwen/Qwen2.5-Coder-32B-Instruct",
  "deepcogito/cogito-v2-preview-llama-109B-MoE",
  "deepcogito/cogito-v2-preview-llama-70B",
  "meta-llama/Llama-Guard-3-11B-Vision-Turbo",
  "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
  "black-forest-labs/FLUX.1-schnell-Free",
  "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8",
  "black-forest-labs/FLUX.1-kontext-pro",
  "Virtue-AI/VirtueGuard-Text-Lite",
  "lgai/exaone-deep-32b",
  "lgai/exaone-3-5-32b-instruct",
  "Qwen/Qwen3-Next-80B-A3B-Instruct",
  "Qwen/Qwen3-235B-A22B-Instruct-2507-tput",
  "meta-llama/Llama-3.1-405B-Instruct",
  "meta-llama/Llama-3-70b-hf",
  "Qwen/Qwen3-235B-A22B-Thinking-2507",
  "Qwen/Qwen2.5-72B-Instruct",
  "deepseek-ai/DeepSeek-V3.1",
  "meta-llama/Meta-Llama-3.1-70B-Instruct-Reference",
  "BAAI/bge-large-en-v1.5",
  "meta-llama/Llama-3.2-1B-Instruct",
  "meta-llama/Meta-Llama-3.1-8B-Instruct-Reference",
  "meta-llama/Meta-Llama-3-8B-Instruct",
  "BAAI/bge-base-en-v1.5",
  "mistralai/Mistral-7B-Instruct-v0.2",
  "model-fallback-test-1",
  "mistral-large-latest",
  "mistral-medium-2508",
  "mistral-medium-latest",
  "mistral-medium",
  "ministral-3b-2410",
  "ministral-3b-latest",
  "ministral-8b-2410",
  "ministral-8b-latest",
  "open-mistral-7b",
  "mistral-tiny",
  "mistral-tiny-2312",
  "open-mistral-nemo",
  "open-mistral-nemo-2407",
  "mistral-tiny-2407",
  "mistral-tiny-latest",
  "open-mixtral-8x7b",
  "mistral-small",
  "mistral-small-2312",
  "open-mixtral-8x22b",
  "open-mixtral-8x22b-2404",
  "pixtral-large-2411",
  "pixtral-large-latest",
  "mistral-large-pixtral-2411",
  "codestral-2508",
  "codestral-latest",
  "devstral-small-2507",
  "devstral-small-latest",
  "pixtral-12b-2409",
  "pixtral-12b",
  "pixtral-12b-latest",
  "mistral-small-2506",
  "mistral-small-latest",
  "mistral-saba-2502",
  "mistral-saba-latest",
  "magistral-medium-2509",
  "magistral-medium-latest",
  "magistral-small-2509",
  "magistral-small-latest",
  "mistral-moderation-2411",
  "mistral-moderation-latest",
  "mistral-ocr-2505",
  "mistral-ocr-latest",
  "grok-beta",
  "grok-vision-beta",
  "grok-3",
  "grok-3-fast",
  "grok-3-mini",
  "grok-3-mini-fast",
  "grok-2-vision",
  "grok-2",
  "deepseek-chat",
  "deepseek-reasoner",
  "gemini-1.5-flash",
  "gemini-2.0-flash"
];

const getProviderColor = (provider: string) => {
  const colors = {
    'OpenAI': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Anthropic': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Google': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Mistral': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'xAI': 'bg-red-500/10 text-red-400 border-red-500/20',
    'DeepSeek': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  };
  return colors[provider as keyof typeof colors] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export function SettingsPopup({ modelsData, allModels, enabledModels, onEnabledModelsChange }: SettingsPopupProps) {
  const [openProviders, setOpenProviders] = useState<Set<string>>(new Set(['OpenAI']));
  const [customModelName, setCustomModelName] = useState('');
  const [customProvider, setCustomProvider] = useState('');
  const [showAddModel, setShowAddModel] = useState(false);

  const toggleProvider = (provider: string) => {
    const newOpenProviders = new Set(openProviders);
    if (newOpenProviders.has(provider)) {
      newOpenProviders.delete(provider);
    } else {
      newOpenProviders.add(provider);
    }
    setOpenProviders(newOpenProviders);
  };

  const handleModelToggle = (modelValue: string, checked: boolean) => {
    if (checked) {
      onEnabledModelsChange([...enabledModels, modelValue]);
    } else {
      onEnabledModelsChange(enabledModels.filter(m => m !== modelValue));
    }
  };

  const selectAllForProvider = (provider: string) => {
    const providerModels = Object.values(modelsData[provider] || {})
      .flat()
      .map(m => m.value);
    const newEnabled = [...new Set([...enabledModels, ...providerModels])];
    onEnabledModelsChange(newEnabled);
  };

  const deselectAllForProvider = (provider: string) => {
    const providerModels = Object.values(modelsData[provider] || {})
      .flat()
      .map(m => m.value);
    const newEnabled = enabledModels.filter(m => !providerModels.includes(m));
    onEnabledModelsChange(newEnabled);
  };

  const selectAllModels = () => {
    onEnabledModelsChange(ALL_MODEL_VALUES);
  };

  const deselectAllModels = () => {
    onEnabledModelsChange([]);
  };

  const handleAddCustomModel = () => {
    if (customModelName.trim()) {
      // Add the custom model value to enabled models
      if (!enabledModels.includes(customModelName.trim())) {
        onEnabledModelsChange([...enabledModels, customModelName.trim()]);
      }
      setCustomModelName('');
      setCustomProvider('');
      setShowAddModel(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Models</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllModels}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAllModels}>
                    Deselect All
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which AI models appear in your model selector dropdown. {enabledModels.length} models selected.
              </p>
            </div>

            {/* Add custom model section */}
            {!showAddModel ? (
              <Button 
                onClick={() => setShowAddModel(true)} 
                variant="outline"
                size="sm"
                className="w-full"
              >
                Add Model
              </Button>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-accent/5">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="custom-model-name" className="text-sm">Model Name</Label>
                    <Input
                      id="custom-model-name"
                      placeholder="e.g., gpt-5-custom"
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-provider" className="text-sm">Provider</Label>
                    <Input
                      id="custom-provider"
                      placeholder="e.g., OpenAI"
                      value={customProvider}
                      onChange={(e) => setCustomProvider(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddCustomModel} 
                      disabled={!customModelName.trim()}
                      size="sm"
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowAddModel(false);
                        setCustomModelName('');
                        setCustomProvider('');
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 pb-6 max-h-[60vh]">
          <div className="space-y-4">
            {Object.entries(modelsData).map(([provider, categories]) => (
              <Collapsible
                key={provider}
                open={openProviders.has(provider)}
                onOpenChange={() => toggleProvider(provider)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto font-semibold border border-border">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={getProviderColor(provider)}>
                        {provider}
                      </Badge>
                      <span className="text-sm">
                        {Object.values(categories).reduce((acc: number, models: Model[]) => acc + models.length, 0)} models
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAllForProvider(provider);
                        }}
                      >
                        All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          deselectAllForProvider(provider);
                        }}
                      >
                        None
                      </Button>
                      <div className={`transform transition-transform ${openProviders.has(provider) ? 'rotate-90' : ''}`}>
                        <span>▶</span>
                      </div>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-2 ml-4">
                  {Object.entries(categories).map(([category, models]: [string, Model[]]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {category}
                      </h4>
                      <div className="grid gap-2">
                        {models.map((model: Model) => (
                          <div
                            key={model.value}
                            className="flex items-center space-x-3 p-2 rounded-md border border-border hover:bg-accent/50"
                          >
                            <Checkbox
                              id={model.value}
                              checked={enabledModels.includes(model.value)}
                              onCheckedChange={(checked) => handleModelToggle(model.value, checked as boolean)}
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={model.value}
                                className="font-medium text-sm cursor-pointer"
                              >
                                {model.label}
                              </label>
                              <div className="text-xs text-muted-foreground">{model.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}

            {/* Additional models not in structured data */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Additional Models</h4>
              <div className="grid gap-2">
                {ALL_MODEL_VALUES
                  .filter(modelValue => !allModels.some(m => m.value === modelValue))
                  .map((modelValue) => (
                    <div
                      key={modelValue}
                      className="flex items-center space-x-3 p-2 rounded-md border border-border hover:bg-accent/50"
                    >
                      <Checkbox
                        id={modelValue}
                        checked={enabledModels.includes(modelValue)}
                        onCheckedChange={(checked) => handleModelToggle(modelValue, checked as boolean)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={modelValue}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {modelValue}
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}