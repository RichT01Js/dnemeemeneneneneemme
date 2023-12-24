const Discord = require('discord.js');
const db = require('quick.db');
const ayarlar = require('../ayarlar.json');

exports.run = async (client, message, args) => {
if (!client.ekoayarlar.admin.includes(message.author.id)) return message.reply(`Bunu yapabilmek için gerekli yetkiye sahip değilsin!`);
if (message.channel.type === 'dm') {
  return message.reply(`\`DMCS\` devreye girdi ve komut kullanımınız engellendi. \n${message.author} adlı hesabınız yetkililere bildirildi.`);
}
  
  const silinecekkllnc = message.mentions.members.first();
  
  if (!silinecekkllnc) return message.channel.send(exports.help.usage);
  
  const hesapdurumu = await db.fetch(`hesapdurumasreaper-${silinecekkllnc.id}`);
  
  if (!hesapdurumu || hesapdurumu !== "aktif") {
    return message.channel.send(`Silinmesi istenen kullanıcının kayıtlı bir hesabı bulunmamaktadır!`);
  }

  db.delete(`bakiyeasreaper-${silinecekkllnc.id}`);
  db.delete(`hesapdurumasreaper-${silinecekkllnc.id}`);
  db.delete(`hesapismiasreaper-${silinecekkllnc.id}`);
  
  message.channel.send(`${message.author}, kullanıcının hesabı başarıyla silindi!`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sil'],
  permLevel: 0
};

exports.help = {
  name: 'delacc',
  description: 'Asreaper',
  usage: 'Doğru Kullanım: **.sil @kullanıcı**'
};
