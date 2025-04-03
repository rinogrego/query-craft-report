
import { format } from "date-fns";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "bot";

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isBot ? "bg-secondary/50" : ""
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm",
        isBot ? "bg-bot text-white" : "bg-user text-white"
      )}>
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="font-semibold">{isBot ? "QueryCraft" : "You"}</div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(message.timestamp), "HH:mm")}
          </div>
        </div>
        <div className="prose prose-sm max-w-none">
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
}
