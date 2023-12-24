// vhourly.js
const Discord = require('discord.js');
const db = require('quick.db');

const fixedAmountHourly = 799999; // Saatlik sabit para miktarı

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
  const lastUsedHourly = db.fetch(`lastVHourlyUsed_${user.id}`) || 0;
  const cooldownHourly = 2 * 60 * 60 * 1000; // 1 saat

  if (Date.now() - lastUsedHourly < cooldownHourly) {
    return message.reply(`Bu komutu tekrar saatlik kullanabilmek için **${formatCooldown(lastUsedHourly + cooldownHourly - Date.now())}** süre boyunca bekleyin.`);
  }

  // Kullanıcının bakiyesine saatlik sabit para miktarını ekle
  db.add(`bakiyeasreaper-${user.id}`, fixedAmountHourly);

  // Son kullanma zamanını güncelle
  db.set(`lastVHourlyUsed_${user.id}`, Date.now());

  message.reply(`Başarıyla saatlik ${formatCurrency(fixedAmountHourly, client.ekoayarlar.parabirimi)} aldınız!`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['vipwage'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'vwage',
  description: 'VIP kullanıcılara saatlik sabit para verir.',
  usage: 'vwage',
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