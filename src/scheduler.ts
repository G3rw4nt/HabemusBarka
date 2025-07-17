import cron from 'node-cron';
import { Client, ChannelType, VoiceChannel, Collection, GuildBasedChannel } from 'discord.js';
import { safePlayBarkaOnChannel } from './utils';
import { log } from './logger';
import { MESSAGES } from './messages';
import { isAutoplayEnabled } from './settings';

export function startScheduler(client: Client) {
  cron.schedule('37 21 * * *', () => {
    log.info(MESSAGES.autoPlayTime);

    for (const [_, guild] of client.guilds.cache) {
      if (!isAutoplayEnabled(guild.id)) {
        log.info(MESSAGES.autoBarkaSkip(guild.name));
        continue;
      }

      guild.channels.fetch().then(channels => {
        const voiceChannels = channels
          .filter(
            ch => ch?.type === ChannelType.GuildVoice &&
              (ch as VoiceChannel).members.filter(m => !m.user.bot).size > 0
          ) as Map<string, VoiceChannel>;

        if (voiceChannels.size === 0) {
          log.error(MESSAGES.noChannels(guild.name));
          return;
        }

        const random = Array.from(voiceChannels.values())[Math.floor(Math.random() * voiceChannels.size)];
        safePlayBarkaOnChannel(random);
      }).catch((err: Error) => {
        log.error(MESSAGES.channelError(guild.name, err.message));
      });
    }
  }, {
    timezone: 'Europe/Warsaw'
  });
}
