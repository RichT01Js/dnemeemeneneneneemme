const Discord = require('discord.js');

exports.run = (client, message, args) => {
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  const helpEmbed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setAuthor('🍂 Yazı-Tura Info')
    .setDescription(`
     **Yazı-Tura Amacı & Kuralları**
     > Yazı tura oyunu oldukça basit bir oyun türüdür. Oyunun temel amacı, bir sanal madeni paranın atılmasıyla belirlenen "yazı" veya "tura" sonucunu doğru tahmin etmektir. İşte nasıl oynandığına dair adımlar:
    
     > **/st <bahis> <yazı/tura>** şeklinde kullanılır.
     > eğer tahmininiz doğru ise belirlediğiniz bahis miktarının 2 katını alırsınız. yanlış ise yatırdığınız bahis miktarını kaybedersiniz.
    
     > **NOT:** Şansa dayalı bir oyundur, bu nedenle sonuçlar rastgele olacaktır. Kazançlı dönüşler elde etmeye çalışırken, dikkatli olun ve kumarı sorumlu bir şekilde oynayın.
     > NOT2: Minimum **100** , Maksimum **1,000,000** yatırabilirsiniz.
    `)
     .setFooter(client.ekoayarlar.embedmesajyapimci)
     .setImage(client.ekoayarlar.embedgif) // Embedin içinde büyük bir resim (image)
     .setTimestamp() // Embedin gönderildiği tarih ve saat
  message.channel.send(helpEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sth' , 'sthelps'],
  permLevel: 0,
};

exports.help = {
  name: 'sthelp',
  description: 'Kullanılabilir komutları gösterir.',
  usage: 'help',
};