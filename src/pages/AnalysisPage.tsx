
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, CheckCircle, AlertCircle, FileText, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store";
import { useToast } from "@/hooks/use-toast";

const AnalysisPage = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [analysisName, setAnalysisName] = useState("");
  const [analysisDescription, setAnalysisDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createProject } = useAppStore();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter for genomic data file types
    const validFiles = newFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['vcf', 'bed', 'bim', 'fam', 'plink', 'pgen', 'psam', 'pvar', 'csv', 'txt'].includes(extension || '');
    });
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Some files were not added",
        description: "Only genomic data files (VCF, PLINK, CSV, etc.) are supported.",
        variant: "destructive"
      });
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const createAnalysis = () => {
    if (!analysisName) {
      toast({
        title: "Analysis name required",
        description: "Please provide a name for your analysis.",
        variant: "destructive"
      });
      return;
    }
    
    if (files.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one file for analysis.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Create a new project to store this analysis
    const projectId = createProject(analysisName, analysisDescription);
    
    // Simulate file upload and processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Analysis created",
        description: "Your files have been uploaded and the analysis has started.",
      });
      navigate(`/projects/${projectId}`);
    }, 1500);
    
    // Note: In a real implementation, we would upload the files to Supabase storage
    // and create records in the database for tracking the analysis
  };

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">New Analysis</h1>
          <p className="text-muted-foreground">
            Upload genetic data files to calculate polygenic risk scores
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="configure">Configure Analysis</TabsTrigger>
            <TabsTrigger value="review">Review & Submit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Genetic Data</CardTitle>
                  <CardDescription>
                    Upload your genetic data files for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Drag and drop files here</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports VCF, PLINK (BED/BIM/FAM), PGEN, and other genomic data formats
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Select Files
                    </Button>
                    <input 
                      type="file" 
                      id="file-upload" 
                      multiple 
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Uploaded Files ({files.length})</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-card/50 p-2 rounded border">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("configure")}
                    disabled={files.length === 0}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Supported File Types</CardTitle>
                  <CardDescription>
                    Information about supported genomic data formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">VCF Files</h4>
                        <p className="text-sm text-muted-foreground">
                          Variant Call Format (VCF) files containing genomic variants
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">PLINK Files</h4>
                        <p className="text-sm text-muted-foreground">
                          BED/BIM/FAM files from PLINK, a common tool for whole genome association analysis
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">PLINK 2 Files</h4>
                        <p className="text-sm text-muted-foreground">
                          PGEN/PSAM/PVAR files from PLINK 2, supporting larger datasets and improved performance
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">CSV/TSV Files</h4>
                        <p className="text-sm text-muted-foreground">
                          Comma or tab-separated files with genomic data in a tabular format
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 mt-6">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">File Size Limits</h4>
                        <p className="text-sm text-muted-foreground">
                          Files should be under 5GB per file. For larger datasets, please contact support.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="configure">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Details</CardTitle>
                  <CardDescription>
                    Provide information about your analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="analysis-name" className="text-sm font-medium">
                        Analysis Name <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        id="analysis-name"
                        placeholder="e.g., Heart Disease PRS Analysis"
                        value={analysisName}
                        onChange={(e) => setAnalysisName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="analysis-description" className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea 
                        id="analysis-description"
                        placeholder="Describe the purpose and contents of this analysis..."
                        rows={4}
                        value={analysisDescription}
                        onChange={(e) => setAnalysisDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost"
                    onClick={() => setActiveTab("upload")}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("review")}
                    disabled={!analysisName}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Ask questions about polygenic risk scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-4 bg-card/50">
                    <div className="flex items-start gap-3 mb-4">
                      <Brain className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-medium">PRS Analysis Help</h4>
                        <p className="text-sm text-muted-foreground">
                          Our AI assistant can guide you through the PRS analysis process
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        What is a polygenic risk score?
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        How are risk scores calculated?
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        What file formats work best for my analysis?
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Ask AI Assistant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Review Analysis</CardTitle>
                <CardDescription>
                  Review and submit your analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Analysis Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                        <p>{analysisName || "Untitled Analysis"}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                        <p>{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <p className="text-sm">{analysisDescription || "No description provided."}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Files</h3>
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted p-2 text-sm font-medium flex">
                        <div className="flex-1">Filename</div>
                        <div className="w-24 text-right">Size</div>
                      </div>
                      {files.map((file, index) => (
                        <div key={index} className="p-2 border-t flex items-center">
                          <div className="flex-1 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <div className="w-24 text-sm text-right text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Processing Information</h4>
                        <p className="text-sm text-muted-foreground">
                          After submission, your files will be uploaded and processed. Depending on the size and complexity, 
                          analysis may take from a few minutes to several hours. You'll receive a notification when 
                          your PRS results are ready.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab("configure")}
                >
                  Back
                </Button>
                <Button 
                  onClick={createAnalysis}
                  disabled={!analysisName || files.length === 0 || loading}
                >
                  {loading ? "Processing..." : "Start Analysis"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalysisPage;
