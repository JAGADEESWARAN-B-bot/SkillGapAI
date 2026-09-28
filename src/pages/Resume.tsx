import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  UploadCloud,
  RefreshCw,
  Copy,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  extractSkillsFromResume,
  SAMPLE_RESUME_DATA_ANALYST,
  SAMPLE_RESUME_FULLSTACK,
} from '../utils/resumeExtractor';
import { SkillBadge } from '../components/SkillBadge';
import { useNavigate } from 'react-router-dom';

export const Resume: React.FC = () => {
  const { bulkAddSkills, updateProfile } = useApp();
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_DATA_ANALYST);
  const [extractedData, setExtractedData] = useState<ReturnType<
    typeof extractSkillsFromResume
  > | null>(() => extractSkillsFromResume(SAMPLE_RESUME_DATA_ANALYST));

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleScan = () => {
    if (!resumeText.trim()) return;
    setIsProcessing(true);
    setSuccessMessage(null);

    setTimeout(() => {
      const result = extractSkillsFromResume(resumeText);
      setExtractedData(result);
      setIsProcessing(false);
    }, 400);
  };

  const handleImport = () => {
    if (!extractedData || extractedData.detectedSkills.length === 0) return;

    // Update profile candidate name / email if detected
    if (extractedData.candidateName) {
      updateProfile({
        name: extractedData.candidateName,
        email: extractedData.email || undefined,
      });
    }

    bulkAddSkills(extractedData.detectedSkills);
    setSuccessMessage(
      `Successfully imported ${extractedData.detectedSkills.length} competencies into your profile!`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-cyan-400" />
          <span>Resume Skill Extractor</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Paste your resume text or load a sample to scan over 70+ technology keywords and normalize them into your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Text Input & Sample Buttons */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300">Resume Plain Text</span>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Load sample:</span>
                <button
                  type="button"
                  onClick={() => {
                    setResumeText(SAMPLE_RESUME_DATA_ANALYST);
                    setExtractedData(extractSkillsFromResume(SAMPLE_RESUME_DATA_ANALYST));
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700"
                >
                  Data Analyst
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResumeText(SAMPLE_RESUME_FULLSTACK);
                    setExtractedData(extractSkillsFromResume(SAMPLE_RESUME_FULLSTACK));
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700"
                >
                  Full Stack
                </button>
              </div>
            </div>

            <textarea
              rows={16}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume markdown, education, work experience, and technical skills here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setResumeText('')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Clear Text
              </button>

              <button
                type="button"
                onClick={handleScan}
                disabled={isProcessing || !resumeText.trim()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? 'Scanning Keywords...' : 'Scan & Extract Skills'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Results */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Detected Competencies</span>
              </h3>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                {extractedData?.detectedSkills.length || 0} Found
              </span>
            </div>

            {/* Candidate Metadata Summary */}
            {extractedData && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                {extractedData.candidateName && (
                  <div className="text-slate-300">
                    <span className="text-slate-500">Candidate:</span>{' '}
                    <span className="font-semibold text-white">{extractedData.candidateName}</span>
                  </div>
                )}
                {extractedData.email && (
                  <div className="text-slate-300">
                    <span className="text-slate-500">Email:</span>{' '}
                    <span className="font-semibold text-cyan-400">{extractedData.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* Skills Pills */}
            <div className="space-y-3 min-h-[180px]">
              {extractedData && extractedData.detectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {extractedData.detectedSkills.map((s) => (
                    <SkillBadge
                      key={s.name}
                      name={s.name}
                      category={s.category}
                      proficiency={s.proficiency}
                      size="sm"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No skills detected yet. Paste resume text and click scan.
                </div>
              )}
            </div>

            {/* Notification alert */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleImport}
                disabled={!extractedData || extractedData.detectedSkills.length === 0}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Add Extracted Skills to Profile</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/analyze')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Run Benchmark Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
