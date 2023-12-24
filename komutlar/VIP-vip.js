// vip.js (VIP komutu)
const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  // VIP rütbesini eklemek için gerekli rütbe ismi
  const vipRutbe = 'VIP';

  // Kullanıcının envanterini kontrol et
  const userInventory = db.fetch(`inventory_${message.author.id}`) || [];

  // Mağazadan satın alınan VIP komutunu kontrol et
  if (userInventory.includes('VIP')) {
    // Kullanıcının mevcut rütbelerini al
    let existingRoles = await db.fetch(`ruthierarchyasreaper-${message.author.id}`) || [];

    // Eğer kullanıcıda VIP rütbesi yoksa, VIP rütbesini ekle
    if (!existingRoles.includes(vipRutbe)) {
      existingRoles.push(vipRutbe);

      // Rütbeleri güncelle
      await db.set(`ruthierarchyasreaper-${message.author.id}`, existingRoles);

      // Kullanıcıya VIP verildiğini bildir
      message.reply(`3 Günlük VIP başarıyla etkinleştirildi.`);
    } else {
      // Kullanıcı zaten VIP ise uyarı ver
      message.reply(`Zaten VIP üyesisin.`);
    }
  } else {
    // Mağazadan VIP komutu satın alınmamışsa hata mesajı ver
    message.reply(`VIP olabilmeniz için mağazadan **VIP etkinleştirme** satın almalısınız. **/mağaza**`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  katagori: 'Rütbe',
};

exports.help = {
  name: 'vip',
  description: 'VIP rütbesini kullanıcıya ekler.',
  usage: '/vip',
};
