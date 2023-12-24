// accdelete.js
const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
  const user = message.author;
  const hesapDurumu = await db.fetch(`hesapdurumasreaper-${user.id}`);

  if (!hesapDurumu) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  const filter = (response) => {
    return response.author.id === user.id;
  };

  const embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('UYARI')
    .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setDescription(`
${message.author}
> Hesabını silmek üzeresin emin misin?
> **"Evet"** Veya **"Hayır"** Yazın!

> # Unutma !
> Hesabın tüm sorumluluğu size aittir.
> Hesap silme işlemini onayladığınızda;
> **bakiye, envanter, yetkiler, özellikler,** ve **komut kullanma** gibi bir çok özelliği kaybedeceksiniz.

`)
    .setTimestamp();

  await message.channel.send(embed);

  message.channel.awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
    .then(async (collected) => {
      const response = collected.first().content.toLowerCase();

      if (response === 'evet') {
        // Hesap ile ilgili tüm verileri temizle
        await db.delete(`bakiyeasreaper-${user.id}`);
        await db.delete(`hesapdurumasreaper-${user.id}`);
        await db.delete(`hesapismiasreaper-${user.id}`);
        await db.delete(`ruthierarchyasreaper-${user.id}`);
        await db.delete(`achievements_${user.id}`);
        await db.delete(`playedCommandsCount_${user.id}`);

        // Kullanıcının envanterini temizle
        const userInventory = db.fetch(`inventory_${user.id}`) || [];
        if (userInventory.length > 0) {
          await db.delete(`inventory_${user.id}`);
        }

        message.channel.send(`${user}, Hesabınız başarıyla silindi.`);

        // Yavaş modu etkinleştir (30 dakika)
        const cooldownTime = 30 * 60 * 1000; // 30 dakika
        await db.set(`hesapsilcooldown-${user.id}`, true);
        setTimeout(async () => {
          await db.delete(`hesapsilcooldown-${user.id}`);
        }, cooldownTime);
      } else {
        message.channel.send(`${user}, İşlem iptal edildi.`);
      }
    })
    .catch(() => {
      message.channel.send(`${user}, Hesap silme işlemi zaman aşımına uğradı.`);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['accdel'],
  permLevel: 0,
  katagori: 'Ekonomi',
};

exports.help = {
  name: 'accdelete',
  description: 'Hesabınızı siler.',
  usage: '/accdelete',
};
