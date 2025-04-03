
import { useState, FormEvent } from "react";
import { Send, FileUp, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  const { toast } = useToast();
  const { currentConversationId, addMessage } = useAppStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentConversationId) return;
    
    // Add user message
    addMessage(currentConversationId, message, "user");
    setMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateMockResponse(message);
      addMessage(currentConversationId, botResponse, "bot");
      setIsTyping(false);
    }, 1000);
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

  const handleUpload = () => {
    toast({
      title: "Feature coming soon",
      description: "Genomic data upload functionality will be available soon!",
    });
  };

  const handleSearchClick = () => {
    toast({
      title: "Feature coming soon",
      description: "Advanced genomic data search functionality will be available soon!",
    });
  };

  const handleIntentForm = () => {
    toast({
      title: "Feature coming soon",
      description: "PRS analysis form functionality will be available soon!",
    });
  };

  const starterPrompts = [
    {
      title: "Analyze genetic data",
      prompt: "I need to analyze a genomic dataset for polygenic risk scoring"
    },
    {
      title: "Generate a risk report",
      prompt: "Generate a polygenic risk score report for my dataset"
    },
    {
      title: "Compare risk models",
      prompt: "Help me compare different polygenic risk score models for cardiovascular disease"
    },
    {
      title: "Explain PRS concepts",
      prompt: "Explain how polygenic risk scores work and their limitations"
    }
  ];

  const handleStarterPrompt = (prompt: string) => {
    setMessage(prompt);
    setIsPromptsOpen(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t bg-background p-4"
    >
      {isTyping && (
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Bot className="h-4 w-4 mr-2 text-primary animate-pulse" />
          <span>PRS Assistant is typing</span>
          <span className="flex ml-1">
            <span className="h-1.5 w-1.5 bg-primary rounded-full mr-0.5 animate-typing" style={{ animationDelay: "0ms" }}></span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full mr-0.5 animate-typing" style={{ animationDelay: "200ms" }}></span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: "400ms" }}></span>
          </span>
        </div>
      )}

      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[80px] resize-none pr-20 overflow-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleUpload}
                >
                  <FileUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upload genomic data</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchClick}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Advanced search</TooltipContent>
            </Tooltip>
            
            <Popover open={isPromptsOpen} onOpenChange={setIsPromptsOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Starter prompts</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent className="w-[250px] p-0" align="end">
                <div className="p-2 bg-muted/50">
                  <h3 className="font-medium text-sm">Starter Prompts</h3>
                </div>
                <div className="p-2 max-h-[200px] overflow-y-auto">
                  {starterPrompts.map((item, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start text-left px-2 py-1.5 h-auto text-sm"
                      onClick={() => handleStarterPrompt(item.prompt)}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  );
}

function Bot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8"></path>
      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
      <path d="M2 14h2"></path>
      <path d="M20 14h2"></path>
      <path d="M15 13v2"></path>
      <path d="M9 13v2"></path>
    </svg>
  );
}
