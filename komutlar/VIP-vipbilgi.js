const Discord = require('discord.js');

exports.run = (client, message, args) => {
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  const helpEmbed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setAuthor('💰 SlotRUSH VIP Information ( BETA )')
    .setDescription(`
    > tüm rütbe bilgilenirmeleri aşağıda listelenmiştir:
    > 
    > **VIP Üyelik Bilgileri**
    > - Özel \`VIP\` rütbesi ile profiline hava kat
    > - Profilini dilediğin gibi özelleştir *( beta )*
    > - Mağaza'da tüm ürünleri \`%50\` indirim ile satın al *( beta )*
    > - Sana özel komutlar ile dilediğin gibi harca veya kazan
    > - Tüm oyunlarda \`%55\` daha kazançlı ol *( beta )* 
    > 
    > **VIP Üyelik Komutları**
    > - \`${client.ekoayarlar.botunuzunprefixi}vdaily\` komutu ile saat başı **800.000${client.ekoayarlar.parabirimi}** ödeme al
    > - \`${client.ekoayarlar.botunuzunprefixi}vwage\` komutu ile her gün **5.000.000${client.ekoayarlar.parabirimi}** ödeme al
    > - \`${client.ekoayarlar.botunuzunprefixi}vprofile\` komutu ile dilediğin gibi profilini özelleştir *( beta )*
    > - \`${client.ekoayarlar.botunuzunprefixi}vip\` Mağazadan satın aldığınız VIPyi aktifleştirir.*
    > 
    > - VIP üyeliği için mağazaya göz atın: \`${client.ekoayarlar.botunuzunprefixi}mağaza\`
    `)
    .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setImage(client.ekoayarlar.embedgif) // Embedin içinde büyük bir resim (image)
    .setTimestamp() // Embedin gönderildiği tarih ve saat
  message.channel.send(helpEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['vipbilgi' , 'vipbilgi'],
  permLevel: 0,
};

exports.help = {
  name: 'vipbilgi',
  description: 'Kullanılabilir komutları gösterir.',
  usage: 'staff',
};








