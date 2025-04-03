
import { useEffect } from "react";
import { ChatWindow } from "@/components/Chat/ChatWindow";
import AppLayout from "@/components/Layout/AppLayout";
import { useAppStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileUp, Database, LineChart, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { currentConversationId, conversations, createConversation, setCurrentConversation } = useAppStore();
  
  // Ensure there's a current conversation
  useEffect(() => {
    if (conversations.length === 0) {
      const newConversationId = createConversation();
      setCurrentConversation(newConversationId);
    } else if (!currentConversationId) {
      setCurrentConversation(conversations[0].id);
    }
  }, [conversations, createConversation, currentConversationId, setCurrentConversation]);

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="container py-12 px-4 md:px-6 flex-grow flex flex-col items-center justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4 inline-block p-2 bg-primary/10 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Polygenic Risk Score Automation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Leverage AI to analyze genetic data and calculate polygenic risk scores with advanced machine learning techniques
            </p>
            <div className="grid gap-4 md:grid-cols-2 mb-12">
              <Link to="/dashboard">
                <Button size="lg" className="w-full gap-2">
                  Go to Dashboard <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/analysis">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  Start New Analysis <LineChart className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <FileUp className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium text-lg mb-2">Upload Genetic Data</h3>
                <p className="text-muted-foreground text-sm">
                  Upload genomic data files in VCF, PLINK, or other standard formats for analysis
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <Database className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium text-lg mb-2">Secure Storage</h3>
                <p className="text-muted-foreground text-sm">
                  Your data is securely stored in Supabase with end-to-end encryption and GDPR compliance
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium text-lg mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced AI models help interpret genetic variants and polygenic risk scores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
