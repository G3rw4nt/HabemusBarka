import { Client, GatewayIntentBits, Events, VoiceChannel } from 'discord.js';
import { config } from 'dotenv';
import { startScheduler } from './scheduler';
import { safePlayBarkaOnChannel, activeConnections } from './utils';
import { log } from './logger';
import { MESSAGES } from './messages';
import { getVoiceConnection } from '@discordjs/voice';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  log(`✅ Zalogowano jako ${client.user?.tag}`);
  startScheduler(client);
});

client.on(Events.InteractionCreate, async interaction => {
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

  if (commandName === 'leave') {
    const conn = getVoiceConnection(guild.id);
    if (conn) {
      conn.destroy();
      activeConnections.delete(guild.id);
      await interaction.reply(MESSAGES.disconnected);
      log(MESSAGES.manualDisconnect(guild.name));
    } else {
      await interaction.reply({ content: MESSAGES.notConnected, ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
