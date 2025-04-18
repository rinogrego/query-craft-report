
import { Plus, FolderKanban, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/store";
import { Separator } from "@/components/ui/separator";
import { NewProjectDialog } from "@/components/Projects/NewProjectDialog";
import { ConversationMenu } from "@/components/Chat/ConversationMenu";
import { ProjectMenu } from "@/components/Projects/ProjectMenu";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  
  const { 
    conversations, 
    projects, 
    createConversation, 
    setCurrentConversation,
    setSelectedProject,
    currentConversationId
  } = useAppStore();

  const handleNewConversation = () => {
    const conversationId = createConversation();
    setCurrentConversation(conversationId);
    navigate("/");
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    navigate("/");
  };

  const handleSelectProject = (id: string) => {
    setSelectedProject(id);
    navigate(`/projects/${id}`);
  };

  return (
    <>
      <Sidebar>
        <SidebarContent className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-sidebar-foreground">Polygenic Risk Score</h1>
            <SidebarTrigger />
          </div>
          
          <div className="p-2">
            <Button 
              variant="default" 
              className="w-full justify-start bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              onClick={handleNewConversation}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>
          
          <ScrollArea className="flex-grow">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70">
                Conversations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <ConversationMenu 
                        conversation={conversation}
                        onSelect={() => handleSelectConversation(conversation.id)}
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="my-4 bg-sidebar-border/50" />

            <SidebarGroup>
              <div className="flex items-center justify-between px-4 py-2">
                <SidebarGroupLabel className="text-sidebar-foreground/70">
                  Projects
                </SidebarGroupLabel>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => setIsNewProjectDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <ProjectMenu
                        project={project}
                        onSelect={() => handleSelectProject(project.id)}
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>

      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onOpenChange={setIsNewProjectDialogOpen}
      />
    </>
  );
};

export default AppSidebar;
