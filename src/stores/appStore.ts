import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/lib/i18n';

export type EnrichmentMode = 'original' | 'structured' | 'summary' | 'context';
export type RecordingStatus = 'idle' | 'recording' | 'transcribing' | 'enriching' | 'done' | 'error';
export type LLMProvider = 'gemini' | 'openai' | 'anthropic';

// Wählbare globale Tastenkürzel (Tauri-Accelerator-Schreibweise). Bewusst ohne Strg+Shift+V,
// das ist in vielen Programmen "Einfügen ohne Formatierung".
// Strg+Alt-Kombinationen mit Leertaste sind auf deutschen Tastaturen AltGr und werden teils abgefangen.
export const HOTKEY_OPTIONS = ['F9', 'F8', 'Ctrl+Shift+Space', 'Ctrl+Alt+R'] as const;
export type Hotkey = typeof HOTKEY_OPTIONS[number];
export const DEFAULT_HOTKEY: Hotkey = 'F9';

// Context sub-types for the "Kontext" mode
export type ContextType = 
  | 'email_formal'      // Förmliche E-Mail
  | 'email_casual'      // Lockere E-Mail
  | 'newsletter'        // Newsletter
  | 'social_media'      // Social Media Post
  | 'meeting_notes'     // Meeting-Notizen
  | 'todo_list'         // TODO-Liste
  | 'blog_post'         // Blog-Artikel
  | 'report';           // Bericht/Report

export const CONTEXT_TYPE_LABELS: Record<Language, Record<ContextType, string>> = {
  de: {
    email_formal: 'Förmliche E-Mail',
    email_casual: 'Lockere E-Mail',
    newsletter: 'Newsletter',
    social_media: 'Social Media Post',
    meeting_notes: 'Meeting-Notizen',
    todo_list: 'TODO-Liste',
    blog_post: 'Blog-Artikel',
    report: 'Bericht / Report',
  },
  en: {
    email_formal: 'Formal email',
    email_casual: 'Casual email',
    newsletter: 'Newsletter',
    social_media: 'Social media post',
    meeting_notes: 'Meeting notes',
    todo_list: 'To-do list',
    blog_post: 'Blog post',
    report: 'Report',
  },
};

interface HistoryEntry {
  id: string;
  timestamp: number;
  transcript: string;
  enrichedText: string;
  mode: EnrichmentMode;
  contextType?: ContextType;
}

interface AudioDevice {
  deviceId: string;
  label: string;
}

interface AppState {
  // Recording state
  status: RecordingStatus;
  recordingTime: number;
  currentTranscript: string;
  liveTranscript: string;
  enrichedOutput: string;
  errorMessage: string;
  
  // Mode
  selectedMode: EnrichmentMode;
  selectedContextType: ContextType;
  
  // Settings
  geminiApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  selectedLLM: LLMProvider;
  hotkey: Hotkey;
  selectedMicrophone: string;
  availableMicrophones: AudioDevice[];
  language: Language;
  
  // History
  history: HistoryEntry[];
  
  // UI state
  showSettings: boolean;
  showHistory: boolean;
  isReprocessing: boolean;
  
  // Actions
  setStatus: (status: RecordingStatus) => void;
  setRecordingTime: (time: number) => void;
  setCurrentTranscript: (transcript: string) => void;
  setLiveTranscript: (transcript: string) => void;
  appendLiveTranscript: (text: string) => void;
  setEnrichedOutput: (output: string) => void;
  setErrorMessage: (message: string) => void;
  setSelectedMode: (mode: EnrichmentMode) => void;
  setSelectedContextType: (type: ContextType) => void;
  setGeminiApiKey: (key: string) => void;
  setOpenaiApiKey: (key: string) => void;
  setHotkey: (hotkey: Hotkey) => void;
  setAnthropicApiKey: (key: string) => void;
  setSelectedLLM: (provider: LLMProvider) => void;
  setSelectedMicrophone: (deviceId: string) => void;
  setAvailableMicrophones: (devices: AudioDevice[]) => void;
  setLanguage: (lang: Language) => void;
  setIsReprocessing: (value: boolean) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  toggleSettings: () => void;
  toggleHistory: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      status: 'idle',
      recordingTime: 0,
      currentTranscript: '',
      liveTranscript: '',
      enrichedOutput: '',
      errorMessage: '',
      selectedMode: 'structured',
      selectedContextType: 'email_formal',
      geminiApiKey: '',
      openaiApiKey: '',
      anthropicApiKey: '',
      selectedLLM: 'gemini',
      hotkey: DEFAULT_HOTKEY,
      selectedMicrophone: '',
      availableMicrophones: [],
      language: 'de',
      history: [],
      showSettings: false,
      showHistory: false,
      isReprocessing: false,
      
      // Actions
      setStatus: (status) => set({ status }),
      setRecordingTime: (recordingTime) => set({ recordingTime }),
      setCurrentTranscript: (currentTranscript) => set({ currentTranscript }),
      setLiveTranscript: (liveTranscript) => set({ liveTranscript }),
      appendLiveTranscript: (text) => set((state) => ({ 
        liveTranscript: state.liveTranscript + ' ' + text 
      })),
      setEnrichedOutput: (enrichedOutput) => set({ enrichedOutput }),
      setErrorMessage: (errorMessage) => set({ errorMessage }),
      setSelectedMode: (selectedMode) => set({ selectedMode }),
      setSelectedContextType: (selectedContextType) => set({ selectedContextType }),
      setGeminiApiKey: (geminiApiKey) => set({ geminiApiKey }),
      setOpenaiApiKey: (openaiApiKey) => set({ openaiApiKey }),
      setHotkey: (hotkey) => set({ hotkey }),
      setAnthropicApiKey: (anthropicApiKey) => set({ anthropicApiKey }),
      setSelectedLLM: (selectedLLM) => set({ selectedLLM }),
      setSelectedMicrophone: (selectedMicrophone) => set({ selectedMicrophone }),
      setAvailableMicrophones: (availableMicrophones) => set({ availableMicrophones }),
      setLanguage: (language) => set({ language }),
      setIsReprocessing: (isReprocessing) => set({ isReprocessing }),
      
      addHistoryEntry: (entry) => set((state) => ({
        history: [
          {
            ...entry,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          },
          ...state.history,
        ].slice(0, 10),
      })),
      
      clearHistory: () => set({ history: [] }),
      toggleSettings: () => set((state) => ({ 
        showSettings: !state.showSettings,
        showHistory: false 
      })),
      toggleHistory: () => set((state) => ({ 
        showHistory: !state.showHistory,
        showSettings: false 
      })),
      
      reset: () => set({
        status: 'idle',
        recordingTime: 0,
        currentTranscript: '',
        liveTranscript: '',
        enrichedOutput: '',
        errorMessage: '',
      }),
    }),
    {
      name: 'voicenote-lab-storage',
      partialize: (state) => ({
        geminiApiKey: state.geminiApiKey,
        openaiApiKey: state.openaiApiKey,
        hotkey: state.hotkey,
        anthropicApiKey: state.anthropicApiKey,
        selectedLLM: state.selectedLLM,
        selectedMode: state.selectedMode,
        selectedContextType: state.selectedContextType,
        selectedMicrophone: state.selectedMicrophone,
        language: state.language,
        history: state.history,
      }),
    }
  )
);
