const Discord = require('discord.js');

exports.run = (client, message, args) => {
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}
  const helpEmbed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setAuthor('🍂 Slot Info')
    .setDescription(`
     **Slot Amacı & Kuralları**
     > Slot oyunu, __şansa dayalı__ bir kumar oyunudur. Amacınız, slot makinesinin üç sıradan oluşan slot yuvalarında iki veya üç aynı sembolleri elde etmek veya belirli semboller kombinasyonlarını yakalamaktır.
     
     > İki veya daha fazla aynı sembolü yanyana veya çapraz olarak yakalarsanız, bahis miktarınızdan fazla para elde edebilirsiniz.
     
     **Sembol Kazanç Oranları**
     > 🍇 , 🍋 , 🍆 , 🍒 = **2x**
     > 💰 , 💸 , 💷 , 💎 , = **3x**
     > 💳 = **5x**

     > **NOT:** Şansa dayalı bir oyundur, bu nedenle sonuçlar rastgele olacaktır. Kazançlı dönüşler elde etmeye çalışırken, dikkatli olun ve kumarı sorumlu bir şekilde oynayın.
     > NOT2: Minimum **10,000** , Maksimum **10,000,000** yatırabilirsiniz.
    `)
    .setFooter(client.ekoayarlar.embedmesajyapimci)
    .setImage(client.ekoayarlar.embedgif) // Embedin içinde büyük bir resim (image)
    .setTimestamp() // Embedin gönderildiği tarih ve saat
  message.channel.send(helpEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['slh' , 'slhelps'],
  permLevel: 0,
};

exports.help = {
  name: 'slhelp',
  description: 'Kullanılabilir komutları gösterir.',
  usage: 'help',
};