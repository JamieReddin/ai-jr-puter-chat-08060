import React, { useState, useEffect } from 'react';
import { Settings, Plus, User, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ALL_MODEL_VALUES } from '@/data/models';
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
interface SettingsDialogProps {
  modelsData: ModelsData;
  allModels: Model[];
  enabledModels: string[];
  onEnabledModelsChange: (enabledModels: string[]) => void;
  allModelValues: string[];
}
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
export function SettingsDialog({
  modelsData,
  allModels,
  enabledModels,
  onEnabledModelsChange,
  allModelValues
}: SettingsDialogProps) {
  const [openProviders, setOpenProviders] = useState<Set<string>>(new Set(['OpenAI']));
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [textSize, setTextSize] = useState(() => {
    return parseInt(localStorage.getItem('textSize') || '100');
  });
  const [maxPuterTokens, setMaxPuterTokens] = useState(() => {
    return parseInt(localStorage.getItem('maxPuterTokens') || '50000000');
  });
  const [showAddModel, setShowAddModel] = useState(false);
  const [newModelId, setNewModelId] = useState('');
  const [newModelProvider, setNewModelProvider] = useState('');
  const [customModels, setCustomModels] = useState<Model[]>(() => {
    const saved = localStorage.getItem('customModels');
    return saved ? JSON.parse(saved) : [];
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('userAvatar') || '';
  });
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}%`;
    localStorage.setItem('textSize', textSize.toString());
  }, [textSize]);
  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);
  useEffect(() => {
    localStorage.setItem('userAvatar', userAvatar);
  }, [userAvatar]);
  const handleSaveAppSettings = () => {
    localStorage.setItem('maxPuterTokens', maxPuterTokens.toString());
  };
  const handleAddModel = () => {
    if (newModelId.trim() && newModelProvider.trim()) {
      const newModel: Model = {
        value: newModelId.trim(),
        label: newModelId.trim(),
        provider: newModelProvider.trim(),
        category: 'Custom',
        description: 'Custom user-added model'
      };
      const updatedCustomModels = [...customModels, newModel];
      setCustomModels(updatedCustomModels);
      localStorage.setItem('customModels', JSON.stringify(updatedCustomModels));

      // Add to enabled models
      onEnabledModelsChange([...enabledModels, newModel.value]);
      setNewModelId('');
      setNewModelProvider('');
      setShowAddModel(false);
    }
  };
  const getAllModelsWithCustom = () => {
    const baseModels = ALL_MODEL_VALUES.map(value => ({
      value,
      label: value,
      provider: value.includes('/') ? value.split('/')[0] : 'Unknown',
      category: 'Standard'
    }));
    return [...baseModels, ...customModels];
  };
  const getModelsDataWithCustom = () => {
    const allModelsWithCustom = getAllModelsWithCustom();
    const grouped: ModelsData = {};
    allModelsWithCustom.forEach(model => {
      const provider = model.provider || 'Unknown';
      const category = model.category || 'Standard';
      if (!grouped[provider]) {
        grouped[provider] = {};
      }
      if (!grouped[provider][category]) {
        grouped[provider][category] = [];
      }
      grouped[provider][category].push(model);
    });
    return grouped;
  };
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
    const modelsDataWithCustom = getModelsDataWithCustom();
    const providerModels = Object.values(modelsDataWithCustom[provider] || {}).flat().map(m => m.value);
    const newEnabled = [...new Set([...enabledModels, ...providerModels])];
    onEnabledModelsChange(newEnabled);
  };
  const deselectAllForProvider = (provider: string) => {
    const modelsDataWithCustom = getModelsDataWithCustom();
    const providerModels = Object.values(modelsDataWithCustom[provider] || {}).flat().map(m => m.value);
    const newEnabled = enabledModels.filter(m => !providerModels.includes(m));
    onEnabledModelsChange(newEnabled);
  };
  const selectAllModels = () => {
    const allModelsWithCustom = getAllModelsWithCustom();
    onEnabledModelsChange(allModelsWithCustom.map(m => m.value));
  };
  const deselectAllModels = () => {
    onEnabledModelsChange([]);
  };
  const exportChat = () => {
    const messages = localStorage.getItem('chatHistory') || '[]';
    const blob = new Blob([messages], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const clearChatHistory = () => {
    localStorage.removeItem('chatHistory');
    alert('Chat history cleared!');
  };
  return <Dialog>
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
        
        <Tabs defaultValue="models" className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="app">App</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="models" className="px-6 pb-6 mt-4">
            <div className="space-y-4">
              <p className="text-muted-foreground text-center font-normal text-xs mb-4">
                Choose which AI models appear in your model selector dropdown. {enabledModels.length} models selected.
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={selectAllModels}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllModels}>
                  Deselect All
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddModel(true)} className="text-center justify-center ">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </div>

              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {Object.entries(getModelsDataWithCustom()).map(([provider, categories]) => <Collapsible key={provider} open={openProviders.has(provider)} onOpenChange={() => toggleProvider(provider)}>
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
                            <Button variant="outline" size="sm" className="h-6 text-xs" onClick={e => {
                          e.stopPropagation();
                          selectAllForProvider(provider);
                        }}>
                              All
                            </Button>
                            <Button variant="outline" size="sm" className="h-6 text-xs" onClick={e => {
                          e.stopPropagation();
                          deselectAllForProvider(provider);
                        }}>
                              None
                            </Button>
                            <div className={`transform transition-transform ${openProviders.has(provider) ? 'rotate-90' : ''}`}>
                              <span>▶</span>
                            </div>
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3 mt-2 ml-4">
                        {Object.entries(categories).map(([category, models]: [string, Model[]]) => <div key={category} className="space-y-2">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {category}
                            </h4>
                            <div className="grid gap-2">
                              {models.map((model: Model) => <div key={model.value} className="flex items-center space-x-3 p-2 rounded-md border border-border hover:bg-accent/50">
                                  <Checkbox id={model.value} checked={enabledModels.includes(model.value)} onCheckedChange={checked => handleModelToggle(model.value, checked as boolean)} />
                                  <div className="flex-1">
                                    <label htmlFor={model.value} className="font-medium text-sm cursor-pointer">
                                      {model.label}
                                    </label>
                                    <div className="text-xs text-muted-foreground">{model.description}</div>
                                  </div>
                                </div>)}
                            </div>
                          </div>)}
                      </CollapsibleContent>
                    </Collapsible>)}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="app" className="px-6 pb-6 mt-4">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-size">Text Size: {textSize}%</Label>
                  <Slider id="text-size" min={75} max={150} step={5} value={[textSize]} onValueChange={value => setTextSize(value[0])} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Puter Tokens</Label>
                  <Input id="max-tokens" type="number" value={maxPuterTokens} onChange={e => setMaxPuterTokens(parseInt(e.target.value) || 0)} min={0} />
                </div>

                <div className="space-y-2">
                  <Label>Chat History</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportChat}>
                      Export Chat
                    </Button>
                    <Button variant="outline" onClick={clearChatHistory}>
                      Clear History
                    </Button>
                  </div>
                </div>

                <Button onClick={handleSaveAppSettings} className="w-full">
                  Save Settings
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="about" className="px-6 pb-6 mt-4">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-6">
                {/* User Profile Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Profile
                  </h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userAvatar} alt={userName || "User"} />
                      <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label htmlFor="user-name">Name</Label>
                        <Input id="user-name" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter your name" />
                      </div>
                      <div>
                        <Label htmlFor="user-avatar">Avatar URL</Label>
                        <Input id="user-avatar" value={userAvatar} onChange={e => setUserAvatar(e.target.value)} placeholder="Enter avatar image URL" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* App Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">App Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex-auto ">
                      <span className="text-muted-foreground gap-1.5 ">Created by:</span>
                      <a href="https://jayreddin.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline gap-1.5 ">
                        Jamie Reddin
                      </a>
                    </div>
                    <div className="flex-auto ">
                      <span className="text-muted-foreground gap-1.5 ">Powered by:</span>
                      <a href="https://puter.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Puter.com
                      </a>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <Badge variant="secondary">Version 1.2.0</Badge>
                  </div>
                </div>

                {/* Tips & Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Tips & Features
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-1">🚀 Quick Model Selection</h4>
                      <p className="text-muted-foreground">Use the model selector to quickly switch between different AI models for varied responses.</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-1">🎨 Customization</h4>
                      <p className="text-muted-foreground">Adjust text size, toggle dark mode, and add custom models to personalize your experience.</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-1">💾 Data Management</h4>
                      <p className="text-muted-foreground">Export your chat history or clear it when needed. All settings are saved locally.</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-1">⚡ Performance</h4>
                      <p className="text-muted-foreground">Configure token limits and manage enabled models to optimize performance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Add Model Dialog */}
      <Dialog open={showAddModel} onOpenChange={setShowAddModel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="model-id">Model ID</Label>
              <Input id="model-id" value={newModelId} onChange={e => setNewModelId(e.target.value)} placeholder="e.g., gpt-4-custom" />
            </div>
            <div>
              <Label htmlFor="model-provider">Provider</Label>
              <Input id="model-provider" value={newModelProvider} onChange={e => setNewModelProvider(e.target.value)} placeholder="e.g., OpenAI" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModel(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddModel} disabled={!newModelId.trim() || !newModelProvider.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>;
}