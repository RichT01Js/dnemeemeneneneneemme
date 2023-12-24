// satınal.js
const Discord = require('discord.js');
const db = require('quick.db');

function formatCurrency(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;
}

exports.run = async (client, message, args) => {
  const user = message.author;
  const userBalance = db.fetch(`bakiyeasreaper-${user.id}`);
  if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  if (userBalance === null || userBalance < 0) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  const selectedItem = args[0];

  if (!selectedItem) {
    return message.reply(exports.help.usage);
  }

  const items = [
    { name: 'VIP', price: 11000000, stock: 10 },
    { name: 'bilgisayar', price: 19000000, stock: 110 },
    { name: 'carkbileti', price: 22000000, stock: 60 },
    { name: 'birlira', price: 1, stock: 1273 },
    { name: 'olta', price: 15000, stock: 373 },
  ];

  const selectedShopItem = items.find((item) => item.name.toLowerCase() === selectedItem.toLowerCase());

  if (!selectedShopItem) {
    return message.reply('Belirtilen isimde bir ürün bulunamadı.');
  }

  const stock = db.fetch(`itemStock_${selectedShopItem.name}`) || selectedShopItem.stock;

  // Kullanıcının envanterini kontrol et
  const userInventory = db.fetch(`inventory_${user.id}`) || [];

  if (!userInventory.includes(selectedShopItem.name)) {
    if (stock > 0) {
      if (userBalance >= selectedShopItem.price) {
        // Kullanıcının bakiyesinden ürün fiyatını çıkar
        db.subtract(`bakiyeasreaper-${user.id}`, selectedShopItem.price);

        // Kullanıcının envanterine ürünü ekle
        userInventory.push(selectedShopItem.name);
        db.set(`inventory_${user.id}`, userInventory);

        // Stok miktarını güncelle
        db.set(`itemStock_${selectedShopItem.name}`, stock - 1);

        message.reply(`**${formatCurrency(selectedShopItem.price, client.ekoayarlar.parabirimi)}** tutarında **${selectedShopItem.name}** adlı ürünü satın alma işleminiz başarıyla gerçekleşti.`);
      } else {
        message.reply('Yeterli paranız yok.');
      }
    } else {
      message.reply(`**${selectedShopItem.name}** Ürün şu anda stokta yok.`);
    }
  } else {
    message.reply(`**${selectedShopItem.name}** bu ürün envanterinizde zaten bulunuyor.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['buy'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'satınal',
  description: 'Mağazadan ürün satın alın.',
  usage: 'Doğru Kullanım: **.satınal <ürün>**',
};
