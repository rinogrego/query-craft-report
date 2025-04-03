
import { useState, FormEvent, useRef, useEffect } from "react";
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
import { llmService } from "@/components/LLM/LLMService";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const { currentConversationId, addMessage } = useAppStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"; // Reset height
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentConversationId) return;
    
    // Add user message
    addMessage(currentConversationId, message, "user");
    setMessage("");
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // In a real implementation, this would call the LLM service via Supabase
      // For now, we'll use our mock implementation
      const response = await llmService.generateResponse(message);
      
      // Add bot response
      addMessage(currentConversationId, response, "bot");
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
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
          <span>PRS Assistant is thinking</span>
          <span className="flex ml-1">
            <span className="h-1.5 w-1.5 bg-primary rounded-full mr-0.5 animate-typing" style={{ animationDelay: "0ms" }}></span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full mr-0.5 animate-typing" style={{ animationDelay: "200ms" }}></span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: "400ms" }}></span>
          </span>
        </div>
      )}

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about polygenic risk scores, genetic variants, or analysis methods..."
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
              <TooltipContent>Upload genetic data</TooltipContent>
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
              <TooltipContent>Search PRS literature</TooltipContent>
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
              <TooltipContent>PRS analysis form</TooltipContent>
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
