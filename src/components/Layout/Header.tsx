
import { useLocation } from "react-router-dom";
import { Search, FileUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/store";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { currentConversationId, conversations, projects, selectedProjectId } = useAppStore();
  
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId) 
    : null;
  
  const currentProject = selectedProjectId && location.pathname.includes('/projects/')
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        {isMobile && (
          <SidebarTrigger className="mr-2" />
        )}
        
        <div className="flex items-center flex-1">
          <h1 className="text-lg font-semibold">
            {location.pathname === "/" && currentConversation 
              ? currentConversation.name 
              : location.pathname.includes('/projects/') && currentProject
                ? currentProject.name
                : location.pathname === "/projects"
                  ? "Projects"
                  : "QueryCraft"}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {location.pathname === "/" && (
            <div className="hidden md:flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Search messages..."
                className="w-[250px]"
              />
              <Button size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <FileUp className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
