
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useAppStore } from "@/store/store";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { conversations, createConversation, currentConversationId, setCurrentConversation } = useAppStore();
  
  // Create a default conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      const newConversationId = createConversation();
      setCurrentConversation(newConversationId);
    } else if (!currentConversationId) {
      setCurrentConversation(conversations[0].id);
    }
  }, [conversations, createConversation, currentConversationId, setCurrentConversation]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-grow overflow-hidden">
          <Header />
          <main className="flex-grow overflow-auto p-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
