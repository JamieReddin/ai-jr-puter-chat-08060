import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
interface TokenUsageBarProps {
  currentMessageTokens: number;
  sessionTokens: number;
}
const MAX_PUTER_TOKENS = 50_000_000; // 50M tokens

export function TokenUsageBar({
  currentMessageTokens,
  sessionTokens
}: TokenUsageBarProps) {
  const [puterTokensRemaining, setPuterTokensRemaining] = useState<number>(() => {
    const stored = localStorage.getItem('puterTokensRemaining');
    return stored ? parseInt(stored) : MAX_PUTER_TOKENS;
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState(puterTokensRemaining.toString());
  useEffect(() => {
    localStorage.setItem('puterTokensRemaining', puterTokensRemaining.toString());
  }, [puterTokensRemaining]);
  const handleUpdateTokens = () => {
    const newValue = parseInt(inputValue);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= MAX_PUTER_TOKENS) {
      setPuterTokensRemaining(newValue);
      setIsDialogOpen(false);
    }
  };
  const puterUsagePercentage = (MAX_PUTER_TOKENS - puterTokensRemaining) / MAX_PUTER_TOKENS * 100;
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
  };
  return <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground w-full">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span>Current:</span>
          <Badge variant="outline" className="text-xs">
            {formatNumber(currentMessageTokens)} tokens
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span>Session:</span>
          <Badge variant="outline" className="text-xs">
            {formatNumber(sessionTokens)} tokens
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
        <span className="whitespace-nowrap text-justify">Puter:</span>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-4 px-2 text-xs hover:bg-accent flex-1 sm:flex-initial text-justify">
              <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
                <Progress value={puterUsagePercentage} className="w-16 sm:w-24 h-2 flex-shrink-0" />
                <span className="truncate text-xs">{formatNumber(puterTokensRemaining)} left</span>
                <Zap className="h-3 w-3 flex-shrink-0" />
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Update Puter Token Balance
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokens">Tokens Remaining (out of 50M)</Label>
                <Input id="tokens" type="number" min="0" max={MAX_PUTER_TOKENS} value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Enter remaining tokens" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Progress value={puterUsagePercentage} className="flex-1" />
                <span>{puterUsagePercentage.toFixed(1)}% used</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTokens}>
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
}