// Rastgele Para Kazanma Kodu
const db = require('quick.db');

const commandCooldowns = new Set();
const cooldownTime = 5000; // 15 saniye (milisaniye cinsinden)

const achievements = [
  { name: 'Beleşçi', count: 1 },
  { name: 'Cenabettin', count: 3 },
  { name: 'Para Gözlü', count: 4 },
  { name: 'Altın Çocuk', count: 5 },
];

function formatCurrency(amount, currency) {
  return `${amount.toLocaleString()} ${currency}`;
}

exports.run = async (client, message, args) => {
  const minAmount = 100;
  const maxAmount = 99000;
  const currency = client.ekoayarlar.parabirimi;
  if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  const user = message.author;
  const hasAccount = db.fetch(`hesapdurumasreaper-${user.id}`);

  if (!hasAccount) {
    return message.reply(client.ekoayarlar.hesapolusturmsg);
  }

  let userBalance = db.fetch(`bakiyeasreaper-${user.id}`);

  if (userBalance === null || userBalance < 0) {
    userBalance = 0; // Eğer hesapta para yoksa veya eksi bakiye varsa bakiyeyi sıfırla
  }

  if (commandCooldowns.has(user.id)) {
    message.reply('5 saniye sonra tekrar dene.');
    return;
  }

  if (commandCooldowns.size > 0) {
    message.reply('Komut gönderme işlemi aşırı yüklendi. Lütfen tekrar deneyin.');
    return;
  }

  const winChance = Math.random() < 0.5; // Kazanma olasılığını %50 yap

  let resultMessage = '';

  if (winChance) {
    const amountWon = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
    userBalance += amountWon;
    db.set(`bakiyeasreaper-${user.id}`, userBalance);
    const formattedAmountWon = formatCurrency(amountWon, currency);

    const winMessages = [
      `${user}, Yerde **${formattedAmountWon}** buldun`,
      `${user}, Şans eseri kafana **${formattedAmountWon}** düştü.`,
      `${user}, Ilk defa bir işte başarılı oldun ve **${formattedAmountWon}** kazandın.`,
      `${user}, Babanın pantolonundan **${formattedAmountWon}** çaldın.`,
      `${user}, Dilencilik yaparak **${formattedAmountWon}** elde ettin.`,
      `${user}, Zengin bir iş adamın kartını çaldın ve içerisinden **${formattedAmountWon}** tutarında para çektin.`,
      `${user}, Bir Ford Escort dızladın ve **${formattedAmountWon}** ye sattın.`,
      `${user}, Yediğin yemeğin içinden **${formattedAmountWon}** çıktı.`,
      `${user}, Sıçarken **${formattedAmountWon}** buldun.`,
      `${user}, Enes Patos Sana **${formattedAmountWon}** tutarında bayram harçlığı verdi.`,
      `${user}, Yolda giderken bir taşa çarptın uçaktan düşen **${formattedAmountWon}** boğazına kaçtı.`,
      `${user}, Sayısal Lotoyu tutturdun ve **${formattedAmountWon}** kazandın.`,
      `${user}, Ananın amını düz gördün ve **${formattedAmountWon}** kazandın.`,
      `${user}, Yakışıklı güvenliğin kelepçesini çalıp sattın ve **${formattedAmountWon}** kar ettin.`,
      `${user}, <@767682747560755222> çantasını dızladın **${formattedAmountWon}** değerinde eşya sattın.`,
    ];

    resultMessage = winMessages[Math.floor(Math.random() * winMessages.length)];

    // Başarımları kontrol et ve kazanılan başarımları kaydet
    const userAchievements = db.fetch(`achievements_${user.id}`) || [];

    for (const achievement of achievements) {
      if (userAchievements.includes(achievement.name)) continue; // Zaten kazanılmışsa atla

      const achievementCount = userAchievements.filter((a) => a === achievement.name).length;

      if (achievementCount + 1 >= achievement.count) {
        userAchievements.push(achievement.name);
        db.set(`achievements_${user.id}`, userAchievements);
        message.channel.send(`${user}, Tebrikler! **${achievement.name}** başarımını kazandın!`);
      }
    }
  } else {
    const amountLost = 0; // Kullanıcı para kaybetmez
    const formattedAmountLost = formatCurrency(amountLost, currency);

    const loseMessages = [
      `${user}, Bankayı soymaya çalıştın fakat başaramadın..`,
      `${user}, Yerdeki parayı alacakken rüzgar parayı uçurdu.`,
      `${user}, Market soymaya çalışırken yakalandın..`,
      `${user}, 4 yıl universite okudun ve ilk işin a101 kasiyerliğinde mağazayı batırdın..`,
      `${user}, Kazı kazan oynadın bi bok çıkmadı`,
      `${user}, Arkadaşın ile iddiaya girdin o kazandı sen bi bok kazanamadın.`,
      `${user}, Bir kazaya karıştın motorcu haklı çıktı bi bok kazanamadın..`,
      `${user}, Çalıştığın iş yerinden kovuldun..`,
      `${user}, Bi Bok kazanamadın.`,
      `${user}, Para Mara yok siktir git`,
      `${user}, Bir Mağazayı soymaya kalkıştın kendi evinden oldun..`,
      `${user}, ATM kartını yuttu.`,
      `${user}, Ananın amını tersten gördün bi bok kazanamadın.`,
      `${user}, Yakışıklı güvenliği soymaya çalıştın ama seni kelepçeledi.`,
      `${user}, Kafana uçak düştü ve soygun yapamadın.`,
    ];

    resultMessage = loseMessages[Math.floor(Math.random() * loseMessages.length)];
  }

  message.channel.send(resultMessage);

  commandCooldowns.add(user.id);
  setTimeout(() => {
    commandCooldowns.delete(user.id);
  }, cooldownTime);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sc'],
  permLevel: 0,
  category: 'Eğlence',
};

exports.help = {
  name: 'sc',
  description: 'Rastgele para kazanma veya kaybetme işlemi gerçekleştirir.',
  usage: 'sc',
};

// Diğer kodlar...
