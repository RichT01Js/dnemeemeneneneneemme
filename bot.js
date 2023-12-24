const express = require('express');
const app = express();
app.use(express.static("public"));
const queue = new Map();
const { apikey } = require('./ayarlar.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json')
const YouTube = require('simple-youtube-api');
const ffmpeg = require('ffmpeg');
const youtube = new YouTube('apikey');
const ytdl = require('ytdl-core');
const prefix = ayarlar.prefix;
const fs = require('fs');
const moment = require('moment');
const Jimp = require('jimp');
const chalk = require('chalk');
app.get("/", function(request, response) {
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

const http = require('http');
app.get("/", (request, response) => {
  console.log(`[PING] Açık tutuyorum...`);
  response.sendStatus(200);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const db = require("quick.db");
require('./util/eventLoader')(client);

client.ayarlar = {
  "durum": false,
  "oynuyor": false,
  "prefix": false,
  "sahip": "767682747560755222",
}

client.ekoayarlar = {
  embedgif: "https://cdn.discordapp.com/attachments/1112309377068695632/1184113485647462492/standard.gif?ex=658aca9e&is=6578559e&hm=94752aac8caf8cf6c7290dce52b03f456f4f3efc101a4374cd1ba6e3352417bb&",
  parabirimi: "💸", // dominic degistirme
  yapimcilar:"Richard, Dominic",
  botunuzunprefixi: ".", // dominic degistirme
  botunuzunidsi: "1001185378310565948", // dominic degistirme
  botismi: "SlotRUSH", // dominic degistirme
  renk: "RED", // dominic degistirme
  isimsiz: "Bilinmiyor",
  rastgelepara: false,
  minpara: false,
  maxpara: false,
  günlükpara: 3000000, // dominic degistirme
  dbloy: false,
  dblkey: false,
  dblmsj: false,
  embedmesajyapimci: "SlotRUSH made with Richard",
  dmmesajgondermemsg: "# DMCS devreye girdi ve komut kullanımınız engellendi.🚫",
  hesapolusturmsg: "Bir hesabınız bulunmamakta. Hesap oluşturmak için: \`.acc <hesapismi>\`",
  baslangicparasi: 5000000, // dominic degistirme
  admin: ["767682747560755222"] // dominic degistirme
}

const kurulum = message => {
  console.log(`SlotRUSH ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  kurulum(`${files.length} komut kuruluyor...`);
  kurulum(`--------------`);
  files.forEach(f => {
    let pingKodları = require(`./komutlar/${f}`);
    kurulum(`Yükleniyor... ${pingKodları.help.name}`);
    client.commands.set(pingKodları.help.name, pingKodları);
    kurulum(`---------------`);
    client.commands.set(pingKodları.help.name, pingKodları);
    pingKodları.conf.aliases.forEach(alias => {
      client.aliases.set(alias, pingKodları.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let pingDosya = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, pingDosya);
      pingDosya.conf.aliases.forEach(alias => {
        client.aliases.set(alias, pingDosya.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
///////////////////////////////////////////////////
client.on('message', (message) => {
  // Botun etiketlendiğinde ve sadece bot etiketlendiğinde çalışacak kod
  if (message.mentions.has(client.user) && message.mentions.users.size === 1 && !message.content.includes('@everyone')) {
    const greetingEmbed = new Discord.MessageEmbed()
      .setColor(client.ekoayarlar.renk)
      .setTitle('SlotRUSH Economy')
      .setDescription('**Developers:**\n> **Support**: <@767682747560755222>, <@980089726134538290>\n\n**SlotRush Economy:**\n> Prefix: **/**\n> Support Server: https://discord.gg/YHdHVE5hw2 \n\n> **All Help Command:** \n > \`/kullanıcı\` **->** Tüm kullanıcı komutlarını gösterir. \n > \`/oyunlar\` **->** Tüm oyun komutlarını gösterir. \n > \`/chelp\` **->** Tüm oyun komutları hakkında bilgi gösterir. \n\nBotun temel amacı, şans oyunları üzerinden gelir elde ederek diğer kullanıcılardan daha üstün olmaktır. Oyunlar tamamen şans faktörüne dayalı olduğundan, burada herhangi bir netlik yoktur ve kullanıcılar bu eğlenceye kapılırken dikkatli olmalıdır.\n\n**UYARI:** *Oyunlar tamamen şansa dayalı oyunlarıdır ve net bir strateji bulunmamaktadır. Kullanıcılar, eğlence amacıyla katılmalı ve finansal riskleri göz önünde bulundurmalıdır. Aksi takdirde botun sahipleri bundan sorumlu değildir.*')
      .setFooter('Daha fazla bilgi için /yardım komutunu kullanabilirsiniz.')
      .setImage('https://cdn.discordapp.com/attachments/1112309377068695632/1163507792607449248/standard_3.gif?ex=653fd412&is=652d5f12&hm=cc93f079ef31b96b8bb538ac9fc09b93eadac86ca8f7cd15766858de4962f5fd&') // Embedin içinde büyük bir resim (image)
      .setTimestamp(); // Embedin gönderildiği tarih ve saat

    return message.channel.send(greetingEmbed);
  }
});


client.login(process.env.TOKEN);
