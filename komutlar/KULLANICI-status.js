// status.js
const Discord = require('discord.js');
const db = require('quick.db');

// Başarımlar kategorilerine göre gruplandırılır
const achievementCategories = {
  'Slot Başarımları': ['Başlangıç Çarkı', 'Slotçu', 'Bağımlı', 'Kumarbaz I'],
  'Rastgele Para Başarımları': ['Beleşçi', 'Cenabettin', 'Para Gözlü', 'Altın Çocuk'],
  'ÇarkıFelek Başarımları': ['Çarkçı', 'Çark Ustası','Rulet Kralı','Kumarbaz II']
};

exports.run = async (client, message, args) => {
  const user = message.author;
  const hasAccount = db.fetch(`hesapdurumasreaper-${user.id}`);
  if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  if (!hasAccount) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  const userName = db.fetch(`hesapismiasreaper-${user.id}`);
  const accountOwner = message.guild.members.cache.get(user.id).displayName;
  const userId = user.id;
  const userAchievements = db.fetch(`achievements_${user.id}`) || [];

  const embed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setTitle(`${accountOwner}'`)
    .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setImage(client.ekoayarlar.embedgif)
    .setDescription(`> **${user}** adlı kullanıcının istatistikleri:`);

  // Başarımları kategorilere göre grupla
  const groupedAchievements = {};
  for (const category in achievementCategories) {
    groupedAchievements[category] = userAchievements.filter((achievement) =>
      achievementCategories[category].includes(achievement)
    );
  }

  // Kategorilere göre başarımları ekle
  for (const category in groupedAchievements) {
    const totalAchievementsInCategory = achievementCategories[category].length;
    const earnedAchievementsInCategory = groupedAchievements[category].length;
    const remainingAchievementsInCategory = totalAchievementsInCategory - earnedAchievementsInCategory;

    if (earnedAchievementsInCategory > 0) {
      const achievementsList = groupedAchievements[category].map((achievement) => `${achievement}`).join(', ');
      embed.addField(`**${category} (${earnedAchievementsInCategory}/${totalAchievementsInCategory}):**`, achievementsList);
    } else {
      embed.addField(`**${category} (${earnedAchievementsInCategory}/${totalAchievementsInCategory}):**`, 'Hiç kazanılmış başarı yok.');
    }
  }

  // Eğer hiç başarı alınmamışsa
  if (userAchievements.length === 0) {
    embed.addField('**Başarımlar:**', 'Hiçbir başarı kazanılmamış.');
  }

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['stats'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'status',
  description: 'Hesap bilgilerini gösterir.',
  usage: 'status',
};
