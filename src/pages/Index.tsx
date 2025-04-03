
import { useEffect, useState } from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { ChatWindow } from "@/components/Chat/ChatWindow";
import AppLayout from "@/components/Layout/AppLayout";
import { useAppStore } from "@/store/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Starter prompts for new conversations
const STARTER_PROMPTS = [
  "Analyze my genomic data for polygenic risk scores",
  "Explain how polygenic risk scores work",
  "What genetic variants are associated with condition X?",
  "Help me interpret my PRS results",
  "Compare my results with population averages"
];

const Index = () => {
  const { currentConversationId, conversations, createConversation, setCurrentConversation, addMessage } = useAppStore();
  const [showPrompts, setShowPrompts] = useState(false);
  
  // Set page title
  useEffect(() => {
    document.title = "Polygenic Risk Score Automation";
  }, []);
  
  // Ensure there's a current conversation
  useEffect(() => {
    if (conversations.length === 0) {
      const newConversationId = createConversation();
      setCurrentConversation(newConversationId);
      setShowPrompts(true);
    } else if (!currentConversationId) {
      setCurrentConversation(conversations[0].id);
    } else {
      // Check if the current conversation has no messages
      const currentConversation = conversations.find(c => c.id === currentConversationId);
      if (currentConversation && currentConversation.messages.length === 0) {
        setShowPrompts(true);
      }
    }
  }, [conversations, createConversation, currentConversationId, setCurrentConversation]);

  const handlePromptClick = (prompt: string) => {
    if (currentConversationId) {
      addMessage(currentConversationId, prompt, 'user');
      setShowPrompts(false);
    }
  };

  return (
    <AppLayout>
      {showPrompts ? (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Welcome to Polygenic Risk Score Automation</h1>
              <p className="text-muted-foreground">Choose a starter prompt or type your own question</p>
            </div>
            
            <div className="grid gap-3">
              {STARTER_PROMPTS.map((prompt, index) => (
                <Card key={index} className="border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between" onClick={() => handlePromptClick(prompt)}>
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-3 text-primary/70" />
                      <span>{prompt}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setShowPrompts(false)}
            >
              Skip and start typing
            </Button>
          </div>
        </div>
      ) : (
        <ChatWindow />
      )}
    </AppLayout>
  );
};

export default Index;
