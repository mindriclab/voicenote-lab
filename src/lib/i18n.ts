// Einfache i18n Implementierung

export type Language = 'de' | 'en';

export const translations = {
  de: {
    // Header
    history: 'Verlauf',
    settings: 'Einstellungen',
    
    // Recording
    clickToRecord: 'Zum Aufnehmen klicken',
    recording: 'Aufnahme läuft...',
    transcribing: 'Transkribiere...',
    processing: 'Verarbeite...',
    
    // Loading phases
    audioProcessing: 'Audio wird verarbeitet',
    speechRecognition: 'Sprache wird erkannt',
    textExtraction: 'Text wird extrahiert',
    textAnalysis: 'Text wird analysiert',
    aiProcessing: 'KI verarbeitet Inhalt',
    outputFormatting: 'Ausgabe wird formatiert',
    
    // Sections
    transcript: 'TRANSKRIPT',
    selectFormat: 'FORMAT WÄHLEN',
    result: 'ERGEBNIS',
    noTranscriptYet: 'Noch kein Transkript vorhanden. Starte eine Aufnahme.',
    selectFormatHint: 'Wähle ein Format, um den Text zu verarbeiten.',
    
    // Modes
    original: 'Original',
    structured: 'Strukturiert',
    summary: 'Zusammenfassung',
    context: 'Kontext',
    
    // Context types
    formalEmail: 'Förmliche E-Mail',
    informalEmail: 'Informelle E-Mail',
    newsletter: 'Newsletter',
    blogPost: 'Blog-Beitrag',
    socialMedia: 'Social Media Post',
    report: 'Bericht',
    protocol: 'Protokoll',
    
    // Buttons
    copyTranscript: 'Transkript kopieren',
    delete: 'Löschen',
    save: 'Speichern',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    
    // Stats
    word: 'Wort',
    words: 'Wörter',
    characters: 'Zeichen',
    
    // Footer
    ready: 'Bereit',
    apiKeyMissing: 'API Key fehlt',
    developedBy: 'Developed by',
    
    // Errors
    configureApiKey: 'Bitte zuerst einen API-Schlüssel in den Einstellungen eintragen.',
    recordingTooShort: 'Aufnahme zu kurz.',
    noSpeechDetected: 'Keine Sprache erkannt.',
    error: 'Fehler',
    
    // Settings
    settingsTitle: 'Einstellungen',
    apiAndAi: 'API & KI',
    audio: 'Audio',
    language: 'Sprache',
    openaiApiKey: 'OpenAI API Key',
    anthropicApiKey: 'Anthropic API Key',
    selectLlm: 'KI-Modell wählen',
    microphone: 'Mikrofon',
    selectMicrophone: 'Mikrofon auswählen',
    allowMicAccess: 'Mikrofon-Zugriff erlauben',
    close: 'Schließen',
    
    // History
    historyTitle: 'Verlauf',
    noHistory: 'Noch keine Einträge vorhanden.',
    clearAll: 'Alle löschen',
    // Ergänzt in 0.2.0
    or: 'oder',
    recordingFailed: 'Aufnahme fehlgeschlagen',
    processingFailed: 'Verarbeitung fehlgeschlagen',
    entry: 'Eintrag',
    entries: 'Einträge',
    confirmClearHistory: 'Möchtest du den gesamten Verlauf löschen?',
    apiKeys: 'API-Schlüssel',
    recommended: 'empfohlen',
    optional: 'optional',
    active: 'Aktiv',
    deleteKey: 'Schlüssel löschen',
    geminiHint: 'Kostenlos erhältlich unter aistudio.google.com/apikey. Ein Schlüssel reicht für Transkription und Aufbereitung.',
    openaiHint: 'Optional. Für Transkription und Aufbereitung über OpenAI (kostenpflichtig).',
    anthropicHint: 'Optional. Claude bereitet nur auf, transkribiert wird dann über Gemini oder OpenAI.',
    keysLocalInfo: 'Deine Schlüssel bleiben lokal auf diesem PC und gehen nur an den jeweiligen Anbieter.',
    aiProvider: 'KI-Anbieter',
    aiProviderHint: 'Dieser Anbieter bereitet deine Texte auf (Strukturieren, Zusammenfassen, Formate).',
    transcriptionVia: 'Transkription über',
    noKeyYet: 'noch kein passender Schlüssel',
    hotkeyTitle: 'Tastenkürzel',
    hotkeyHint: 'Startet und stoppt die Aufnahme, auch wenn die App im Hintergrund läuft.',
    hotkeyError: 'Dieses Tastenkürzel ist schon von einem anderen Programm belegt. Bitte ein anderes wählen.',
    defaultMic: 'Standard-Mikrofon',
    reloadMics: 'Mikrofone neu laden',
    saveClose: 'Speichern & Schließen',
    languageTitle: 'Sprache / Language',
    fileName: 'Dateiname',
    chooseFormat: 'Format wählen',
    content: 'Inhalt',
    transcriptLabel: 'Transkript',
    transcriptDesc: 'Original-Sprachaufnahme als Text',
    enrichedLabel: 'Aufbereitete Ausgabe',
    enrichedDesc: 'KI-verarbeiteter Text',
    cancel: 'Abbrechen',
    fmtTxt: 'Einfache Textdatei',
    fmtMd: 'Formatierter Text für Notion, Obsidian usw.',
    fmtPdf: 'Druckfertiges Dokument',
    fmtJson: 'Strukturierte Daten',
    date: 'Datum',
    modeLabel: 'Modus',
    exportTitle: 'Exportieren',
  },
  en: {
    // Header
    history: 'History',
    settings: 'Settings',
    
    // Recording
    clickToRecord: 'Click to record',
    recording: 'Recording...',
    transcribing: 'Transcribing...',
    processing: 'Processing...',
    
    // Loading phases
    audioProcessing: 'Processing audio',
    speechRecognition: 'Recognizing speech',
    textExtraction: 'Extracting text',
    textAnalysis: 'Analyzing text',
    aiProcessing: 'AI processing content',
    outputFormatting: 'Formatting output',
    
    // Sections
    transcript: 'TRANSCRIPT',
    selectFormat: 'SELECT FORMAT',
    result: 'RESULT',
    noTranscriptYet: 'No transcript yet. Start a recording.',
    selectFormatHint: 'Select a format to process the text.',
    
    // Modes
    original: 'Original',
    structured: 'Structured',
    summary: 'Summary',
    context: 'Context',
    
    // Context types
    formalEmail: 'Formal Email',
    informalEmail: 'Informal Email',
    newsletter: 'Newsletter',
    blogPost: 'Blog Post',
    socialMedia: 'Social Media Post',
    report: 'Report',
    protocol: 'Protocol',
    
    // Buttons
    copyTranscript: 'Copy Transcript',
    delete: 'Clear',
    save: 'Save',
    copy: 'Copy',
    copied: 'Copied!',
    
    // Stats
    word: 'word',
    words: 'words',
    characters: 'characters',
    
    // Footer
    ready: 'Ready',
    apiKeyMissing: 'API Key missing',
    developedBy: 'Developed by',
    
    // Errors
    configureApiKey: 'Please add an API key in the settings first.',
    recordingTooShort: 'Recording too short.',
    noSpeechDetected: 'No speech detected.',
    error: 'Error',
    
    // Settings
    settingsTitle: 'Settings',
    apiAndAi: 'API & AI',
    audio: 'Audio',
    language: 'Language',
    openaiApiKey: 'OpenAI API Key',
    anthropicApiKey: 'Anthropic API Key',
    selectLlm: 'Select AI Model',
    microphone: 'Microphone',
    selectMicrophone: 'Select Microphone',
    allowMicAccess: 'Allow Microphone Access',
    close: 'Close',
    
    // History
    historyTitle: 'History',
    noHistory: 'No entries yet.',
    clearAll: 'Clear all',
    // Added in 0.2.0
    or: 'or',
    recordingFailed: 'Recording failed',
    processingFailed: 'Processing failed',
    entry: 'entry',
    entries: 'entries',
    confirmClearHistory: 'Delete the entire history?',
    apiKeys: 'API keys',
    recommended: 'recommended',
    optional: 'optional',
    active: 'Active',
    deleteKey: 'Delete key',
    geminiHint: 'Free at aistudio.google.com/apikey. One key covers transcription and processing.',
    openaiHint: 'Optional. For transcription and processing via OpenAI (paid).',
    anthropicHint: 'Optional. Claude only processes text, transcription then runs via Gemini or OpenAI.',
    keysLocalInfo: 'Your keys stay on this PC and are only sent to the respective provider.',
    aiProvider: 'AI provider',
    aiProviderHint: 'This provider processes your text (structure, summary, formats).',
    transcriptionVia: 'Transcription via',
    noKeyYet: 'no matching key yet',
    hotkeyTitle: 'Hotkey',
    hotkeyHint: 'Starts and stops recording, even when the app is in the background.',
    hotkeyError: 'This hotkey is already used by another program. Please pick a different one.',
    defaultMic: 'Default microphone',
    reloadMics: 'Reload microphones',
    saveClose: 'Save & close',
    languageTitle: 'Sprache / Language',
    fileName: 'File name',
    chooseFormat: 'Choose format',
    content: 'Content',
    transcriptLabel: 'Transcript',
    transcriptDesc: 'Original recording as text',
    enrichedLabel: 'Processed output',
    enrichedDesc: 'AI-processed text',
    cancel: 'Cancel',
    fmtTxt: 'Plain text file',
    fmtMd: 'Formatted text for Notion, Obsidian etc.',
    fmtPdf: 'Print-ready document',
    fmtJson: 'Structured data',
    date: 'Date',
    modeLabel: 'Mode',
    exportTitle: 'Export',
  }
} as const;

export type TranslationKey = keyof typeof translations.de;

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || translations.de[key] || key;
}
