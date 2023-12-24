const Discord = require('discord.js');
const db = require('quick.db');
var ayarlar = require('../ayarlar.json');


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

exports.run = async (client, message, args, perms) => {
  const isim = args.slice(0).join(' ');
  const hesapdurumu = await db.fetch(`hesapdurumasreaper-${message.author.id}`);
  let kayitliKullaniciSayisi = db.fetch(`kayitlikullanicilar_${client.user.id}`) || 0;
 if (message.channel.type === 'dm') {
  return message.reply(client.ekoayarlar.dmmesajgondermemsg);
}

  if (hesapdurumu && hesapdurumu === "aktif") {
    return message.channel.send("Zaten bir hesabın var.");
  }

  if (!isim) return message.channel.send(exports.help.usage);

  if (!hesapdurumu) {
    db.set(`hesapdurumasreaper-${message.author.id}`, "aktif");
    message.channel.send("Hesabın başarıyla oluşturuldu!");

    if (client.ekoayarlar.rastgelepara == true) {
      db.set(`hesapismiasreaper-${message.author.id}`, isim);
      const yil = new Date().getFullYear();
      const ay = new Date().getMonth() + 1;
      const gun = new Date().getDate();
      db.set(`hesaptarihyilasreaper-${message.author.id}`, yil);
      db.set(`hesaptarihayasreaper-${message.author.id}`, ay);
      db.set(`hesaptarihgunasreaper-${message.author.id}`, gun);

      // Daha önce kayıt olan kullanıcılar için kontrol
      const dahaOnceKayitli = db.fetch(`kayitlimi_${message.author.id}`);
      if (!dahaOnceKayitli) {
        kayitliKullaniciSayisi++;
        db.set(`kayitlikullanicilar_${client.user.id}`, kayitliKullaniciSayisi);
        db.set(`kayitlimi_${message.author.id}`, true);
      }

      const randomizer = getRandomInt(client.ekoayarlar.minpara, client.ekoayarlar.maxpara);
      db.add(`bakiyeasreaper-${message.author.id}`, randomizer);
      message.channel.send(``);
    } else {
      if (client.ekoayarlar.rastgelepara == false) {
        db.set(`hesapismiasreaper-${message.author.id}`, isim);
        const yil = new Date().getFullYear();
        const ay = new Date().getMonth() + 1;
        const gun = new Date().getDate();
        db.set(`hesaptarihyilasreaper-${message.author.id}`, yil);
        db.set(`hesaptarihayasreaper-${message.author.id}`, ay);
        db.set(`hesaptarihgunasreaper-${message.author.id}`, gun);

        // Daha önce kayıt olan kullanıcılar için kontrol
        const dahaOnceKayitli = db.fetch(`kayitlimi_${message.author.id}`);
        if (!dahaOnceKayitli) {
          kayitliKullaniciSayisi++;
          db.set(`kayitlikullanicilar_${client.user.id}`, kayitliKullaniciSayisi);
          db.set(`kayitlimi_${message.author.id}`, true);
        }

        db.add(`bakiyeasreaper-${message.author.id}`, client.ekoayarlar.baslangicparasi);
        message.channel.send(`${message.author}, **${formatCurrency(client.ekoayarlar.baslangicparasi)}${client.ekoayarlar.parabirimi}** hesabına yatırıldı.`);
      }
    }
  }
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['hesap'],
  permLevel: 0,
  katagori: "Ekonomi"
};

exports.help = {
  name: 'acc',
  description: 'Asreaper',
  usage: 'Doğru Kullanım: **.acc <hesap ismi>**',
};
