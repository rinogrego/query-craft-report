
import { useState, useRef } from "react";
import { MoreVertical, Pencil, Trash2, FolderKanban } from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { Conversation } from "@/types";
import { Project } from "@/types";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface ConversationMenuProps {
  conversation: Conversation;
  isButton?: boolean; // Whether to show as a button or within a context menu
  onSelect?: () => void;
}

export const ConversationMenu = ({ conversation, isButton = false, onSelect }: ConversationMenuProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);
  const [newName, setNewName] = useState(conversation.name);
  const { toast } = useToast();
  const {
    updateConversation,
    deleteConversation,
    projects,
    linkConversationToProject
  } = useAppStore();

  const handleRename = () => {
    if (newName.trim()) {
      updateConversation(conversation.id, { name: newName.trim() });
      setIsRenameDialogOpen(false);
      toast({
        title: "Conversation renamed",
        description: `Renamed to "${newName.trim()}"`
      });
    }
  };

  const handleDelete = () => {
    deleteConversation(conversation.id);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Conversation deleted",
      description: "The conversation has been removed"
    });
  };

  const handleLinkToProject = (projectId: string) => {
    linkConversationToProject(conversation.id, projectId);
    setIsProjectPopoverOpen(false);
    toast({
      title: "Added to project",
      description: `Conversation added to ${projects.find(p => p.id === projectId)?.name || "project"}`
    });
  };

  // Component for the rename dialog
  const RenameDialog = (
    <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            placeholder="Enter new name"
            className="w-full"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Component for the delete dialog
  const DeleteDialog = (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Component for the project selection
  const ProjectSelector = (
    <Popover open={isProjectPopoverOpen} onOpenChange={setIsProjectPopoverOpen}>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="text-sm font-medium mb-2">Add to Project</div>
        {projects.length === 0 ? (
          <div className="text-sm text-muted-foreground py-1 px-2">
            No projects available
          </div>
        ) : (
          <div className="space-y-1">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleLinkToProject(project.id)}
              >
                <FolderKanban className="mr-2 h-4 w-4" />
                <span className="truncate">{project.name}</span>
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );

  // Render as a dropdown menu button
  if (isButton) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setNewName(conversation.name);
              setIsRenameDialogOpen(true);
              if (onSelect) onSelect();
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setIsProjectPopoverOpen(true);
              if (onSelect) onSelect();
            }}>
              <FolderKanban className="mr-2 h-4 w-4" />
              <span>Add to Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => {
              setIsDeleteDialogOpen(true);
              if (onSelect) onSelect();
            }}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {RenameDialog}
        {DeleteDialog}
        {ProjectSelector}
      </>
    );
  }

  // Render as a context menu
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="w-full h-full block">
          {/* children will be wrapped in this trigger */}
          {onSelect && (
            <div className="w-full h-full" onClick={onSelect}>
              <SidebarMenuButton>
                {conversation.name || `Conversation ${conversation.id.slice(0, 4)}`}
              </SidebarMenuButton>
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => {
            setNewName(conversation.name);
            setIsRenameDialogOpen(true);
          }}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsProjectPopoverOpen(true)}>
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Add to Project</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {RenameDialog}
      {DeleteDialog}
      {ProjectSelector}
    </>
  );
};
