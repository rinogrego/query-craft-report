
import { useEffect } from "react";
import { ChatWindow } from "@/components/Chat/ChatWindow";
import AppLayout from "@/components/Layout/AppLayout";
import { useAppStore } from "@/store/store";

const Index = () => {
  const { currentConversationId, conversations, createConversation, setCurrentConversation } = useAppStore();
  
  // Ensure there's a current conversation
  useEffect(() => {
    if (conversations.length === 0) {
      const newConversationId = createConversation();
      setCurrentConversation(newConversationId);
    } else if (!currentConversationId) {
      setCurrentConversation(conversations[0].id);
    }
  }, [conversations, createConversation, currentConversationId, setCurrentConversation]);

  return (
    <AppLayout>
      <ChatWindow />
    </AppLayout>
  );
};

export default Index;
