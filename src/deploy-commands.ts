import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';
import { MESSAGES } from './messages';
import { log } from './logger';

const commands = [
  new SlashCommandBuilder()
    .setName('barka')
    .setDescription(MESSAGES.barkaDescription),
  new SlashCommandBuilder()
    .setName('amen')
    .setDescription(MESSAGES.amenDescription),
  new SlashCommandBuilder()
    .setName('autobarka')
    .setDescription(MESSAGES.autoBarkaDescription)
    .addStringOption(opt =>
      opt.setName('tryb')
        .setDescription( MESSAGES.selectModeDescription)
        .setRequired(true)
        .addChoices(
          { name: 'włącz', value: 'on' },
          { name: 'wyłącz', value: 'off' }
        )
    ),
  new SlashCommandBuilder()
    .setName('status')
    .setDescription(MESSAGES.statusDescription),
].map(cmd => cmd.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    log.info(MESSAGES.deployCommands);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    );
    log.info(MESSAGES.commandsDeploymentSuccess);
  } catch (err) {
    log.error(MESSAGES.commandsDeploymentError(
      err instanceof Error ? err.message : String(err)
    ));
  }
})();
