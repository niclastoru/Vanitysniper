require('dotenv').config();
const axios = require('axios');
const chalk = require('chalk');

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VANITIES = process.env.VANITIES ? process.env.VANITIES.split(',') : ['deinname'];

const headers = {
  'Authorization': TOKEN,
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

async function claimVanity(vanity) {
  try {
    const res = await axios.patch(
      `https://discord.com/api/v9/guilds/${GUILD_ID}/vanity-url`,
      { code: vanity.trim() },
      { headers }
    );
    if (res.status === 200) {
      console.log(chalk.green(`✅ GE SNIPT: discord.gg/${vanity}`));
      return true;
    }
  } catch (err) {
    if (err.response?.status === 429) {
      console.log(chalk.yellow('Rate limit...'));
    } else if (err.response?.status === 401) {
      console.log(chalk.red('Token ungültig!'));
    } else {
      console.log(chalk.red(`Fehlgeschlagen ${vanity}: ${err.response?.status || err.message}`));
    }
  }
}

async function start() {
  console.log(chalk.cyan('🚀 Vanity Sniper auf Render gestartet...'));
  while (true) {
    for (const v of VANITIES) {
      await claimVanity(v);
      await new Promise(r => setTimeout(r, 60));
    }
    await new Promise(r => setTimeout(r, 100));
  }
}

start();
