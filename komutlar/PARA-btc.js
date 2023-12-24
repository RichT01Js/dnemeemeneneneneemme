const db = require('quick.db');

const commandCooldowns = new Map(); // Map kullanıyoruz
const cooldownTime = 2 * 60 * 60 * 1000; // 2 saat (milisaniye cinsinden)

function formatCurrency(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;
}

exports.run = async (client, message, args) => {
  const currency = client.ekoayarlar.parabirimi;
  const user = message.author;
  const hasAccount = db.fetch(`hesapdurumasreaper-${user.id}`);
  if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  if (!hasAccount) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  // Kullanıcının envanterini kontrol et
  const userInventory = db.fetch(`inventory_${user.id}`) || [];

  // "btcmakinesi" adlı ürünün envanterde olup olmadığını kontrol et
  if (!userInventory.includes('bilgisayar')) {
    return message.reply(`Sanırım mining yapabilmek için bir bilgisayarınız yok. **${client.ekoayarlar.botunuzunprefixi}mağaza**`);
  }

  let userBalance = db.fetch(`bakiyeasreaper-${user.id}`);

  if (userBalance === null || userBalance < 0) {
    userBalance = 0;
  }

  // Eğer kullanıcı daha önce /btc komutunu kullanmışsa ve cooldown süresi bitmemişse
  if (commandCooldowns.has(user.id) && Date.now() - commandCooldowns.get(user.id) < cooldownTime) {
    const kalanSure = (cooldownTime - (Date.now() - commandCooldowns.get(user.id))) / 1000;
    const formatliSure = sureFormatla(kalanSure);
    message.reply(`tekrar kullanabilmek için ${formatliSure} süre boyunca bekleyin.`);
    return;
  }

  const kazanmaSansi = Math.random() < 1.0;

  let sonucMesaji = '';

  if (kazanmaSansi) {
    // Kazanma durumunda yapılacak işlemler
    const kazanmaMesajlari = [
      { miktar: 1500000, mesaj: `${user}, mining yaparak **0.9 SR** kar elde ettin. *(**+{miktar}**)*` },
      { miktar: 2000000, mesaj: `${user}, mining yaparak **2.3 SR** kar elde ettin. *(**+{miktar}**)*` },
      // Diğer kazanma mesajlarını ekleyin
    ];

    const kazanmaMesaji = kazanmaMesajlari[Math.floor(Math.random() * kazanmaMesajlari.length)];
    const kazancMiktari = kazanmaMesaji.miktar;
    userBalance += kazancMiktari;
    db.set(`bakiyeasreaper-${user.id}`, userBalance);

    const formatliKazancMiktari = formatCurrency(kazancMiktari, currency);
    sonucMesaji = kazanmaMesaji.mesaj.replace('{miktar}', formatliKazancMiktari);
  } else {
    // Kaybetme durumunda yapılacak işlemler
    const kaybetmeMesajlari = [
      `${user}, Sanırım bugün şanssız günündesin.`,
      // Diğer kaybetme mesajlarını ekleyin
    ];

    sonucMesaji = kaybetmeMesajlari[Math.floor(Math.random() * kaybetmeMesajlari.length)];
  }

  // Kullanıcıya sonuç mesajını gönder
  message.channel.send(sonucMesaji);

  // Kullanıcının cooldown süresini set et
  commandCooldowns.set(user.id, Date.now());

  setTimeout(() => {
    // Kullanıcının cooldown süresini sıfırla
    commandCooldowns.delete(user.id);
  }, cooldownTime);
};

function sureFormatla(saniye) {
  const saat = Math.floor(saniye / 3600);
  const dakika = Math.floor((saniye % 3600) / 60);
  const kalanSaniye = Math.floor(saniye % 60);
  return `${saat} saat, ${dakika} dakika, ${kalanSaniye} saniye`;
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['btc'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'btc',
  description: 'Mining yaparak para kazanırsınız.',
  usage: 'btc',
};
