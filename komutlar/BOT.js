const Discord = require('discord.js');
const db = require('quick.db');
const os = require('os');

const userCooldowns = new Map();
const cooldownTime = 5000; // 5 saniye (milisaniye cinsinden)
const botStartTime = Date.now();

exports.run = async (client, message, args) => {
  // Kullanıcının cooldown süresini kontrol et
  if (userCooldowns.has(message.author.id)) {
    const remainingTime = userCooldowns.get(message.author.id) - Date.now();
    if (remainingTime > 0) {
      return message.reply(`${formatCooldown(remainingTime)} sonra tekrar dene.`);
    }
  }

  if (message.channel.type === 'dm') {
    return message.reply(client.ekoayarlar.dmmesajgondermemsg);
  }

  // /acc komutu ile hesap açan kişi sayısını al
  const registeredUsers = db.fetch(`kayitlikullanicilar_${client.user.id}`) || 0;

  // Sunucu bilgilerini al
  const servers = client.guilds.cache.size;
  const totalMembers = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);

  // Kayıtlı kullanıcı sayısını al
  const kayitliKullaniciSayisi = db.all().filter(data => data.ID && data.ID.startsWith('hesapdurumasreaper-')).length;

  // Bellek durumu
  const usedMemory = formatBytes(process.memoryUsage().heapUsed);

  // Aktif kalma süresi
  const uptime = formatUptime();

  // Embed mesajını oluştur
  const embed = new Discord.MessageEmbed()
    .setColor('#3498db')
    .setTitle('SlotRUSH STATUS PANEL')
    .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setDescription(`
> Yapımcılar: \`Richardd, Dominic\`
> Sunucular: \`${servers}/110\`
> Kullanıcılar: \`${totalMembers}/1.000\`
> Kayıtlı Kullanıcılar: \`${kayitliKullaniciSayisi}\`

> Aktif Kalma Süresi: \`${uptime} önce aktif edildi.\`
> Bellek Kullanımı: \`${usedMemory}/7000 MB\``)
    .setTimestamp();

  // Mesajı gönder
  message.channel.send(embed);

  // Kullanıcının cooldown süresini ayarla
  userCooldowns.set(message.author.id, Date.now() + cooldownTime);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['bot'],
  permLevel: 0,
  category: 'Genel',
};

exports.help = {
  name: 'bot',
  description: 'Botun durumunu gösterir.',
  usage: 'bot',
};

function formatUptime() {
  const uptimeSeconds = (Date.now() - botStartTime) / 1000;
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor(uptimeSeconds / 3600) % 24;
  const minutes = Math.floor(uptimeSeconds / 60) % 60;
  return `${days} gün, ${hours} saat, ${minutes} dakika`;
}

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
}

function formatCooldown(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} dakika ${seconds} saniye`;
}
