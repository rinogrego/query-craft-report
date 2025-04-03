
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

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
    } else {
      return "I understand you need assistance. Could you provide more details about what you're looking for?";
    }
  };

  const handleUpload = () => {
    toast({
      title: "Feature coming soon",
      description: "File upload functionality will be available soon!",
    });
  };

  const handleSearchClick = () => {
    toast({
      title: "Feature coming soon",
      description: "Advanced search functionality will be available soon!",
    });
  };

  const handleIntentForm = () => {
    toast({
      title: "Feature coming soon",
      description: "User intent form functionality will be available soon!",
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t bg-background p-4"
    >
      {isTyping && (
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Bot className="h-4 w-4 mr-2 text-primary animate-pulse" />
          <span>QueryCraft is typing</span>
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
              <TooltipContent>Upload file</TooltipContent>
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
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleIntentForm}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Intent form</TooltipContent>
            </Tooltip>
            
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
