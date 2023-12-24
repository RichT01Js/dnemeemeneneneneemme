const Discord = require('discord.js');

exports.run = (client, message, args) => {
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  const helpEmbed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setAuthor('🍂 SlotRUSH User Command')
    .setDescription(`
    > tüm kullanıcı komutları aşağıda listelenmiştir:
    > 
    > \`${client.ekoayarlar.botunuzunprefixi}acc <hesapismi>\` **->** kullanıcı hesabı açarsınız.
    > \`${client.ekoayarlar.botunuzunprefixi}accdel\` **->** kullanıcı hesabı siler.
    > \`${client.ekoayarlar.botunuzunprefixi}status\` **->** Hesap istatistiklerini görüntüler. 
    > \`${client.ekoayarlar.botunuzunprefixi}sıralama\` **->** En Zengin 10 kişiyi gösterir.
    > \`${client.ekoayarlar.botunuzunprefixi}pinfo <@kullanıcı>\` **->** Kullanıcının hesabını görüntüler.
    > \`${client.ekoayarlar.botunuzunprefixi}cash <@kullanıcı>\` **->** Kullanıcının bakiyesini görüntüler.
    > \`${client.ekoayarlar.botunuzunprefixi}send <@kullanıcı> <miktar>\` **->** Kullanıcıya bakiye gönderir.
    > \`${client.ekoayarlar.botunuzunprefixi}daily\` **->** Günlük para alırsınız.
    > \`${client.ekoayarlar.botunuzunprefixi}mağaza\` **->** Mağazayı görüntülersiniz.
    > \`${client.ekoayarlar.botunuzunprefixi}satınal <ürün>\` **->** Mağazadan ürün alırsınız.
    > 
    > komutlar hakkında daha fazla bilgi almak için: \`@SlotRUSH\`.
    
    
    `)
     .setFooter(client.ekoayarlar.embedmesajyapimci)
     .setImage(client.ekoayarlar.embedgif) // Embedin içinde büyük bir resim (image)
    .setTimestamp() // Embedin gönderildiği tarih ve saat
  message.channel.send(helpEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['kullanıcı' , 'user'],
  permLevel: 0,
};

exports.help = {
  name: 'kullanıcı',
  description: 'Kullanılabilir komutları gösterir.',
  usage: 'help',
};