const Discord = require('discord.js');
const db = require('quick.db');

const maxBetAmount = 8000000; // Maksimum bahis miktarı
const cooldownTime = 12000; // Bekleme süresi (12 saniye)
const ticketItem = 'carkbileti'; // Çark bileti ürününün adı

const wheelColors = [
  { name: '📕', multiplier: 3, label: 'kırmızı' },//📕
  { name: '📓', multiplier: 3, label: 'siyah' },//📓
  { name: '📘', multiplier: 3, label: 'mavi' },//📘
  { name: '📗', multiplier: 5, label: 'yeşil' }, //📗
];

const achievements = [
  { name: 'Çarkçı', count: 1 },
  { name: 'Çark Ustası', count: 3 },
  { name: 'Rulet Kralı', count: 4 },
  { name: 'Kumarbaz II', count: 5 },
];

function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function parseBetAmount(input) {
  const parsedAmount = parseFloat(input.replace(/,/g, ''));
  return !isNaN(parsedAmount) ? Math.floor(parsedAmount) : null;
}

exports.run = async (client, message, args) => {
  if (message.channel.type === 'dm') {
    return message.reply(client.ekoayarlar.dmmesajgondermemsg);
  }

  const user = message.author;
  const inputAmount = args[0];
  const selectedColor = args[1];

  if (!inputAmount || !selectedColor) {
    return message.reply(exports.help.usage);
  }

  let betAmount = parseBetAmount(inputAmount);

  if (betAmount === null) {
    return message.reply(`Geçersiz bahis miktarı girdiniz.`);
  }

  if (betAmount < 1000 || betAmount > maxBetAmount) {
    return message.reply(`Minimum Bahis Miktarı **1.000**${client.ekoayarlar.parabirimi}\n Maksimum Bahis Miktarı **${formatCurrency(maxBetAmount)}${client.ekoayarlar.parabirimi}**.`);
  }

  const selectedColorInfo = wheelColors.find((color) => color.label === selectedColor.toLowerCase());

  if (!selectedColorInfo) {
    return message.reply(`Geçerli bir renk belirtin: ${wheelColors.map(color => color.label).join(', ')}`);
  }

  // Kullanıcının "Cark Bileti" ürününü satın alıp almadığını kontrol et
  const userInventory = db.fetch(`inventory_${user.id}`) || [];
  if (!userInventory.includes(ticketItem)) {
    return message.reply(`Çarkıfelek oyununu oynamak için önce **${ticketItem}** satın almalısın. Satın almak için \`${client.ekoayarlar.botunuzunprefixi}mağaza\``);
  }

  // Çarkı döndür
  const spinningMessage = await message.channel.send(`${formatCurrency(betAmount)}${client.ekoayarlar.parabirimi}.....`);

  const spinDuration = 9000; // Dönme süresi (7 saniye)
  const totalFrames = 4; // Toplam dönme sayısı

  const shuffledColors = shuffleArray(wheelColors);
  const frames = shuffledColors.map(color => `》 ${color.name.repeat(3)} 《`);
  
  const resultColorInfo = wheelColors[Math.floor(Math.random() * wheelColors.length)];

  let frameIndex = 0;
  let interval;

  const animateSpin = () => {
    spinningMessage.edit(`${frames[frameIndex]}`);
    frameIndex = (frameIndex + 1) % totalFrames;
  };

  // Çark dönme animasyonunu başlat
  interval = setInterval(animateSpin, 998); // Her bir frame arasında 600 milisaniye (0.6 saniye) bekle

  // Çark dönme animasyonunu güncelle
  setTimeout(() => {
    clearInterval(interval);
    spinningMessage.edit(`》 ${resultColorInfo.name}${resultColorInfo.name}${resultColorInfo.name} 《`);

    // Kazanılan veya kaybedilen miktarı hesapla
    let winAmount = 0;

    if (resultColorInfo.label === selectedColorInfo.label) {
      winAmount = betAmount * selectedColorInfo.multiplier;
      db.add(`bakiyeasreaper-${user.id}`, winAmount);

      // Kazanılan başarımları kontrol et ve kazanılan başarımları kaydet
      let userAchievements = db.fetch(`achievements_${user.id}`) || [];

      for (const achievement of achievements) {
        const count = userAchievements.filter(a => a === achievement.name).length;
        if (count < achievement.count && count + 1 >= achievement.count) {
          userAchievements.push(achievement.name);
          db.set(`achievements_${user.id}`, userAchievements);
          message.channel.send(`${user}, **${achievement.name}** başarımını kazandın!`);
        }
      }
    } else {
      db.subtract(`bakiyeasreaper-${user.id}`, betAmount);
    }

    // Kazanma mesajını göster
    spinningMessage.edit(`》${resultColorInfo.name}${resultColorInfo.name}${resultColorInfo.name}《\n━━━━━━━━━━━━━━━\n${user}, ${winAmount > 0 ? `**__🎉TEBRIKLER!!🎉__** **${formatCurrency(betAmount)}${client.ekoayarlar.parabirimi}** tutarında bakiye yatırdın \n ve **__${formatCurrency(winAmount)}${client.ekoayarlar.parabirimi}__** KAZANDIN!!` : `**${formatCurrency(betAmount)}${client.ekoayarlar.parabirimi}** tutarında bakiye yatırdın ve kaybettin.`}`);

    // "Cark Bileti" ürününü kullanıcıdan kaldır

  }, spinDuration);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['çarkıfelek', 'cf', 'wheel'],
  permLevel: 0,
  category: 'Ekonomi',
};

exports.help = {
  name: 'çarkıfelek',
  description: 'Çarkıfelek oynayın ve şansa karşı para kazanın.',
  usage: 'Doğru Kullanım: **.cf <bahis> <renk>**',
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
