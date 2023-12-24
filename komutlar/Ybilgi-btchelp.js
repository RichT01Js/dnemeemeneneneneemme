const Discord = require('discord.js');

exports.run = (client, message, args) => {
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  const helpEmbed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setAuthor('🍂 BTC Info')
    .setDescription(`
     **BTC Amacı & Kuralları**
     > BTC binevi mining sistemi gibidir. **1** SR **500.000💸** değerindedir. 
     > /btc komutunu kullanarak mining kazı işlemini başlatırsınız. mining kazı işlemi sona erdiğinde bot size bir hatırlatma mesajı gönderir ve kazdığınız parayı alabilirsiniz.
    
     > **NOT:** Şansa dayalı bir oyundur, bu nedenle sonuçlar rastgele olacaktır. Kazançlı dönüşler elde etmeye çalışırken, dikkatli olun ve kumarı sorumlu bir şekilde oynayın.
    `)
     .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setImage(client.ekoayarlar.embedgif) // Embedin içinde büyük bir resim (image)
    .setTimestamp() // Embedin gönderildiği tarih ve saat
  message.channel.send(helpEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['btch' , 'btchelps'],
  permLevel: 0,
};

exports.help = {
  name: 'btchelp',
  description: 'Kullanılabilir komutları gösterir.',
  usage: 'help',
};