// balikavi.js (Güncellenmiş Balık Avı oyunu)
const Discord = require('discord.js');
const db = require('quick.db');

const fishingCooldown = 10000; // Balık avı için bekletme süresi
const fishTypes = [
  { name: 'sazan', value: 18999, chance: 20 },
  { name: 'alabalık', value: 15560, chance: 20 },
  { name: 'turna', value: 53000, chance: 20 },
  { name: 'levrek', value: 25310, chance: 20 },
  { name: 'gümüş balığı', value: 30000, chance: 20 },
  { name: 'Ayakkabı', value: 0, chance: 25 },
  { name: 'Altın külçe', value: 30785123, chance: 3 },
  { name: 'yunus balığı', value: 800000, chance: 3 },
  { name: 'balon balığı', value: 300000, chance: 3 },
  { name: 'elmas balığı', value: 1000000, chance: 3 },
];

const eventChances = [
  { name: 'Hava yağmurlu olduğu için balığa çıkamadın!', chance: 5 },
  { name: 'Deniz bugun çok durgun! balıklar firar etmiş', chance: 5 },
  { name: 'Fabrika pisliğine mahçup kalmış ölü bir balık yakaladın.', chance: 5 },
  { name: 'Yavru balık yakaladın ama bi boka yaramadığı için geri bıraktın.', chance: 5 },
];

function formatCurrency(amount) {
  return amount.toLocaleString('tr-TR'); // Türkçe para formatı için tr-TR kullanılıyor
}

exports.run = async (client, message, args) => {
  if (message.channel.type === 'dm') {
    return message.reply('Balık avını sadece sunucularda oynayabilirsin.');
  }

  const user = message.author;
  const currentTime = Date.now();
  const lastFishingTime = db.fetch(`lastFishingTime_${user.id}`) || 0;

  if (currentTime - lastFishingTime < fishingCooldown) {
    const remainingTime = fishingCooldown - (currentTime - lastFishingTime);
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.ceil((remainingTime % 60000) / 1000);

    return message.reply(`tekrar balığa çıkabilmek için ${seconds} saniye boyunca beklemelisin.`);
  }

  // Mağaza kontrolü
  const userInventory = db.fetch(`inventory_${user.id}`) || [];
  const oltaCount = userInventory.filter(item => item === 'olta').length;

  if (oltaCount === 0) {
    return message.reply(`Balık tutabilmek için bir oltaya sahip olman gerekiyor! **${client.ekoayarlar.botunuzunprefixi}mağaza**`);
  }

  let fishValue = 0;
  let randomFish;

  const randomEvent = eventChances.find(event => Math.random() * 100 < event.chance);

  if (randomEvent) {
    message.channel.send(`${user}, ${randomEvent.name}`);
  } else {
    // Balıkların toplam şansını hesapla
    const totalFishChance = fishTypes.reduce((total, fish) => total + fish.chance, 0);

    // Rastgele bir sayı üret
    const randomChance = Math.random() * totalFishChance;

    // Hangi balığın seçileceğini belirle
    let cumulativeChance = 0;
    for (const fish of fishTypes) {
      cumulativeChance += fish.chance;
      if (randomChance <= cumulativeChance) {
        randomFish = fish;
        break;
      }
    }

    fishValue = randomFish.value;
    db.add(`bakiyeasreaper-${user.id}`, fishValue);
  }

  const userBalance = db.fetch(`bakiyeasreaper-${user.id}`);
  const hasAccount = db.fetch(`hesapdurumasreaper-${user.id}`);

  if (!userBalance || userBalance <= 0 || !hasAccount) {
    return message.reply(`Sanırım paran veya hesabın yok.`);
  }

  db.set(`lastFishingTime_${user.id}`, currentTime);
  db.add(`oltaCount_${user.id}`, 1);
  const newOltacount = db.fetch(`oltaCount_${user.id}`);

  if (newOltacount >= 21) {
    db.subtract(`oltaCount_${user.id}`, 19);
    const oltaIndex = userInventory.indexOf('olta');
    userInventory.splice(oltaIndex, 1);
    db.set(`inventory_${user.id}`, userInventory);
    message.reply(`Oltan kırıldı! yeni bir oltaya ihtiyacın var. **${client.ekoayarlar.botunuzunprefixi}mağaza**`);
  }

  if (fishValue > 0) {
    message.channel.send(`${user} balık avına çıktın ve **${formatCurrency(fishValue)}${client.ekoayarlar.parabirimi}** değerinde bir **${randomFish.name}** yakaladın.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['balik', 'balıktut', 'baliktut'],
  permLevel: 0,
  katagori: 'Eğlence',
};

exports.help = {
  name: 'fish',
  description: 'Balık avına çıkarak para kazanın.',
  usage: 'balikavi',
};
