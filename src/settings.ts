import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(__dirname, '../autoplay-settings.json');

type SettingsMap = Record<string, boolean>;

export function loadSettings(): SettingsMap {
  if (!fs.existsSync(SETTINGS_PATH)) return {};
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
}

export function saveSettings(settings: SettingsMap) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

export function setAutoplay(guildId: string, enabled: boolean) {
  const settings = loadSettings();
  settings[guildId] = enabled;
  saveSettings(settings);
}

export function isAutoplayEnabled(guildId: string): boolean {
  const settings = loadSettings();
  return settings[guildId] ?? true; // domyślnie włączone
}
