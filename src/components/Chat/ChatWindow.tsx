
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useAppStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Pencil, Search, FileText, FileUp } from "lucide-react";

export function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversations, currentConversationId, updateConversation, addMessage } = useAppStore();
  
  const currentConversation = conversations.find(
    (conversation) => conversation.id === currentConversationId
  );

  const handleRenameConversation = (newName: string) => {
    if (currentConversationId && newName) {
      updateConversation(currentConversationId, { name: newName });
    }
  };

  const handleStarterPrompt = (prompt: string) => {
    if (currentConversationId) {
      // Add user message
      addMessage(currentConversationId, prompt, "user");
      
      // Simulate bot typing
      setTimeout(() => {
        const botResponse = generateMockResponse(prompt);
        addMessage(currentConversationId, botResponse, "bot");
      }, 1000);
    }
  };

  // Mock response generator - this will be replaced with actual API calls
  const generateMockResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    } else if (lowercaseMessage.includes("pdf") || lowercaseMessage.includes("analyze")) {
      return "I'd be happy to analyze a PDF for you. Please upload the file and I'll extract the relevant information.";
    } else if (lowercaseMessage.includes("excel") || lowercaseMessage.includes("report")) {
      return "I can generate Excel reports based on your data. What kind of report would you like to create?";
    } else if (lowercaseMessage.includes("search") || lowercaseMessage.includes("find")) {
      return "I can search for information for you. What are you looking for specifically?";
    } else if (lowercaseMessage.includes("polygenic") || lowercaseMessage.includes("risk") || lowercaseMessage.includes("score")) {
      return "I can help you with polygenic risk score analysis. Would you like to upload genetic data or learn more about PRS interpretation?";
    } else if (lowercaseMessage.includes("genetic") || lowercaseMessage.includes("dna") || lowercaseMessage.includes("genome")) {
      return "I can assist with genetic data analysis. Do you have specific genetic markers you'd like to analyze or are you looking for a comprehensive report?";
    } else {
      return "I understand you need assistance with polygenic risk scores. Could you provide more details about what you're looking for?";
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  if (!currentConversation) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p>No conversation selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {currentConversation.messages.length === 0 ? (
        <div className="flex flex-col flex-grow items-center justify-center p-6">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to Polygenic Risk Score Automation</h2>
            <p className="text-muted-foreground mb-6">
              Upload genetic data for analysis, get help interpreting risk scores, or generate comprehensive reports.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => handleStarterPrompt("I need to analyze a genomic dataset for polygenic risk scoring")}
              >
                <div className="flex items-start">
                  <FileUp className="h-5 w-5 mr-3 mt-1 text-primary" />
                  <div>
                    <div className="font-medium">Analyze Genomic Data</div>
                    <div className="text-sm text-muted-foreground">
                      Upload and process genetic datasets
                    </div>
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => handleStarterPrompt("Generate a polygenic risk score report for my dataset")}
              >
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 mt-1 text-primary" />
                  <div>
                    <div className="font-medium">Generate PRS Report</div>
                    <div className="text-sm text-muted-foreground">
                      Create detailed risk assessment reports
                    </div>
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => handleStarterPrompt("Search for information about polygenic risk scoring methods")}
              >
                <div className="flex items-start">
                  <Search className="h-5 w-5 mr-3 mt-1 text-primary" />
                  <div>
                    <div className="font-medium">PRS Knowledge Base</div>
                    <div className="text-sm text-muted-foreground">
                      Find information on risk scoring techniques
                    </div>
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => {
                  handleRenameConversation("My PRS Analysis");
                }}
              >
                <div className="flex items-start">
                  <Pencil className="h-5 w-5 mr-3 mt-1 text-primary" />
                  <div>
                    <div className="font-medium">Rename Conversation</div>
                    <div className="text-sm text-muted-foreground">
                      Give this analysis a descriptive title
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-grow">
          <div className="pb-[80px]">
            {currentConversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      )}
      <ChatInput />
    </div>
  );
}
