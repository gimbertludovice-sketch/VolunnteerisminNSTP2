import React, { useState } from 'react';
import { NSTP_2_SLIDES } from '../data/slidesData';
import { Play, Download, ChevronLeft, ChevronRight, Layers, FileText, CheckCircle2, Heart } from 'lucide-react';

interface PresentationViewerProps {
  onStartQuiz: () => void;
  hasSubmittedQuiz: boolean;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  onStartQuiz,
  hasSubmittedQuiz
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const slide = NSTP_2_SLIDES[currentSlideIndex];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Hero Banner - 3D Automation Style */}
      <div className="relative rounded-3xl overflow-hidden card-3d-luxury p-6 sm:p-10 border border-amber-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              Books · Complete NSTP 2 Course Module
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif leading-tight">
              Volunteerism on <span className="gold-gradient-text">NSTP 2</span>
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Official service-learning curriculum module. Master the 7 core values, 10 benefits, 8 action sectors, and 5-part Volunteer Work Plan before taking the proctored exam.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-bold">Presenter:</span> Gimbert B. Ludovice
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-bold">Class:</span> WITMWD3M1
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-bold">Instructor:</span> Prof. Arjay Gonzales Caraca
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            {!hasSubmittedQuiz ? (
              <button
                onClick={onStartQuiz}
                className="py-3 px-6 rounded-2xl gold-button text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer"
              >
                <span>Take Proctored Quiz</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="py-2.5 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Exam Completed (Score Locked)
              </div>
            )}

            <a
              href="/assets/aistudio/NSTP_2_Volunteerism.pptx_9f5ea931.pdf"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 hover:border-amber-400/50 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Slides PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Embedded 3D Presentation Video Player Section */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">3D Presentation Video Recording</h3>
              <p className="text-xs text-slate-400">Animated presentation walkthrough with 3D models and audio commentary</p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300">
            NSTP_2_Volunteerism.pptx.mp4
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-video border border-slate-700/80 shadow-2xl">
          <video
            controls
            preload="metadata"
            className="w-full h-full object-contain"
            poster="/assets/aistudio/NSTP_2_Volunteerism.pptx_9f5ea931.pdf"
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          >
            <source src="/assets/aistudio/NSTP_2_Volunteerism.pptx_94f58e04.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Interactive 12-Slide Deck Navigator */}
      <div className="card-3d-luxury rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        
        {/* Slide Deck Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-wider mb-1">
              <span>Slide {slide.pageNumber} of {NSTP_2_SLIDES.length}</span>
              {slide.badge && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px]">
                    {slide.badge}
                  </span>
                </>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white font-serif">{slide.title}</h3>
            {slide.subtitle && <p className="text-xs text-slate-400 mt-0.5">{slide.subtitle}</p>}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-slate-300 px-3">
              {currentSlideIndex + 1} / {NSTP_2_SLIDES.length}
            </span>
            <button
              onClick={() => setCurrentSlideIndex(Math.min(NSTP_2_SLIDES.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === NSTP_2_SLIDES.length - 1}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Cards Grid (Matching 3D Slide Layouts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {slide.cards.map((card, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-500/20 hover:border-amber-400/50 transition-all hover:scale-[1.02] shadow-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition-all" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
                  {card.number || `0${i + 1}`}
                </span>
                {card.tag && (
                  <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                    {card.tag}
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                {card.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Slide Key Idea Takeaway */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-600/10 to-amber-700/15 border border-amber-400/30 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 shrink-0">
            <Heart className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-mono mb-1">
              Core Concept Key Takeaway
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{slide.keyIdea}"
            </p>
          </div>
        </div>

        {/* Thumbnail Selector Strip (1 to 12) */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Jump to Slide Deck Topic:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {NSTP_2_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'bg-amber-400/20 border-amber-400 text-white shadow-md shadow-amber-400/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-amber-400">Slide {s.pageNumber}</div>
                <div className="text-xs font-semibold truncate text-slate-200">{s.title}</div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
