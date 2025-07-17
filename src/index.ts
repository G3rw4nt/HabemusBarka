import { Client, GatewayIntentBits, Events, VoiceChannel, Interaction } from 'discord.js';
import { config } from 'dotenv';
import { startScheduler } from './scheduler';
import { safePlayBarkaOnChannel, activeConnections } from './utils';
import { log } from './logger';
import { MESSAGES } from './messages';
import { getVoiceConnection } from '@discordjs/voice';
import { setAutoplay, isAutoplayEnabled } from './settings';
import fs from 'fs';

fs.mkdirSync('logs', { recursive: true });
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  log.info(`✅ Zalogowano jako ${client.user?.tag}`);
  startScheduler(client);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, guild, member } = interaction;
  if (!guild) return;

  if (commandName === 'barka') {
    if (!('voice' in member!) || !member.voice.channel) {
      await interaction.reply({ content: MESSAGES.mustBeOnVoice, ephemeral: true });
      return;
    }

    if (activeConnections.has(guild.id)) {
      await interaction.reply({ content: MESSAGES.alreadyPlaying, ephemeral: true });
      return;
    }

    await interaction.reply(MESSAGES.started);
    safePlayBarkaOnChannel(member.voice.channel as VoiceChannel);
  }

  if (commandName === 'amen') {
    const conn = getVoiceConnection(guild.id);
    if (conn) {
      conn.destroy();
      activeConnections.delete(guild.id);
      await interaction.reply(MESSAGES.disconnected);
      log.info(MESSAGES.manualDisconnect(guild.name));
    } else {
      await interaction.reply({ content: MESSAGES.notConnected, ephemeral: true });
    }
  }

  if (commandName === 'autobarka') {
    const option = interaction.options.getString('tryb');
    const enabled = option === 'on';

    setAutoplay(guild.id, enabled);
    await interaction.reply(
      enabled
        ? MESSAGES.autoBarkaEnabled
        : MESSAGES.autoBarkaDisabled
    );
  }

  if (commandName === 'status') {
    const enabled = isAutoplayEnabled(guild.id);
    await interaction.reply(
      enabled
        ? MESSAGES.autoBarkaEnabled
        : MESSAGES.autoBarkaDisabled
    );
  }
});