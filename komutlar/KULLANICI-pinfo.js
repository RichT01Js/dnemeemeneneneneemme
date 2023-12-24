// pinfo.js
const Discord = require('discord.js');
const db = require('quick.db');

function formatCurrency(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;
}

function getAchievementText(completedCount, totalCount) {
  return `${completedCount}/${totalCount}`;
}

exports.run = async (client, message, args) => {
  let kllanç;
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  if (args[0]) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.reply(exports.help.usage);
    kllanç = user;
  } else {
    kllanç = message.author;
  }

  const hesapDurumu = await db.fetch(`hesapdurumasreaper-${kllanç.id}`);
  if (!hesapDurumu) {
    if (args[0]) return message.reply(`Bakmak istediğin kullanıcının hesabı yok.`);
    message.reply(client.ekoayarlar.hesapolusturmsg);
    return;
  }

  const hesapismi = await db.fetch(`hesapismiasreaper-${kllanç.id}`) || 'Bilinmiyor';
  const now = new Date();
  const hesaptarihyıl = now.getFullYear();
  const hesaptarihay = now.getMonth() + 1;
  const hesaptarihgün = now.getDate();

  // Bakiyeyi alırken varsayılan değeri 0 olarak ayarla
  const bakiye = db.fetch(`bakiyeasreaper-${kllanç.id}`) || 0;

  // Kullanıcının envanterini kontrol et
  const userInventory = db.fetch(`inventory_${kllanç.id}`) || [];

  // Kullanıcının rütbelerini kontrol et
  const existingRoles = db.fetch(`ruthierarchyasreaper-${kllanç.id}`) || [];

  // Eğer rütbe yoksa Üye olarak varsay
  if (existingRoles.length === 0) existingRoles.push('Üye');

  // Kullanıcının başarımlarını kontrol et
  const allAchievements = ['Başarımlar', 'Buraya', 'Başarımları', 'Ekleyin']; // Başarımları buraya ekleyin
  const userAchievements = db.fetch(`achievements_${kllanç.id}`) || [];
  const achievementsText = getAchievementText(userAchievements.length, allAchievements.length);

  const embed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setImage(client.ekoayarlar.embedgif)
  
    .setDescription(`
    > Hesap Sahibi: **${kllanç}**
    > Hesap Adı: **${hesapismi}**
    > Bakiye: **${formatCurrency(bakiye, '💸')}**
    > ID: **${kllanç.id}**
    
    > Rütbeler: 
    > **${existingRoles.join(',  ')}**
    
    > Hesap Oluşturma Tarihi: **${hesaptarihay}/${hesaptarihgün}/${hesaptarihyıl}**
    > Durum: **${hesapDurumu}**
    > Başarımlar: **${achievementsText}**
    
    > Envanter:
    > **${userInventory.length > 0 ? userInventory.join('\n> ') : 'Envanteriniz boş.'}**
    `);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  katagori: 'Ekonomi',
};

exports.help = {
  name: 'pinfo',
  description: 'Kullanıcının hesap bilgilerini gösterir.',
  usage: 'Doğru Kullanım: **.pinfo @kullanıcı**',
};