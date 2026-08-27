import React, { useState, useEffect } from 'react';
import { 
  fetchSession, 
  createNewSession, 
  sendMessage, 
  updateSessionProfile, 
  clearSession, 
  storage, 
  streamChat 
} from './services/api';
import { SessionData, UserProfile, ChatMessage, CareerRoadmap, CareerPath } from './types';
import { Header } from './components/Header';
import { MarketInsightsBanner } from './components/MarketInsightsBanner';
import { ChatContainer } from './components/ChatContainer';
import { ProfileSidebar } from './components/ProfileSidebar';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';
import { CareerExplorerModal } from './components/CareerExplorerModal';
import { CareerCompareModal } from './components/CareerCompareModal';
import { QuickAssessmentModal } from './components/QuickAssessmentModal';

export const App: React.FC = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSteps, setActiveSteps] = useState<any[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareCareers, setCompareCareers] = useState<CareerPath[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [latestRoadmap, setLatestRoadmap] = useState<CareerRoadmap | undefined>(undefined);
  const [savedCareers, setSavedCareers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('career_guide_saved_careers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeSessionId = storage.getActiveSessionId();

  // Load session on startup
  useEffect(() => {
    loadSession(activeSessionId);
  }, []);

  // Sync saved careers to local storage
  useEffect(() => {
    try {
      localStorage.setItem('career_guide_saved_careers', JSON.stringify(savedCareers));
    } catch (e) {
      console.error(e);
    }
  }, [savedCareers]);

  const loadSession = async (id: string) => {
    try {
      const data = await fetchSession(id);
      setSession(data);
      // Find latest roadmap if any in history
      const rev = [...data.messages].reverse();
      const lastWithRoadmap = rev.find(m => m.roadmapResult);
      if (lastWithRoadmap?.roadmapResult) {
        setLatestRoadmap(lastWithRoadmap.roadmapResult);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  const handleNewSession = async () => {
    try {
      const newSess = await createNewSession();
      setSession(newSess);
      setLatestRoadmap(undefined);
      setIsMobileSidebarOpen(false);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleClearSession = async () => {
    if (!session) return;
    if (window.confirm('Are you sure you want to reset this session?')) {
      const reset = await clearSession(session.id);
      setSession(reset);
      setLatestRoadmap(undefined);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!session || isLoading) return;

    setIsLoading(true);
    setActiveSteps([]);

    // Optimistically add user message to UI
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, tempUserMsg]
    } : null);

    try {
      // Use SSE streaming for real-time thoughts & step logs
      streamChat(
        {
          sessionId: session.id,
          message: text,
          apiKey: storage.getApiKey(),
          provider: storage.getProvider()
        },
        {
          onStep: (step) => {
            setActiveSteps(prev => [...prev, step]);
          },
          onComplete: (data) => {
            setSession(prev => {
              if (!prev) return null;
              const filtered = prev.messages.filter(m => m.id !== tempUserMsg.id);
              return {
                ...prev,
                userProfile: data.userProfile,
                messages: [...filtered, tempUserMsg, data.message]
              };
            });
            if (data.message.roadmapResult) {
              setLatestRoadmap(data.message.roadmapResult);
            }
            setIsLoading(false);
          },
          onError: async (err) => {
            console.warn('Streaming notice, fallback to REST POST:', err);
            try {
              const res = await sendMessage({
                sessionId: session.id,
                message: text
              });
              setSession(prev => prev ? {
                ...prev,
                userProfile: res.userProfile,
                messages: [...prev.messages.filter(m => m.id !== tempUserMsg.id), tempUserMsg, res.message]
              } : null);
              if (res.message.roadmapResult) {
                setLatestRoadmap(res.message.roadmapResult);
              }
            } catch (fallbackErr: any) {
              alert(`Error: ${fallbackErr.message}`);
            } finally {
              setIsLoading(false);
            }
          }
        }
      );
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    if (!session) return;
    try {
      const saved = await updateSessionProfile(session.id, updatedProfile);
      setSession(prev => prev ? { ...prev, userProfile: saved } : null);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const toggleSaveCareer = (careerTitle: string) => {
    setSavedCareers(prev => 
      prev.includes(careerTitle)
        ? prev.filter(c => c !== careerTitle)
        : [...prev, careerTitle]
    );
  };

  // Quick Action Handlers from interactive cards
  const handleAssessCareerGap = (careerTitle: string) => {
    handleSendMessage(`Assess my skill gap and missing requirements for "${careerTitle}".`);
  };

  const handleGenerateCareerRoadmap = (careerTitle: string) => {
    handleSendMessage(`Generate a structured step-by-step learning roadmap for "${careerTitle}".`);
  };

  const handleSearchCourseGaps = (careerTitle: string, skills: string[]) => {
    handleSendMessage(`Find top recommended courses and certifications for ${careerTitle} targeting: ${skills.join(', ')}.`);
  };

  const handleExportRoadmap = (roadmap: CareerRoadmap) => {
    setLatestRoadmap(roadmap);
    setIsExportOpen(true);
  };

  const handleOpenCompareModal = (selected: CareerPath[]) => {
    setCompareCareers(selected);
    setIsCompareOpen(true);
  };

  if (!session) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-sm">
          <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
          <span>Initializing Career Guidance Agent...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        onNewSession={handleNewSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onClearSession={handleClearSession}
        onOpenExplorer={() => setIsExplorerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        sessionTitle={session.title}
        provider={storage.getProvider()}
        hasApiKey={!!storage.getApiKey()}
        savedCareersCount={savedCareers.length}
      />

      {/* Market Pulse Banner */}
      <MarketInsightsBanner onExploreTrending={handleAssessCareerGap} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Chat Area */}
        <ChatContainer
          messages={session.messages}
          isLoading={isLoading}
          activeSteps={activeSteps}
          savedCareers={savedCareers}
          onSendMessage={handleSendMessage}
          onAssessCareerGap={handleAssessCareerGap}
          onGenerateCareerRoadmap={handleGenerateCareerRoadmap}
          onSearchCourseGaps={handleSearchCourseGaps}
          onExportRoadmap={handleExportRoadmap}
          onToggleSaveCareer={toggleSaveCareer}
        />

        {/* Live Profile Sidebar (Desktop) */}
        <ProfileSidebar
          profile={session.userProfile}
          savedCareers={savedCareers}
          onUpdateProfile={handleUpdateProfile}
          onExploreCareer={handleAssessCareerGap}
          onRemoveSavedCareer={toggleSaveCareer}
          className="hidden lg:flex w-80 xl:w-96 shrink-0"
        />

        {/* Mobile Slide-Over Drawer */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="w-80 sm:w-96 bg-slate-900 h-full shadow-2xl border-l border-slate-800 animate-slide-up">
              <ProfileSidebar
                profile={session.userProfile}
                savedCareers={savedCareers}
                onUpdateProfile={handleUpdateProfile}
                onExploreCareer={(c) => {
                  handleAssessCareerGap(c);
                  setIsMobileSidebarOpen(false);
                }}
                onRemoveSavedCareer={toggleSaveCareer}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => {}}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        profile={session.userProfile}
        activeRoadmap={latestRoadmap}
      />

      <CareerExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        onSelectCareerToChat={handleSendMessage}
        onAssessGap={handleAssessCareerGap}
        onGenerateRoadmap={handleGenerateCareerRoadmap}
        savedCareers={savedCareers}
        onToggleSaveCareer={toggleSaveCareer}
        onOpenCompare={handleOpenCompareModal}
      />

      <CareerCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        careers={compareCareers}
        onAssessGap={handleAssessCareerGap}
        onGenerateRoadmap={handleGenerateCareerRoadmap}
      />

      <QuickAssessmentModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onCompleteQuiz={handleSendMessage}
      />
    </div>
  );
};

export default App;
