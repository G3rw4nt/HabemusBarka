import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const commands = [
  new SlashCommandBuilder()
    .setName('barka')
    .setDescription('Zagraj Barkę w swoim kanale głosowym'),
  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Wypchnij HabemusBarka z kanału głosowego'),
].map(cmd => cmd.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log('🚀 Rejestruję komendy...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    );
    console.log('✅ Komendy zarejestrowane globalnie!');
  } catch (err) {
    console.error('❌ Błąd przy rejestracji komend:', err);
  }
})();
