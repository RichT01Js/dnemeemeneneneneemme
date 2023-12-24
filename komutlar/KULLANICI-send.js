const Discord = require('discord.js');
const db = require('quick.db');
var ayarlar = require('../ayarlar.json');

function formatCurrency(amount, currency) {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${currency}`;
}

exports.run = async (client, message, args) => {
  let transkllanç = message.mentions.users.first();
  if (!transkllanç) return message.channel.send(exports.help.usage);
  let kllanç = message.author;
  let para = args[1];
  let aciklama = args.slice(2).join(' ') || "Sana para gönderdim.";
  if (transkllanç == kllanç) return message.channel.send(`${message.author}, Kendine para gönderemezsin`);
  if (transkllanç.bot == true) return message.channel.send(`${message.author}, Botlara para gönderemezsin`);
  if (!transkllanç) return message.channel.send(exports.help.usage);
  if (!para) return message.channel.send(exports.help.usage);
  const bakiye = await db.fetch(`bakiyeasreaper-${kllanç.id}`);
  const hesapdurumu = await db.fetch(`hesapdurumasreaper-${kllanç.id}`);
  const hesapismi = await db.fetch(`hesapismiasreaper-${kllanç.id}`);
  if (message.channel.type === 'dm') {
    return message.reply(client.ekoayarlar.dmmesajgondermemsg);
  }

  const transbakiye = await db.fetch(`bakiyeasreaper-${transkllanç.id}`);
  const transhesapdurumu = await db.fetch(`hesapdurumasreaper-${transkllanç.id}`);
  const transhesapismi = await db.fetch(`hesapismiasreaper-${transkllanç.id}`);

  if (!hesapdurumu) {
    message.reply(client.ekoayarlar.hesapolusturmsg);
  } else {
    if (hesapdurumu) {
      if (!hesapismi) {
        message.reply(client.ekoayarlar.hesapolusturmsg);
      } else {
        if (hesapdurumu) {
          if (hesapismi) {
            if (bakiye < para) return message.channel.send(`${message.author},Para gönderebilmek için yeterli bakiyen yok.`);
            if (!transhesapdurumu) return message.channel.send(`${message.author}, Para göndermek istediğin kullanıcının hesabı yok.`);
            if (transhesapdurumu) {
              db.add(`bakiyeasreaper-${message.author.id}`, -para);
              db.add(`bakiyeasreaper-${transkllanç.id}`, para);
              
              const guildName = message.guild ? message.guild.name : "Özel Mesaj";
              
              message.channel.send(`${transkllanç} adlı kullanıcının hesabına **${formatCurrency(para, client.ekoayarlar.parabirimi)}** miktarında para yolladın. Açıklama: ${aciklama} `);
              
              transkllanç.send(`# SlotRUSH \n${message.author.tag} adlı kullanıcı **${guildName}** adlı sunucuda hesabınıza **${formatCurrency(para, client.ekoayarlar.parabirimi)}** miktarında para yolladı. Açıklama: **${aciklama}**`);
            }
          }
        }
      }
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['paragonder', 'paragönder', 'para-gonder', 'para-gönder'],
  permLevel: 0,
  katagori: "Ekonomi",
};

exports.help = {
  name: 'send',
  description: 'Asreaper',
  usage: `Doğru kullanım: **.send @kullanıcı miktar <açıklama(isteğe bağlı)>**`
};
