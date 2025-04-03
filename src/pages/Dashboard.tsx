
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FileText, PieChart, Calendar, Users, Brain } from "lucide-react";
import { useAppStore } from "@/store/store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { projects } = useAppStore();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your genetic analyses and polygenic risk scores
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              onClick={() => navigate("/analysis")}
              className="flex items-center gap-2"
            >
              <FileUp className="h-4 w-4" />
              <span>New Analysis</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{projects.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">PRS Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PieChart className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">0</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">LLM Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">0</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-sm">Today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest analyses and reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.slice(0, 5).map(project => (
                        <div key={project.id} className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-primary p-1.5 bg-primary/10 rounded-full" />
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(project.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-auto"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">No analyses yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by creating a new analysis
                      </p>
                      <Button onClick={() => navigate("/analysis")}>
                        New Analysis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Quick actions to help you get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-start gap-4">
                        <FileUp className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium mb-1">Upload Genetic Data</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Upload your genetic data files in VCF, PLINK, or other formats
                          </p>
                          <Button size="sm" onClick={() => navigate("/analysis")}>
                            Upload Files
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-start gap-4">
                        <Brain className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium mb-1">Ask the AI Assistant</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Use our AI assistant to get insights about polygenic risk scores
                          </p>
                          <Button size="sm" variant="outline" onClick={() => navigate("/")}>
                            Chat with AI
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-start gap-4">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium mb-1">Learn About PRS</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Understand how polygenic risk scores work and their implications
                          </p>
                          <Button size="sm" variant="outline" disabled>
                            Coming Soon
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analyses">
            <Card>
              <CardHeader>
                <CardTitle>Your Analyses</CardTitle>
                <CardDescription>
                  All your genetic data analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map(project => (
                      <div key={project.id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(project.created).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No analyses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by creating a new analysis
                    </p>
                    <Button onClick={() => navigate("/analysis")}>
                      New Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>PRS Reports</CardTitle>
                <CardDescription>
                  Your generated polygenic risk score reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No reports generated yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete an analysis to generate PRS reports
                  </p>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
