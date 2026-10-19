import { invoke } from '@tauri-apps/api/core';
import type { Language } from '@/lib/i18n';

// Anzeige des Tauri-Accelerators in der jeweiligen Sprache, z. B. "Strg+Umschalt+Leertaste"
export function formatHotkey(accelerator: string, language: Language): string {
  return accelerator
    .split('+')
    .map((part) => {
      if (language === 'de') {
        if (part === 'Ctrl') return 'Strg';
        if (part === 'Shift') return 'Umschalt';
        if (part === 'Space') return 'Leertaste';
      }
      return part;
    })
    .join('+');
}

function isTauri(): boolean {
  return typeof window !== 'undefined' && Boolean((window as any).__TAURI_INTERNALS__);
}

/**
 * Registriert das globale Tastenkürzel im Desktop-Teil (Rust). Wirft einen Fehler,
 * wenn ein anderes Programm das Kürzel schon belegt. Im Browser passiert nichts.
 */
export async function registerHotkey(accelerator: string): Promise<void> {
  if (!isTauri()) return;
  await invoke('set_shortcut', { accelerator });
}
