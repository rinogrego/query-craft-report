
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { FileText, FolderKanban, MessageSquare } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <Link to={`/projects/${project.id}`}>
          <CardTitle className="text-lg font-semibold truncate hover:text-primary">
            <FolderKanban className="h-4 w-4 inline mr-2" />
            {project.name}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {project.description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col items-start gap-2">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {project.conversations.length} conversation{project.conversations.length !== 1 ? "s" : ""}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {project.files.length} file{project.files.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Updated {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}
