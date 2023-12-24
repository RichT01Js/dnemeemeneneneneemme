const Discord = require('discord.js');
const db = require('quick.db');
const ms = require('parse-ms');
const DBL = require('dblapi.js');

exports.run = async (client, message, args) => {
  const user = message.author;
  const hasAccount = db.fetch(`hesapdurumasreaper-${user.id}`);
  if (message.channel.type === 'dm') {
    return message.reply(client.ekoayarlar.dmmesajgondermemsg);
  }

  if (!hasAccount) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  let timeout = 86400000; // 24 hours (24 * 60 * 60 * 1000 milliseconds)

  let daily = await db.fetch(`günlükkullanımgodareçdare-${user.id}`);

  if (daily !== null && timeout - (Date.now() - daily) > 0) {
    let time = ms(timeout - (Date.now() - daily));
    return message.channel.send(`${user}, ${time.hours} saat ${time.minutes} dakika ${time.seconds} saniye beklemelisin`);
  }

  db.set(`günlükkullanımgodareçdare-${user.id}`, Date.now());
  db.add(`bakiyeasreaper-${user.id}`, client.ekoayarlar.günlükpara);
  return message.channel.send(`${user} **__${client.ekoayarlar.günlükpara.toLocaleString()}${client.ekoayarlar.parabirimi}__** tutarında günlük bakiye aldınız!`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['günlük-para'],
  permLevel: 0,
  katagori: "Ekonomi",
};

exports.help = {
  name: 'daily',
  description: 'Günlük para ödülünü talep edin',
  usage: 'daily',
};
