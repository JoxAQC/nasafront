'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { getChatbotResponse } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function ContextualChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await getChatbotResponse({
      history: messages,
      message: input,
    });

    if (result.success && result.data) {
      const modelMessage: Message = { role: 'model', content: result.data };
      setMessages((prev) => [...prev, modelMessage]);
    } else {
      const errorMessage: Message = {
        role: 'model',
        content: "Sorry, I couldn't get a response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <Card className="flex flex-col flex-grow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          Ask Neo
        </CardTitle>
        <CardDescription>
          Your AI assistant for asteroid and impact questions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-4">
        <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 text-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="What is an NEO?"
            className="min-h-[40px] h-10 resize-none"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
