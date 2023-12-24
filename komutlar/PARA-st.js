const db = require('quick.db');

const userCooldowns = new Map();
const cooldownTime = 5000; // 5 saniye (milisaniye cinsinden)

function formatCurrency(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;

}


exports.run = async (client, message, args) => {
  const minAmount = 100;
  const maxAmount = 1000000;
  const currency = client.ekoayarlar.parabirimi;
if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  const user = message.author;
  const hasAccount = db.fetch(`hesapdurumasreaper-${user.id}`);

  if (!hasAccount) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  // Kullanıcının envanterini kontrol et
  const userInventory = db.fetch(`inventory_${user.id}`) || [];

  // "birlira" adlı ürünün envanterde bulunup bulunmadığını kontrol et
  if (!userInventory.includes('birlira')) {
    return message.reply(`Sanırım bir liran yok satın almak için **${client.ekoayarlar.botunuzunprefixi}mağaza**`);
  }

  let userBalance = db.fetch(`bakiyeasreaper-${user.id}`);
  let commandCount = db.fetch(`commandCount_${user.id}`) || 0;

  if (userBalance === null || userBalance < 0) {
    userBalance = 0; // Eğer hesapta para yoksa veya eksi bakiye varsa bakiyeyi sıfırla
  }

  // Kullanıcının cooldown süresini kontrol et
  if (userCooldowns.has(user.id)) {
    const remainingTime = userCooldowns.get(user.id) - Date.now();
    if (remainingTime > 0) {
      return message.reply(`Lütfen ${formatCooldown(remainingTime)} sonra tekrar deneyin.`);
    }
  }

  const betAmount = parseInt(args[0]);
  const userChoice = args[1];

  if (isNaN(betAmount) || betAmount < minAmount || betAmount > maxAmount) {
    return message.reply(exports.help.usage);
  }

  if (userBalance < betAmount) {
    return message.reply('Yeterli bakiyeniz yok.');
  }

  if (!userChoice || (userChoice.toLowerCase() !== 'yazı' && userChoice.toLowerCase() !== 'tura')) {
    return message.reply('Lütfen "yazı" veya "tura" seçin.');
  }

  const winChance = Math.random() < 0.5; // %50 kazanma olasılığı
  const isWin = (userChoice.toLowerCase() === 'tura' && winChance) || (userChoice.toLowerCase() === 'yazı' && !winChance);

  let resultMessage = '';

  if (isWin) {
    const amountWon = betAmount * 2;
    userBalance += amountWon;
    db.set(`bakiyeasreaper-${user.id}`, userBalance);

    // Komut sayısını artır
    commandCount++;
    db.set(`commandCount_${user.id}`, commandCount);

    resultMessage = `${user}, **${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}** seçtin ve **+${formatCurrency(amountWon, currency)}** miktarında para **__KAZANDIN__**`;

    // Kullanıcının cooldown süresini ayarla
    userCooldowns.set(user.id, Date.now() + cooldownTime);
  } else {
    db.subtract(`bakiyeasreaper-${user.id}`, betAmount);

    resultMessage = `${user}, Bahisin tutmadı ve **-${formatCurrency(betAmount, currency)}** kaybettin.`;

    // Kullanıcının cooldown süresini ayarla
    userCooldowns.set(user.id, Date.now() + cooldownTime);
  }

  message.channel.send(resultMessage);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['st'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'st',
  description: 'Rastgele para kazanma veya kaybetme işlemi gerçekleştirir.',
  usage: 'Doğru Kullanım: **.st <miktar> <tura/yazı>**',
};

function formatCooldown(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} dakika ${seconds} saniye`;
}
