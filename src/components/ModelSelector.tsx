import React, { useState } from 'react';
import { Search, Sparkles, Zap, Brain, Code, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  modelsData: ModelsData;
  allModels: Model[];
  popularModels: Model[];
  enabledModels: string[];
}
const getModelIcon = (category: string, provider: string) => {
  if (category.includes('Reasoning') || provider === 'xAI') return Brain;
  if (category.includes('Code') || category.includes('Codestral')) return Code;
  if (category.includes('Vision') || category.includes('Multimodal')) return Eye;
  if (category.includes('Fast') || category.includes('Mini') || category.includes('Nano')) return Zap;
  return Sparkles;
};
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
export function ModelSelector({
  selectedModel,
  onModelSelect,
  modelsData,
  allModels,
  popularModels,
  enabledModels
}: ModelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openProviders, setOpenProviders] = useState<Set<string>>(new Set(['OpenAI', 'Anthropic']));
  const [showPopular, setShowPopular] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const toggleProvider = (provider: string) => {
    const newOpenProviders = new Set(openProviders);
    if (newOpenProviders.has(provider)) {
      newOpenProviders.delete(provider);
    } else {
      newOpenProviders.add(provider);
    }
    setOpenProviders(newOpenProviders);
  };
  // Filter to only show enabled models
  const filteredModels = allModels.filter(model => 
    enabledModels.includes(model.value) && 
    (model.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
     model.provider.toLowerCase().includes(searchTerm.toLowerCase()) || 
     model.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const selectedModelInfo = allModels.find(m => m.value === selectedModel) || popularModels[0];
  const handleModelSelect = (model: string) => {
    onModelSelect(model);
    setIsOpen(false);
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-secondary border-border hover:bg-secondary/80 text-center rounded-sm">
          <div className="flex items-center gap-2 truncate min-w-0 flex-1">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-medium truncate w-full">{selectedModelInfo?.label || 'Select Model'}</span>
              <span className="text-xs text-muted-foreground truncate w-full">{selectedModelInfo?.provider}</span>
            </div>
          </div>
          <Badge variant="secondary" className={`${getProviderColor(selectedModelInfo?.provider || '')} flex-shrink-0 ml-2 text-xs`}>
            {selectedModelInfo?.provider}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Choose AI Model
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search models by name, provider, or capability..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-background border-border" />
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant={showPopular ? "default" : "outline"} size="sm" onClick={() => setShowPopular(true)} className="h-8">
              Popular
            </Button>
            <Button variant={!showPopular ? "default" : "outline"} size="sm" onClick={() => setShowPopular(false)} className="h-8">
              All Models
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 pb-6 max-h-[50vh]">
          {showPopular && !searchTerm ? <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Popular Models</h3>
              <div className="grid gap-2">
                 {popularModels.map(model => {
              const Icon = getModelIcon('', model.provider);
              return <Card key={model.value} className={`cursor-pointer transition-all hover:bg-accent/50 ${selectedModel === model.value ? 'ring-2 ring-primary bg-accent/30' : ''}`} onClick={() => handleModelSelect(model.value)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-primary" />
                            <div>
                              <div className="font-medium">{model.label}</div>
                              <div className="text-xs text-muted-foreground">{model.description}</div>
                            </div>
                          </div>
                          <Badge variant="secondary" className={getProviderColor(model.provider)}>
                            {model.provider}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>;
            })}
              </div>
            </div> : <div className="space-y-4">
              {searchTerm ? <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Search Results ({filteredModels.length})
                  </h3>
                   {filteredModels.map(model => {
              const Icon = getModelIcon(model.category, model.provider);
              return <Card key={model.value} className={`cursor-pointer transition-all hover:bg-accent/50 ${selectedModel === model.value ? 'ring-2 ring-primary bg-accent/30' : ''}`} onClick={() => handleModelSelect(model.value)}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-primary" />
                              <div>
                                <div className="font-medium text-sm">{model.label}</div>
                                <div className="text-xs text-muted-foreground">{model.description}</div>
                              </div>
                            </div>
                            <Badge variant="secondary" className={getProviderColor(model.provider)}>
                              {model.provider}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>;
            })}
                </div> : Object.entries(modelsData).map(([provider, categories]) => <Collapsible key={provider} open={openProviders.has(provider)} onOpenChange={() => toggleProvider(provider)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-2 h-auto font-semibold">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getProviderColor(provider)}>
                            {provider}
                          </Badge>
                           <span className="text-sm">
                             {Object.values(categories).reduce((acc: number, models: Model[]) => acc + models.length, 0)} models
                           </span>
                        </div>
                        <div className={`transform transition-transform ${openProviders.has(provider) ? 'rotate-90' : ''}`}>
                          <span>▶</span>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-2 ml-4">
                      {Object.entries(categories).map(([category, models]: [string, Model[]]) => <div key={category} className="space-y-2">
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {category}
                          </h4>
                          <div className="grid gap-2">
                             {models.map((model: Model) => {
                    const Icon = getModelIcon(category, provider);
                    return <Card key={model.value} className={`cursor-pointer transition-all hover:bg-accent/50 ${selectedModel === model.value ? 'ring-2 ring-primary bg-accent/30' : ''}`} onClick={() => handleModelSelect(model.value)}>
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                      <Icon className="h-4 w-4 text-primary" />
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{model.label}</div>
                                        <div className="text-xs text-muted-foreground">{model.description}</div>
                                      </div>
                                      {selectedModel === model.value && <div className="w-2 h-2 bg-primary rounded-full" />}
                                    </div>
                                  </CardContent>
                                </Card>;
                  })}
                          </div>
                        </div>)}
                    </CollapsibleContent>
                  </Collapsible>)}
            </div>}
        </ScrollArea>
      </DialogContent>
    </Dialog>;
}