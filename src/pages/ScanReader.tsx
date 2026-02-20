import { useState } from "react";
import { FileSearch, BookOpen, MessageCircleQuestion, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import AnalysisLoading from "@/components/AnalysisLoading";
import AudioBriefingPlayer from "@/components/AudioBriefingPlayer";

type AnalysisState = "idle" | "loading" | "done";

// Mock results for prototype
const mockResults = {
  summary:
    "Your CT scan report mentions a **1.2 cm pulmonary nodule** in the right upper lobe. This is a small growth in your lung that was found during imaging. Most nodules this size are benign (not cancer), but your doctor will want to monitor it with follow-up scans.",
  terms: [
    { term: "Pulmonary nodule", definition: "A small, round growth in the lung, usually less than 3 cm. Most are benign." },
    { term: "Right upper lobe", definition: "The top section of your right lung." },
    { term: "Ground-glass opacity", definition: "An area that looks hazy on the scan — like frosted glass. It can have many causes." },
  ],
  questions: [
    "Is this nodule something we need to biopsy, or can we watch it with follow-up scans?",
    "How often should I get follow-up imaging, and for how long?",
    "Are there any symptoms I should watch for in the meantime?",
    "Based on the size and appearance, what's the likelihood this is cancerous?",
  ],
  resources: [
    { title: "NCI: Lung Nodules", url: "https://www.cancer.gov/types/lung" },
    { title: "Understanding Your CT Scan Results", url: "https://www.cancer.gov/about-cancer/diagnosis-staging" },
  ],
};

const ScanReader = () => {
  const [state, setState] = useState<AnalysisState>("idle");

  const handleFileSelect = (_file: File) => {
    setState("loading");
    // Simulate API call
    setTimeout(() => setState("done"), 3000);
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-10 md:py-16 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
            <FileSearch className="h-4 w-4" />
            ScanReader
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Understand your scan results
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Upload your radiology or pathology report and we'll explain what it means in plain English — no medical degree required.
          </p>
        </div>

        {/* Upload */}
        {state === "idle" && (
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              label="Upload your report"
              description="Drop a PDF or image of your radiology/pathology report"
            />
            <p className="text-xs text-muted-foreground text-center">
              Supported: PDF, JPG, PNG • Your file is analyzed securely and never stored
            </p>
          </div>
        )}

        {/* Loading */}
        {state === "loading" && (
          <AnalysisLoading
            message="Reading your report..."
            submessage="Our medical AI is carefully analyzing your scan. This usually takes about 30 seconds."
          />
        )}

        {/* Results */}
        {state === "done" && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Audio */}
            <AudioBriefingPlayer label="Listen to your scan explanation" audioUrl="" isGenerating={false} />

            {/* Plain English summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <BookOpen className="h-5 w-5 text-primary" />
                  What your report says
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-foreground whitespace-pre-line">
                  {mockResults.summary}
                </p>
              </CardContent>
            </Card>

            {/* Key terms */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Key terms explained</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockResults.terms.map((t) => (
                  <div key={t.term} className="rounded-lg bg-muted p-3">
                    <p className="font-semibold text-sm">{t.term}</p>
                    <p className="text-sm text-muted-foreground">{t.definition}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Questions to ask */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <MessageCircleQuestion className="h-5 w-5 text-primary" />
                  Questions to ask your doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {mockResults.questions.map((q, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Trusted resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockResults.resources.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {r.title}
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Restart */}
            <div className="text-center">
              <Button variant="outline" onClick={() => setState("idle")}>
                Analyze another report
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScanReader;
