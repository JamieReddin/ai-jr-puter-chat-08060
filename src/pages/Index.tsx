import { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  useEffect(() => {
    // Load Puter.js SDK
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <ChatInterface />;
};

export default Index;
