
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useAppStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversations, currentConversationId, updateConversation } = useAppStore();
  
  const currentConversation = conversations.find(
    (conversation) => conversation.id === currentConversationId
  );

  const handleRenameConversation = (newName: string) => {
    if (currentConversationId && newName) {
      updateConversation(currentConversationId, { name: newName });
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
            <h2 className="text-2xl font-bold mb-2">Welcome to QueryCraft!</h2>
            <p className="text-muted-foreground mb-6">
              Ask me anything, upload documents for analysis, or get help with generating reports.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => {
                  const message = "Can you analyze a PDF document for me?";
                  useAppStore.getState().addMessage(currentConversationId, message, "user");
                  
                  setTimeout(() => {
                    const response = "I'd be happy to analyze a PDF for you. Please upload the document, and I'll extract the key information and insights for you.";
                    useAppStore.getState().addMessage(currentConversationId, response, "bot");
                  }, 500);
                }}
              >
                <div>
                  <div className="font-medium">Analyze a PDF</div>
                  <div className="text-sm text-muted-foreground">
                    Extract insights from documents
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => {
                  const message = "I need a report in Excel format";
                  useAppStore.getState().addMessage(currentConversationId, message, "user");
                  
                  setTimeout(() => {
                    const response = "I can help generate a report in Excel format. What kind of data would you like to include in the report?";
                    useAppStore.getState().addMessage(currentConversationId, response, "bot");
                  }, 500);
                }}
              >
                <div>
                  <div className="font-medium">Generate Excel Report</div>
                  <div className="text-sm text-muted-foreground">
                    Create downloadable data reports
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => {
                  const message = "Search for information about machine learning";
                  useAppStore.getState().addMessage(currentConversationId, message, "user");
                  
                  setTimeout(() => {
                    const response = "I'll search for information about machine learning. Could you specify what aspect of machine learning you're interested in?";
                    useAppStore.getState().addMessage(currentConversationId, response, "bot");
                  }, 500);
                }}
              >
                <div>
                  <div className="font-medium">Advanced Search</div>
                  <div className="text-sm text-muted-foreground">
                    Find information on any topic
                  </div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-left h-auto p-4"
                onClick={() => {
                  handleRenameConversation("My First Project");
                }}
              >
                <div>
                  <div className="font-medium">Rename Conversation</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Pencil className="h-3 w-3 mr-1" />
                    <span>Give this chat a title</span>
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
