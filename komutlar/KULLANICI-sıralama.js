const Discord = require('discord.js');
const db = require('quick.db');

function formatCurrency(amount, currency) {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${currency}`;
}

exports.run = async (client, message, args) => {
  // 5 saniyede bir çalışmasını sağlamak için cooldown kontrolü
  if (client.siralamacooldown && client.siralamacooldown > Date.now()) {
    return message.reply(`Bu komutu sadece 5 saniyede bir kullanabilirsin.`);
  if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  }

  // Cooldown başlat
  client.siralamacooldown = Date.now() + 5000;

  // En zengin ilk 10 kişiyi göster
  const userList = await db
    .all()
    .filter((data) => data.ID && data.ID.startsWith('bakiyeasreaper-'))
    .sort((a, b) => (b.data || 0) - (a.data || 0))
    .slice(0, 10);

  const leaderboardEmbed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setTitle('En Zengin 10 Kişi ( beta )')
    .setFooter(client.ekoayarlar.embedmesajyapimci);

  if (userList.length === 0) {
    // Eğer hiç kullanıcı yoksa
    leaderboardEmbed.setDescription('Kullanıcı bulunmuyor.');
  } else {
    // Kullanıcılar varsa
    leaderboardEmbed.setDescription(
      userList.map((data, index) => `${index + 1}. ${data.ID.slice(16)} - ${formatCurrency(data.data, client.ekoayarlar.parabirimi)}`)
    );
  }

  message.channel.send(leaderboardEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['leaderboard', 'top10', 'zenginler'],
  permLevel: 0,
  katagori: 'Ekonomi',
};

exports.help = {
  name: 'sıralama',
  description: 'En zengin 10 kişiyi gösterir.',
  usage: '/sıralama',
};
