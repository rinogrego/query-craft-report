
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/Layout/AppLayout";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { useAppStore } from "@/store/store";

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, setSelectedProject } = useAppStore();

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId, setSelectedProject]);

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    // Project not found, redirect to projects page
    useEffect(() => {
      navigate("/projects");
    }, [navigate]);

    return null;
  }

  return (
    <AppLayout>
      <div className="container py-6">
        <ProjectDetail project={project} />
      </div>
    </AppLayout>
  );
};

export default ProjectPage;
