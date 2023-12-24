// delp.js
const Discord = require('discord.js');
const db = require('quick.db');

function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const allowedRoles = ['Üye', 'VIP', 'Premium', 'Emekli', 'Admin', 'Kurucu'];

exports.run = async (client, message, args) => {
if (!client.ekoayarlar.admin.includes(message.author.id)) return message.reply(`sg amk`)
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  const user = message.mentions.users.first();
  if (!user) return message.reply('Lütfen bir kullanıcı belirtin.');

  // Kullanıcının hesap durumunu kontrol et
  const hesapDurumu = await db.fetch(`hesapdurumasreaper-${user.id}`);
  if (!hesapDurumu) return message.reply(`${user.tag} kullanıcısının hesabı bulunmamakta.`);

  const hesapismi = await db.fetch(`hesapismiasreaper-${user.id}`) || 'Bilinmiyor';

  // Kullanıcının zaten belirli bir yetkiye sahip olup olmadığını kontrol et
  const existingRoles = await db.fetch(`ruthierarchyasreaper-${user.id}`) || [];

  // Eğer rütbe yoksa işlem yapma
  if (existingRoles.length === 0) return message.reply(`${user.tag} kullanıcısının herhangi bir rütbesi bulunmamaktadır.`);

  const roleToRemove = args[1];

  // Eğer geçerli bir rütbe değilse işlem yapma
  if (!allowedRoles.includes(roleToRemove)) {
    return message.reply('Geçerli bir rütbe belirtin: üye, vip, emekli, admin, kurucu');
  }

  // Eğer rütbe listede yoksa işlem yapma
  if (!existingRoles.includes(roleToRemove)) return message.reply(`${user.tag} kullanıcısının ${roleToRemove} rütbesi bulunmamaktadır.`);

  // Rütbe ve rütbe süresi veritabanından siliniyor
  const updatedRoles = existingRoles.filter(role => role !== roleToRemove);
  db.set(`ruthierarchyasreaper-${user.id}`, updatedRoles);

  // Eğer kullanıcının herhangi bir rütbesi kalmazsa otomatik olarak "Üye" rütbesini ekle
  if (updatedRoles.length === 0) {
    updatedRoles.push('Üye');
    db.set(`ruthierarchyasreaper-${user.id}`, updatedRoles);
  }

  const now = new Date();
  const hesaptarihyıl = now.getFullYear();
  const hesaptarihay = now.getMonth() + 1;
  const hesaptarihgün = now.getDate();

  const bakiye = await db.fetch(`bakiyeasreaper-${user.id}`) || 0;

  const embed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setTitle('Rütbe Güncellemesi')
    .setFooter('SlotRush Powered By Richardd')
    .setDescription(`
    > Hesap Sahibi: **${user}**
    > Hesap Adı: **${hesapismi}**
    > ID: **${user.id}**
     
    > Rütbeler: 
    > **${updatedRoles.join(',  ')}** 
    `);
  message.reply(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  katagori: "Ekonomi",
};

exports.help = {
  name: 'delp',
  description: 'Kullanıcının rütbelerini kaldırır.',
  usage: 'delperm <@kullanıcı> <rütbe>',
};
