
import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface ProjectMenuProps {
  project: Project;
  isButton?: boolean; // Whether to show as a button or within a context menu
  onSelect?: () => void;
}

export const ProjectMenu = ({ project, isButton = false, onSelect }: ProjectMenuProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const { toast } = useToast();
  const {
    updateProject,
    deleteProject
  } = useAppStore();

  const handleRename = () => {
    if (newName.trim()) {
      updateProject(project.id, { name: newName.trim() });
      setIsRenameDialogOpen(false);
      toast({
        title: "Project renamed",
        description: `Renamed to "${newName.trim()}"`
      });
    }
  };

  const handleDelete = () => {
    deleteProject(project.id);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Project deleted",
      description: "The project has been removed"
    });
  };

  // Component for the rename dialog
  const RenameDialog = (
    <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
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
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          <p className="text-sm text-muted-foreground mt-2">Note: Conversations in this project will not be deleted.</p>
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
              setNewName(project.name);
              setIsRenameDialogOpen(true);
              if (onSelect) onSelect();
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Rename</span>
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
            <div className="w-full h-full group/menu-item" onClick={onSelect}>
              <SidebarMenuButton>
                {project.name || `Project ${project.id.slice(0, 4)}`}
              </SidebarMenuButton>
              <SidebarMenuAction showOnHover>
                <MoreVertical className="h-4 w-4" />
              </SidebarMenuAction>
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => {
            setNewName(project.name);
            setIsRenameDialogOpen(true);
          }}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Rename</span>
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
    </>
  );
};
