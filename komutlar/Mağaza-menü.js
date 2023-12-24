// shop.js
const Discord = require('discord.js');
const db = require('quick.db');

const items = [
  { name: 'VIP', price: 29000000, stock: 10, description: 'VIP Hakkında daha fazla bilgi almak için `.vipbilgi`' },
  { name: 'Bilgisayar', price: 19000000, stock: 110, description: 'Bilgisayarda mining yaparak kar elde edebilirsin. daha fazla bilgi almak için `.chelp`' },
  { name: 'Çark Bileti', price: 22000000, stock: 60, description: 'ÇarkıFelek oyununu oynayabilmek için çark bileti almanız gerekmektedir. daha fazla bilgi almak için `.chelp` ' },
  { name: 'Madeni Para (1tl)', price: 1, stock: 1273, description: '1 TL.' },
  { name: 'Olta', price: 15000, stock: 373, description: 'Olta kullanarak balık avına çık daha fazla bilgi için `.chelp`' },
];

function formatCurrency(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;
}

exports.run = async (client, message, args) => {
  const user = message.author;

  if (message.channel.type === 'dm') {
    return message.reply(client.ekoayarlar.dmmesajgondermemsg);
  }

  const hasAccount = db.fetch(`hesapdurumasreaper-${user.id}`);
  if (!hasAccount) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  const userBalance = db.fetch(`bakiyeasreaper-${user.id}`);
  if (userBalance === null || userBalance < 0) {
    db.set(`bakiyeasreaper-${user.id}`, 0);
    return message.reply(`Sanırım yeterli bakiyeniz bulunmuyor.`);
  }

  const embed = new Discord.MessageEmbed()
    .setColor(client.ekoayarlar.renk)
    .setTitle('SlotRUSH Mağaza')
    .setImage(client.ekoayarlar.embedgif)
    .setDescription(`\n\n\n# >  ${formatCurrency(userBalance, client.ekoayarlar.parabirimi)}\nDesteğe mi ihtiyacın var? [Destek Sunucusuna](https://discord.gg/cNTCqVYQH9) katıl.`)
    .setTimestamp() //zaman

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const stock = db.fetch(`itemStock_${item.name}`) || item.stock;

    embed.addField(
      `▍**${item.name}**`,
      `> Stok Sayısı: **${stock}** \n> Ürün Fiyatı: **${formatCurrency(item.price, client.ekoayarlar.parabirimi)}** \n> Açıklama: **${item.description}**`
    );
  }

  embed.setFooter(client.ekoayarlar.embedmesajyapimci);

  message.channel.send(embed).then(async (shopMessage) => {
    for (let i = 0; i < items.length; i++) {
      await shopMessage.react(`🛒`);
    }

    const filter = (reaction, user) => {
      return reaction.emoji.name === '🛒' && user.id === message.author.id;
    };

    const collector = shopMessage.createReactionCollector(filter, { time: 60000 });

    collector.on('collect', async (reaction) => {
      reaction.users.remove(user);

      const selectedItemIndex = items.findIndex((item) => item.name.toLowerCase() === reaction.emoji.name.toLowerCase());

      if (selectedItemIndex !== -1) {
        const selectedItem = items[selectedItemIndex];

        const stock = db.fetch(`itemStock_${selectedItem.name}`) || selectedItem.stock;

        // Kullanıcının envanterini kontrol et
        const userInventory = db.fetch(`inventory_${user.id}`) || [];

        if (!userInventory.includes(selectedItem.name)) {
          if (stock > 0) {
            if (userBalance >= selectedItem.price) {
              // Kullanıcının bakiyesinden ürün fiyatını çıkar
              db.subtract(`bakiyeasreaper-${user.id}`, selectedItem.price);

              // Kullanıcının envanterine ürünü ekle
              userInventory.push(selectedItem.name);
              db.set(`inventory_${user.id}`, userInventory);

              // Stok miktarını güncelle
              db.set(`itemStock_${selectedItem.name}`, stock - 1);

              message.reply(`**${formatCurrency(selectedItem.price, client.ekoayarlar.parabirimi)}** tutarında **${selectedItem.name}** adlı ürünü satın aldınız.`);
            } else {
              message.reply('Yeterli paranız yok.');
            }
          } else {
            message.reply(`**${selectedItem.name}** Ürün şu anda stokta yok.`);
          }
        } else {
          message.reply(`Zaten **${selectedItem.name}** adlı ürünü satın almışsınız.`);
        }
      }
    });

    collector.on('end', () => {
      shopMessage.reactions.removeAll().catch((error) => console.error('Reactions could not be removed:', error));
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['store', 'shop'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'mağaza',
  description: 'Mağazaya göz atın ve ürünler satın alın.',
  usage: 'shop',
};
