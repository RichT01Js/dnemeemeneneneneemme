// vdaily.js
const Discord = require('discord.js');
const db = require('quick.db');

const fixedAmountDaily = 4999999; // Günlük sabit para miktarı

exports.run = async (client, message, args) => {
  const user = message.author;
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  // Kullanıcının özel rütbesine sahip olup olmadığını kontrol et
  const userRoles = db.fetch(`ruthierarchyasreaper-${user.id}`) || [];
  const isVIP = userRoles.includes('VIP');

  if (!isVIP) {
    return message.reply(`Bu komutu kullanabilmek için VIP üyeliğiniz olmalı. VIP üyeliği için mağazaya göz atın: \`${client.ekoayarlar.botunuzunprefixi}mağaza\``);
  }

  // Son kullanma zamanını kontrol et
  const lastUsedDaily = db.fetch(`lastVDailyUsed_${user.id}`) || 0;
  const cooldownDaily = 48 * 60 * 60 * 1000; // 2 gün

  if (Date.now() - lastUsedDaily < cooldownDaily) {
    return message.reply(`Bu komutu tekrar günlük kullanabilmek için **${formatCooldown(lastUsedDaily + cooldownDaily - Date.now())}** süre boyunca bekleyin.`);
  }

  // Kullanıcının bakiyesine günlük sabit para miktarını ekle
  db.add(`bakiyeasreaper-${user.id}`, fixedAmountDaily);

  // Son kullanma zamanını güncelle
  db.set(`lastVDailyUsed_${user.id}`, Date.now());

  message.reply(`Başarıyla günlük ${formatCurrency(fixedAmountDaily, client.ekoayarlar.parabirimi)} aldınız!`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['vipdaily'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'vdaily',
  description: 'VIP kullanıcılara günlük sabit para verir.',
  usage: 'vdaily',
};
// formatCooldown fonksiyonu: Verilen süreyi düzenli bir şekilde biçimlendirir
function formatCooldown(time) {
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours} saat, ${minutes % 60} dakika, ${seconds % 60} saniye`;
}

// formatCurrency fonksiyonu: Belirtilen miktarı belirli bir para birimine göre biçimlendirir
function formatCurrency(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;
}