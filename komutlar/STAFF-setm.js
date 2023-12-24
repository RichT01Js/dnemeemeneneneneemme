const Discord = require('discord.js');
const db = require('quick.db');
const ayarlar = require('../ayarlar.json');

exports.run = async (client, message, args) => {
  if (!client.ekoayarlar.admin.includes(message.author.id)) return message.reply(`Bunu yapabilmek için gerekli yetkiye sahip değilsin!`);
  const kullanici = message.mentions.members.first();
  let miktar = args[1];
  
  if (!kullanici) return message.channel.send(`Bir kullanıcı belirtmelisin!`);
  
  // Sayıları biçimlendiren fonksiyon
  function formatNumber(number) {
    return number.toLocaleString('tr-TR');
  }
  
  // Para miktarını biçimlendirme
  miktar = parseFloat(miktar.replace(',', '').replace('.', ''));
  if (isNaN(miktar)) return message.channel.send(`Geçerli bir para miktarı belirtmelisin!`);
  
  db.set(`bakiyeasreaper-${kullanici.id}`, miktar);
  
  // Biçimlendirilmiş para miktarını al
  const formattedMiktar = formatNumber(miktar);
  
  message.channel.send(`${kullanici} adlı kullanıcının hesabı **${message.author}(BANKA)** tarafından bakiyesi **${formattedMiktar} ${client.ekoayarlar.parabirimi}** olarak ayarlandı.`); 
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['moneyset'],
  permLevel: 0
}

exports.help = {
  name: 'setm',
  description: 'staff command [ x ]',
  usage: 'setmoney [@kullanıcı] [miktar]'
}
