import { VoiceChannel } from 'discord.js';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { createReadStream } from 'fs';
import path from 'path';
import { log } from './logger';
import { MESSAGES } from './messages';

const MAIN_AUDIO = path.join(__dirname, '../audio/barka.mp3');
const ALT_AUDIO = path.join(__dirname, '../audio/barka_elektro.mp3');
const PLAY_TIMEOUT_MS = 600_000;

export const activeConnections = new Map<string, ReturnType<typeof joinVoiceChannel>>();

export function safePlayBarkaOnChannel(channel: VoiceChannel) {
  const guild = channel.guild;

  if (activeConnections.has(guild.id)) {
    log(MESSAGES.alreadyPlaying);
    return;
  }

  const conn = joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  activeConnections.set(guild.id, conn);

  entersState(conn, VoiceConnectionStatus.Ready, 5000).then(() => {
    const roll = Math.random();
    const selectedPath = roll < 0.1 ? ALT_AUDIO : MAIN_AUDIO;
    const versionLabel = roll < 0.1 ? 'ELEKTROBARKA 💥⚡' : 'Barka 🎶';
    const resource = createAudioResource(createReadStream(selectedPath));
    const player = createAudioPlayer();

    conn.subscribe(player);
    player.play(resource);
    log(MESSAGES.joined(versionLabel, guild.name, channel.name));

    const timeout = setTimeout(() => {
      conn.destroy();
      activeConnections.delete(guild.id);
      log(MESSAGES.timeout(guild.name));
    }, PLAY_TIMEOUT_MS);

    player.once(AudioPlayerStatus.Idle, () => {
      clearTimeout(timeout);
      conn.destroy();
      activeConnections.delete(guild.id);
      log(MESSAGES.ended(versionLabel, guild.name));
    });

    player.once('error', err => {
      clearTimeout(timeout);
      conn.destroy();
      activeConnections.delete(guild.id);
      log(MESSAGES.error(guild.name, err.message));
    });

  }).catch(() => {
    conn.destroy();
    activeConnections.delete(guild.id);
    log(MESSAGES.failedConnect(channel.name));
  });
}
