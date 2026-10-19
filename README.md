# VoiceNote Lab 🎙️

**Sprechen statt tippen: Tastenkürzel drücken, reden, fertig aufbereiteten Text einfügen.**

> **Fertiger Windows-Installer:** [mindriclab.gumroad.com/l/voicenote-lab](https://mindriclab.gumroad.com/l/voicenote-lab). Ohne Node-, Rust- oder Build-Einrichtung. Der Quellcode hier bleibt frei unter MIT.

VoiceNote Lab ist eine Desktop-App für Windows. Ein globales Tastenkürzel startet die Aufnahme, auch wenn die App im Hintergrund läuft. Die KI macht aus dem Gesagten ein sauberes Transkript und bereitet es auf Wunsch auf: als strukturierte Notiz, Zusammenfassung, E-Mail, Meeting-Protokoll, To-do-Liste und mehr.

## Funktionen

- **Globales Tastenkürzel**, wählbar in den Einstellungen (Standard `F9`)
- **4 Modi:** Original, Strukturiert, Zusammenfassung, Kontext
- **8 Kontext-Formate:** E-Mail förmlich und locker, Newsletter, Social-Media-Post, Meeting-Notizen, To-do-Liste, Blog-Artikel, Bericht
- **Ausgabe in der Sprache der Aufnahme:** Deutsch rein, Deutsch raus; Englisch rein, Englisch raus
- **Export** als TXT, Markdown, PDF oder JSON, Kopieren mit einem Klick
- **Verlauf** der letzten 10 Aufnahmen, Wort- und Zeichenzähler, Live-Wellenform
- **Oberfläche Deutsch und Englisch**

## KI-Anbieter (eigener Schlüssel)

| Anbieter | Transkription | Aufbereitung | Modell |
|---|---|---|---|
| **Google Gemini** (empfohlen) | ✓ | ✓ | `gemini-3.1-flash-lite` |
| OpenAI | ✓ | ✓ | `gpt-transcribe`, `gpt-6-luna` |
| Anthropic | – | ✓ | `claude-sonnet-5-5` |

Ein einziger **Gemini-Schlüssel** reicht für alles und läuft im kostenlosen Kontingent von Google ([aistudio.google.com/apikey](https://aistudio.google.com/apikey)). Mit Claude als Aufbereiter wird über Gemini oder OpenAI transkribiert.

Die Schlüssel bleiben lokal auf dem PC und gehen nur an den jeweiligen Anbieter.

## Selbst bauen

Voraussetzungen: Node.js 20+, Rust ([rustup.rs](https://rustup.rs)), unter Windows die Visual-Studio-Build-Tools.

```bash
git clone https://github.com/mindriclab/voice-intel.git
cd voice-intel
npm install
npm run tauri dev      # Entwicklung
npm run tauri build    # Installer unter src-tauri/target/release/bundle/
```

## Aufbau

| Teil | Technik |
|---|---|
| Oberfläche | Next.js (statischer Export), React 19, Tailwind CSS, Zustand |
| Desktop | Tauri 2 (Rust): globales Tastenkürzel, Zwischenablage, Speichern-Dialog |
| KI | `src/lib/api.ts`: Gemini, OpenAI, Anthropic |

## Lizenz

MIT, siehe [LICENSE](LICENSE).

Gebaut von **mindric lab** · [mindriclab.de](https://www.mindriclab.de)
