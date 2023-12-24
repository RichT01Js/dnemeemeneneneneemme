const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');

module.exports = client => {
  console.log("");
  console.log(`Gerekli kurulum tamamlandı!`);
  console.log(`${client.user.tag} olarak giriş sağlandı...`);

  // Birden fazla aktivite mesajını içeren dizi
  const activities = [
    { name: '🤑 free 1,000,000💸 ', type: 'PLAYING' },
    { name: '🎉 Tag me for help!', type: 'PLAYING' },
    { name: '🔥 Open Beta: v3.0.1🧩', type: 'PLAYING' },
    { name: '🎰 FREE PLAY NOW 🎰', type: 'PLAYING' }
  ];

  let activityIndex = 0; // Aktivitenin sıra indeksi

  // İlk aktiviteyi ayarla
  client.user.setActivity(activities[activityIndex]);

  // Aktivite değiştirmek için zamanlayıcı
  setInterval(() => {
    // Sıradaki aktiviteye geç
    activityIndex = (activityIndex + 1) % activities.length;

    // Bot Glitch üzerinden yeniden başlatıldığında durumu kontrol et
    if (process.env.NODE_ENV === 'development') {
      client.user.setActivity('Yeniden Başlatılıyorum');
    } else {
      client.user.setActivity(activities[activityIndex]);
    }
  }, 10000); // Her 10 saniyede bir değiştirilecek, istediğiniz süreyi ayarlayabilirsiniz.
};
