const Discord = require('discord.js');

exports.run = (client, message, args) => {
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  const helpEmbed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setAuthor('🍂 CarkıFelek Info')
    .setDescription(`
**Çarkıfelek Oyunu Kuralları ve Oynanışı**

> Çarkıfelek oyunu şansa dayalı bir ekonomi oyunudur. Oyunun temel amacı doğru renge bahis yaparak kazanç elde etmektir.

**Nasıl Oynanır?**
> 1. Başlamak için **.cf <bahis> <renk>** komutunu kullanın. Örneğin, **.cf 1000 kırmızı** şeklinde bir bahis yapabilirsiniz.
> 2. Bahis miktarınızı ve bahis renginizi seçtikten sonra çark dönmeye başlar.
> 3. Çark durduğunda, çarkın gösterdiği renge göre kazanıp kaybettiğinizi kontrol edin.

**Renkler ve Kazançlar:**
> - Kırmızı: 3 x
> - Siyah: 3 x
> - Mavi: 3 x
> - Yeşil: 5 x *(Daha nadir)*

**Önemli Bilgiler:**
> - Minimum bahis miktarı **1.000** birimdir.
> - Maksimum bahis miktarı **8.000.000** birimdir.
> - Çarkıfelek bileti satın alarak oyunu oynayabilirsiniz. Bilet satın almak için **.mağaza** komutunu kullanabilirsiniz.

**Başarımlar:**
> Çarkıfelek oynayarak çeşitli başarılar kazanabilirsiniz. Başarımları görmek için **.status** komutunu kullanabilirsiniz.

> Unutmayın, çarkıfelek oyunu tamamen şansa dayalıdır. Şans size gülerse büyük kazançlar elde edebilirsiniz!
    `)
     .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setImage(client.ekoayarlar.embedgif) // Embedin içinde büyük bir resim (image)
    .setTimestamp() // Embedin gönderildiği tarih ve saat
  message.channel.send(helpEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['cfh' , 'cfhelps'],
  permLevel: 0,
};

exports.help = {
  name: 'cfhelp',
  description: 'Kullanılabilir komutları gösterir.',
  usage: 'help',
};