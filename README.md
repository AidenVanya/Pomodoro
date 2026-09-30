# 🍅 Pomodoro Zen

Modern, minimalist, performanslı ve hem mobil hem masaüstü cihazlar için özel olarak optimize edilmiş **Pomodoro Odaklanma Zamanlayıcısı**.

![Pomodoro Zen Preview](public/favicon.svg)

---

## ✨ Özellikler

- 🧘 **Minimalist Zen Arayüzü:** Ekranda dikkatinizi dağıtacak hiçbir fazlalık yok. Tam odaklanma sağlayan dairesel SVG geri sayım halkası ve durum göstergesi.
- 📱 **Mobil Uygulama (Native App) Deneyimi:** 
  - `100dvh` ile dikey kaydırma (scroll) tamamen engellenmiştir.
  - Sayfa esnemesi (pull-to-refresh / rubber-banding) engellenmiştir.
  - Dynamic Island / Çentik ve alt ana ekran çizgisi için Güvenli Alan (Safe Area Insets) desteği.
- 🖥️ **Masaüstü Uyumluluğu:** Geniş ekranlarda ferah bir çalışma alanı, masaüstü klavye kısayolları (`Space`, `R`, `S`) ve dokunsal mikro etkileşimler.
- 🎧 **Gerçek Ortam Sesleri (Ambient Audio):**
  - 🌧️ Gerçek Bahçe Yağmuru (`rain.mp3`)
  - ☕ Otantik Kafe Ambiyansı (`cafe.mp3`)
  - 🌊 Doğal Akarsu & Dere Akıntısı (`stream.mp3`)
  - Pürüzsüz ses geçişleri (fade-in / fade-out crossfade) ve kayan kapsül animasyonu.
- ⏱️ **Zaman Kayması Koruması (Drift Prevention):** Tarayıcı sekmeleri arka plana alındığında `setInterval` yavaşlamalarına karşı dinamik zaman damgası delta hesabı (`Date.now()`). Sekmeye dönüldüğünde anında senkronizasyon.
- 📝 **Görev Yönetimi (Task Integration):** Pomodoro seansına bağlanabilen görev listesi, tahmini domates (🍅) hedefi, tamamlanma takibi ve `localStorage` kalıcılığı.
- 📊 **Detaylı İstatistikler:** Toplam odaklanma süresi, seans sayısı, günlük kesintisiz seri (Streak 🔥) ve son 7 günün aktivite sütun grafiği.
- 🔔 **Masaüstü Bildirimleri & Sentetik Uyarı Sesleri:** Web Audio API ile harici ses dosyasına ihtiyaç duymayan tapınak çanı / Tibet kasesi ve Notification API masaüstü uyarıları.
- 🌓 **Aydınlık & Karanlık Mod:** Tailwind CSS v4 ile tam uyumlu, sistem tercihlerini destekleyen tek tıkla hızlı tema geçişi.

---

## 🛠️ Teknoloji Yığını

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **İkonlar:** [Lucide React](https://lucide.dev/)
- **Efektler:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Ses:** HTML5 Audio + Web Audio API Osilatörleri

---

## ⌨️ Klavye Kısayolları

| Tuş | İşlev |
| :--- | :--- |
| `Space` | Zamanlayıcıyı Başlat / Duraklat |
| `R` | Sayacı Sıfırla |
| `S` | Mevcut Seansı Atla |

*Not: Görev ismi yazarken veya pop-up modallar açıkken kısayollar otomatik olarak devre dışı kalır.*

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerelinizde çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Production build alın
npm run build
```
