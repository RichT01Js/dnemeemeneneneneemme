const Discord = require("discord.js");
const db = require("quick.db");
const Canvas = require('canvas')
    , Image = Canvas.Image
    , Font = Canvas.Font
    , path = require('path');
const request = require('node-superfetch');

exports.run = async (client, message, args) => {
  let member = message.author;
  let member2 = message.mentions.members.first()
  let kllanç = message.mentions.users.first() || message.author;
  const bakiye = await db.fetch(`bakiyeasreaper-${kllanç.id}`);
  const hesapdurumu = await db.fetch(`hesapdurumasreaper-${kllanç.id}`);
  const hesapismi = await db.fetch(`hesapismiasreaper-${kllanç.id}`);
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}  

  // Para miktarını biçimlendirme işlemi
  const formattedBakiye = new Intl.NumberFormat().format(bakiye);

  if (!member2) return message.reply(exports.help.usage)
  if (!hesapdurumu) {
    if (args[0])
      return message.reply(
        `Kullanıcının hesabı yok`
      );
    message.reply(client.ekoayarlar.hesapolusturmsg);
  } else {
    if (hesapdurumu) {
      const embedczdn = new Discord.MessageEmbed()
        .setTitle(`Bakiye Sorgulama`)
        .setFooter(client.ekoayarlar.embedmesajyapimci)
        .setColor(client.ekoayarlar.renk)
        .setTimestamp() // Embedin gönderildiği tarih ve saat
        .setDescription(
          `> **${hesapismi ? hesapismi : 'Bilinmiyor.'}** adlı kullanıcının toplam \n > **${formattedBakiye} ${client.ekoayarlar.parabirimi}** bakiyesi bulunuyor.`
        )
        .addField('Hesap Sahibi', member2, true); // Burada kullanıcının etiketini ekledik.

      message.channel.send(embedczdn);
    } else {
      if (hesapdurumu) {
        if (hesapismi) {
          const { createCanvas, loadImage } = require("canvas");
          const canvas = createCanvas(1092, 678);
          const ctx = canvas.getContext("2d");

          const background = await Canvas.loadImage(
            "https://cdn.discordapp.com/attachments/611466015582322700/668155571492356117/woxecredit.png"
          );
          ctx.drawImage(background , 0 ,0 , canvas.width , canvas.height);
          
          const avatar = await Canvas.loadImage(member2.displayAvatarURL)
          ctx.drawImage(avatar , 500 , 200 , 250 , 250)
          
          ctx.font = '60px sans-serif';
          ctx.fillStyle = "BLACK";
          ctx.fillText(`${member2.id}` , canvas.width / 5, 550 )
          
          ctx.font = '60px sans-serif';
          ctx.fillStyle = "BLACK";
          ctx.fillText(`Para: ${formattedBakiye}` , canvas.width / 3.25, 650 )
          
          const attachment = new Discord.Attachment(
            canvas.toBuffer(),
            "Hoşgeldin.png"
          );
          
          message.channel.send(attachment)
        }
      }
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  katagori: "Ekonomi"
};
exports.help = {
  name: "cash",
  description: "sa",
  usage: "Doğru Kullanım: **.cash @kullanıcı**"
};
