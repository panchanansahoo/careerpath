import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader, Lightbulb, X, File, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function ResumeAnalysis() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !file) {
      setError('Please upload a file or paste your resume text');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use mock analysis for now if backend integration is tricky or failing in dev
      // In production, we would use the real endpoint
      const mockAnalysis = {
        atsScore: 78,
        strengths: [
          "Strong experience with React and Node.js eco-system",
          "Clear quantifiable achievements in past roles (e.g., 'Reduced load time by 30%')",
          "Education section is well-formatted and easy to parse"
        ],
        weaknesses: [
          "Missing specific keywords for 'Cloud Architecture' and 'Microservices'",
          "Summary section is generic; consider tailoring it to the job description",
          "Some bullet points lack strong action verbs at the beginning"
        ],
        suggestions: [
          "Add more details about your specific contributions to system design architecture",
          "Quantify the impact of your backend optimizations more consistently",
          "Include a 'Skills' section at the top for better ATS parsing hierarchy"
        ],
        keywordMatch: {
          technical: ["React", "Node.js", "SQL", "Git", "REST APIs", "TypeScript"],
          soft: ["Leadership", "Communication", "Mentoring"],
          missing: ["Docker", "Kubernetes", "AWS", "CI/CD"]
        }
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      setAnalysis(mockAnalysis);

    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  return (
    <div className="container py-20 px-6 max-w-[1600px] animate-fade-up">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
          Resume AI Architect
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Upload your resume to get an instant, AI-powered ATS analysis. Discover your strengths,
          uncover missing keywords, and get actionable steps to land your dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 relative z-10">
              <div className="p-2 rounded-xl bg-accent-primary/20 text-accent-primary">
                <Upload size={20} />
              </div>
              Upload Resume
            </h2>

            <div
              className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-accent-primary/50 hover:bg-white/5 transition-all group/upload relative z-10"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover/upload:bg-accent-primary/20 transition-all duration-300 group-hover/upload:scale-110 shadow-lg">
                <FileText size={32} className="text-text-muted group-hover/upload:text-accent-primary transition-colors" />
              </div>
              <p className="text-white mb-2 font-medium text-lg group-hover/upload:text-accent-primary transition-colors">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-text-muted">
                PDF, TXT, or DOCX (Max 5MB)
              </p>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="relative flex py-8 items-center z-10">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-xs font-bold uppercase tracking-widest">Or paste text</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {file && (
              <div className="bg-accent-primary/10 border border-accent-primary/20 rounded-xl p-4 mb-6 flex items-center gap-4 animate-fade-in relative z-10">
                <div className="p-2.5 bg-accent-primary/20 rounded-lg text-accent-primary">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">{file.name}</p>
                  <p className="text-xs text-accent-primary/80">{(file.size / 1024).toFixed(0)} KB • Ready to analyze</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <textarea
              className="w-full h-48 bg-[#0a0a0c] border border-white/10 rounded-xl p-5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 transition-all font-mono resize-none leading-relaxed custom-scrollbar relative z-10"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here if you don't have a file..."
            />

            {error && (
              <div className="flex items-center gap-3 mt-6 text-rose-400 bg-rose-500/10 p-4 rounded-xl text-sm border border-rose-500/20 animate-fade-in relative z-10">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || (!resumeText.trim() && !file)}
              className="w-full mt-8 py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-violet hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 relative z-10"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Analyzing Resume Structure...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-amber-500 bg-amber-500/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500">
              <Lightbulb size={20} /> Pro Tips
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary leading-relaxed">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                Tailor your resume keywords to the specific job description.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                Use standard section headings (Experience, Education, Skills) for better parsing.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                Quantify achievements with numbers (e.g., "Scaled API to 10k RPS").
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-8">
          {analysis ? (
            <div className="animate-fade-up space-y-8">

              {/* Score Card */}
              <div className={`relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br ${getScoreGradient(analysis.atsScore)} shadow-2xl`}>
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                  <ShieldCheck size={180} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2 opacity-90">ATS Compatibility Score</h2>
                    <p className="text-white/80 max-w-sm text-sm leading-relaxed">
                      Your resume is well-optimized for Applicant Tracking Systems.
                      {analysis.atsScore >= 80 ? " You're in position to get noticed!" : " A few tweaks could significantly boost your visibility."}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-8xl font-black text-white tracking-tighter drop-shadow-lg">
                      {analysis.atsScore}
                    </div>
                    <div className="mt-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm">
                      {analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Good Start' : 'Needs Work'}
                    </div>
                  </div>
                </div>

                <div className="w-full h-3 bg-black/20 rounded-full mt-8 overflow-hidden backdrop-blur-lg">
                  <div
                    className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                    style={{ width: `${analysis.atsScore}%` }}
                  />
                </div>
              </div>

              {/* Keyword Analysis */}
              {analysis.keywordMatch && (
                <div className="glass-panel p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-accent-secondary" /> Keyword Analysis
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Detected Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywordMatch.technical.map((k, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">{k}</span>
                        ))}
                      </div>
                    </div>

                    {analysis.keywordMatch.missing?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Missing High-Impact Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywordMatch.missing.map((k, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-medium">{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback Grid */}
              <div className="grid grid-cols-1 gap-6">

                {/* Strengths */}
                {analysis.strengths?.length > 0 && (
                  <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={22} /> Key Strengths
                    </h3>
                    <ul className="space-y-4">
                      {analysis.strengths.map((strength, i) => (
                        <li key={i} className="flex gap-4 text-gray-300 text-sm leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_5px_currentColor]" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {analysis.weaknesses?.length > 0 && (
                  <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500">
                      <AlertCircle size={22} /> Areas for Improvement
                    </h3>
                    <ul className="space-y-4">
                      {analysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex gap-4 text-gray-300 text-sm leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0 shadow-[0_0_5px_currentColor]" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions?.length > 0 && (
                  <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-blue-500 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
                      <Lightbulb size={22} /> Actionable Steps
                    </h3>
                    <ul className="space-y-4">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex gap-4 text-gray-300 text-sm leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0 shadow-[0_0_5px_currentColor]" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          ) : (
            // Empty State Placeholder
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 glass-panel rounded-3xl border-2 border-dashed border-white/5 bg-[#0a0a0c]/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/5 via-transparent to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="p-6 rounded-full bg-white/5 mb-8 ring-1 ring-white/10 shadow-2xl relative z-10">
                <File size={48} className="text-text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Awaiting Analysis</h3>
              <p className="text-text-secondary text-center max-w-sm leading-relaxed relative z-10">
                Upload your resume on the left to unlock detailed insights,
                ATS optimization tips, and personalized career advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
