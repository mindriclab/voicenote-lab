'use client';

import { X, Mic, Sparkles, RefreshCw, Trash2, Info, Globe, Keyboard } from 'lucide-react';
import { useAppStore, HOTKEY_OPTIONS, LLMProvider, Hotkey } from '@/stores/appStore';
import { useEffect, useState, useRef, useCallback } from 'react';
import { audioRecorder } from '@/lib/audioRecorder';
import { getTranscriptionProvider } from '@/lib/api';
import { t } from '@/lib/i18n';
import { formatHotkey } from '@/lib/hotkey';

const sectionTitle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#f97316',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 14px',
  backgroundColor: '#0d0d0d',
  border: '1px solid #333',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

function choiceStyle(active: boolean, enabled = true): React.CSSProperties {
  return {
    flex: 1,
    padding: '14px 10px',
    backgroundColor: active ? 'rgba(249, 115, 22, 0.15)' : '#0d0d0d',
    border: active ? '2px solid #f97316' : '1px solid #333',
    borderRadius: '12px',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.4,
    textAlign: 'center',
  };
}

function KeyField({
  label,
  badge,
  placeholder,
  value,
  onChange,
  onClear,
  hint,
  activeLabel,
  deleteLabel,
}: {
  label: string;
  badge: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  hint: string;
  activeLabel: string;
  deleteLabel: string;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>
          {label} <span style={{ color: '#666', fontWeight: 400 }}>({badge})</span>
        </label>
        {value && (
          <span style={{ fontSize: '11px', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
            ✓ {activeLabel}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="password"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#f97316'}
          onBlur={(e) => e.target.style.borderColor = '#333'}
        />
        {value && (
          <button
            onClick={onClear}
            title={deleteLabel}
            style={{
              padding: '12px',
              backgroundColor: '#0d0d0d',
              border: '1px solid #333',
              borderRadius: '10px',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{hint}</p>
    </div>
  );
}

export function Settings() {
  const {
    showSettings,
    toggleSettings,
    geminiApiKey,
    setGeminiApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    anthropicApiKey,
    setAnthropicApiKey,
    selectedLLM,
    setSelectedLLM,
    hotkey,
    setHotkey,
    availableMicrophones,
    selectedMicrophone,
    setSelectedMicrophone,
    setAvailableMicrophones,
    language,
    setLanguage,
  } = useAppStore();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (showSettings) {
      setPosition({ x: 0, y: 0 });
      loadMicrophones();
    }
  }, [showSettings]);

  const loadMicrophones = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await audioRecorder.getAudioDevices();
      setAvailableMicrophones(devices);
    } catch (error) {
      console.log('Mic access error:', error);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!showSettings) return null;

  const keys = { gemini: geminiApiKey, openai: openaiApiKey, anthropic: anthropicApiKey };
  const providers: { id: LLMProvider; icon: string; name: string; vendor: string }[] = [
    { id: 'gemini', icon: '✨', name: 'Gemini', vendor: 'Google' },
    { id: 'openai', icon: '🤖', name: 'GPT', vendor: 'OpenAI' },
    { id: 'anthropic', icon: '🧠', name: 'Claude', vendor: 'Anthropic' },
  ];
  const transcriber = getTranscriptionProvider(selectedLLM, keys);
  const transcriberName = transcriber === 'gemini' ? 'Google Gemini' : transcriber === 'openai' ? 'OpenAI' : t('noKeyYet', language);

  return (
    <div
      className="fixed inset-0"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleSettings();
      }}
    >
      {/* Modal - Absolute Center */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          width: '440px',
          maxWidth: '95vw',
          backgroundColor: '#1c1c1e',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Draggable */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #333',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onMouseDown={handleMouseDown}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>
            ⚙️ {t('settingsTitle', language)}
          </h2>
          <button
            onClick={toggleSettings}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>

          {/* Section: API Keys */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={sectionTitle}>
              <Sparkles size={14} />
              {t('apiKeys', language)}
            </h3>

            <KeyField
              label="Google Gemini"
              badge={t('recommended', language)}
              placeholder="AIza..."
              value={geminiApiKey}
              onChange={setGeminiApiKey}
              onClear={() => setGeminiApiKey('')}
              hint={t('geminiHint', language)}
              activeLabel={t('active', language)}
              deleteLabel={t('deleteKey', language)}
            />
            <KeyField
              label="OpenAI"
              badge={t('optional', language)}
              placeholder="sk-..."
              value={openaiApiKey}
              onChange={setOpenaiApiKey}
              onClear={() => setOpenaiApiKey('')}
              hint={t('openaiHint', language)}
              activeLabel={t('active', language)}
              deleteLabel={t('deleteKey', language)}
            />
            <KeyField
              label="Anthropic"
              badge={t('optional', language)}
              placeholder="sk-ant-..."
              value={anthropicApiKey}
              onChange={setAnthropicApiKey}
              onClear={() => setAnthropicApiKey('')}
              hint={t('anthropicHint', language)}
              activeLabel={t('active', language)}
              deleteLabel={t('deleteKey', language)}
            />

            {/* Info Box */}
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <Info size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '12px', color: '#93c5fd', margin: 0, lineHeight: '1.5' }}>
                {t('keysLocalInfo', language)}
              </p>
            </div>
          </div>

          {/* Section: KI-Anbieter */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ ...sectionTitle, marginBottom: '8px' }}>
              {t('aiProvider', language)}
            </h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
              {t('aiProviderHint', language)}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              {providers.map((p) => {
                const enabled = Boolean(keys[p.id]);
                const active = selectedLLM === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => enabled && setSelectedLLM(p.id)}
                    disabled={!enabled}
                    style={choiceStyle(active, enabled)}
                  >
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{p.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: active ? '#f97316' : '#fff' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{p.vendor}</div>
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: '11px', color: '#777', marginTop: '12px' }}>
              🎙️ {t('transcriptionVia', language)}: <strong style={{ color: transcriber ? '#ddd' : '#ef4444' }}>{transcriberName}</strong>
            </p>
          </div>

          {/* Section: Tastenkürzel */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={sectionTitle}>
              <Keyboard size={14} />
              {t('hotkeyTitle', language)}
            </h3>
            <select
              value={hotkey}
              onChange={(e) => setHotkey(e.target.value as Hotkey)}
              style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}
            >
              {HOTKEY_OPTIONS.map((h) => (
                <option key={h} value={h}>{formatHotkey(h, language)}</option>
              ))}
            </select>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{t('hotkeyHint', language)}</p>
          </div>

          {/* Section: Audio */}
          <div>
            <h3 style={sectionTitle}>
              <Mic size={14} />
              {t('audio', language)}
            </h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', color: '#fff', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                {t('microphone', language)}
              </label>
              <select
                value={selectedMicrophone || ''}
                onChange={(e) => setSelectedMicrophone(e.target.value)}
                style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}
              >
                <option value="">{t('defaultMic', language)}</option>
                {availableMicrophones.map((mic) => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || `${t('microphone', language)} ${mic.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadMicrophones}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                border: '1px dashed #444',
                borderRadius: '10px',
                color: '#888',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              {t('reloadMics', language)}
            </button>
          </div>

          {/* Section: Sprache */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={sectionTitle}>
              <Globe size={14} />
              {t('languageTitle', language)}
            </h3>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setLanguage('de')} style={choiceStyle(language === 'de')}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>🇩🇪</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: language === 'de' ? '#f97316' : '#fff' }}>
                  Deutsch
                </div>
              </button>
              <button onClick={() => setLanguage('en')} style={choiceStyle(language === 'en')}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>🇬🇧</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: language === 'en' ? '#f97316' : '#fff' }}>
                  English
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #333',
          backgroundColor: '#151515',
        }}>
          <button
            onClick={toggleSettings}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#f97316',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
          >
            {t('saveClose', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
