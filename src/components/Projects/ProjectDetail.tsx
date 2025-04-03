
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, File, FileUp, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/store/store";
import type { Project } from "@/types";

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteProject, conversations } = useAppStore();

  const projectConversations = conversations.filter(
    (conv) => conv.projectId === project.id
  );

  const handleDeleteProject = () => {
    deleteProject(project.id);
    toast({
      title: "Project deleted",
      description: `${project.name} has been deleted`,
    });
    navigate("/projects");
  };

  // Function to handle file upload - placeholder for now
  const handleFileUpload = () => {
    toast({
      title: "Feature coming soon",
      description: "File upload functionality will be available soon!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">
            Created {formatDistanceToNow(new Date(project.created), { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleFileUpload}
          >
            <FileUp className="h-4 w-4" />
            <span>Upload Files</span>
          </Button>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete Project</span>
          </Button>
        </div>
      </div>

      {project.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="conversations">
        <TabsList>
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversations ({projectConversations.length})
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            Files ({project.files.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="conversations" className="py-4">
          {projectConversations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectConversations.map((conversation) => (
                <Link to="/" key={conversation.id} 
                  onClick={() => useAppStore.getState().setCurrentConversation(conversation.id)}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base hover:text-primary line-clamp-1">
                        {conversation.name}
                      </CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(new Date(conversation.lastUpdated), { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {conversation.messages.length > 0
                          ? conversation.messages[conversation.messages.length - 1].content
                          : "No messages yet"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start a new conversation to analyze data or ask questions related to this project.
              </p>
              <Button 
                variant="default"
                onClick={() => {
                  const conversationId = useAppStore.getState().createConversation(project.id);
                  useAppStore.getState().setCurrentConversation(conversationId);
                  navigate("/");
                }}
              >
                Start New Conversation
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="files" className="py-4">
          {project.files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.files.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      <span className="line-clamp-1">{file.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {file.type}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No files uploaded</h3>
              <p className="text-muted-foreground mb-4">
                Upload PDF files, Excel documents, or other data sources to analyze in this project.
              </p>
              <Button variant="default" onClick={handleFileUpload}>
                Upload Files
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone,
              and all associated conversations will be unlinked from this project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
