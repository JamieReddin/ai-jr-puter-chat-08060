import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Declare puter as a global variable
declare global {
  interface Window {
    puter: any;
  }
}

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      if (window.puter && await window.puter.auth.isSignedIn()) {
        navigate('/');
      }
    };
    
    // Wait for puter to be available
    const interval = setInterval(() => {
      if (window.puter) {
        clearInterval(interval);
        checkAuth();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await window.puter.auth.signIn();
      toast({
        title: 'Welcome!',
        description: 'Successfully signed in with Puter.'
      });
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign in. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
              <div className="absolute inset-0 blur-sm bg-primary/30 rounded-full animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JR AI Chat
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Sign in with your Puter account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground text-sm mb-6">
            <p>Access 500+ AI models including GPT-5, Claude, and Gemini.</p>
            <p className="mt-2">One click to start chatting!</p>
          </div>
          
          <Button
            onClick={handleSignIn}
            className="w-full h-12 text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            disabled={loading}
          >
            <LogIn className="mr-2 h-5 w-5" />
            {loading ? 'Signing in...' : 'Sign in with Puter'}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>Powered by Puter Authentication</p>
            <a 
              href="https://puter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline mt-1 inline-block"
            >
              Learn more about Puter
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
