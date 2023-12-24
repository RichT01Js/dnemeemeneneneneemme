// addperm.js
const Discord = require('discord.js');
const db = require('quick.db');

function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const allowedRoles = ['Üye', 'VIP', 'Premium', 'Emekli', 'Admin', 'Kurucu'];

exports.run = async (client, message, args) => {
if (!client.ekoayarlar.admin.includes(message.author.id)) return message.reply(`Bunu yapabilmek için gerekli yetkiye sahip değilsin!`);

  const user = message.mentions.users.first();
  if (!user) return message.reply(exports.help.usage);
  
  const role = args[1];
  if (!role) return message.reply('Geçerli bir rütbe belirtin: Üye, Vip, Emekli, Admin, Kurucu');

  // Eğer geçerli bir rütbe değilse işlem yapma
  if (!allowedRoles.includes(role)) {
    return message.reply('Geçerli bir rütbe belirtin: Üye, Vip, Emekli, Admin, Kurucu');
  }
  
  // Kullanıcının hesap durumunu kontrol et
  const hesapDurumu = await db.fetch(`hesapdurumasreaper-${user.id}`);
  if (!hesapDurumu) return message.reply(`${user.tag} kullanıcısının hesabı bulunmamakta. Hesap oluşturması için: ${client.ekoayarlar.botunuzunprefixi}acc <Hesap İsmi>`);

  const hesapismi = await db.fetch(`hesapismiasreaper-${user.id}`) || 'Bilinmiyor';

  // Kullanıcının zaten belirli bir yetkiye sahip olup olmadığını kontrol et
  const existingRoles = await db.fetch(`ruthierarchyasreaper-${user.id}`) || [];

  // Eğer rütbe zaten ekli ise işlem yapma
  if (existingRoles.includes(role)) return message.reply(`${user.tag} kullanıcısı zaten bu rütbede.`);

  // Yeni rütbe ve süresi ekleniyor
  existingRoles.push(role);
  db.set(`ruthierarchyasreaper-${user.id}`, existingRoles);

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
    > **${existingRoles.join(',  ')}**
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
  name: 'addp',
  description: 'Belirli bir süre boyunca belirli bir rütbe verir.',
  usage: 'Doğru Kullanım: **.addperm <@kullanıcı> <rütbe>**',
};
