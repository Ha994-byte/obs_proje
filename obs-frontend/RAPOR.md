# OBS Frontend Tasarım Raporu

**Proje:** Okul Bilgi Sistemi (OBS) - Frontend Sayfa Tasarımları  
**Tarih:** 2026-06-09  
**Versiyon:** 1.0  
**Tema:** Siyah (#02050b) / Beyaz / Lacivert (#5b7cd7)

---

## 📋 İçindekiler

1. [Proje Özeti](#proje-özeti)
2. [Yapılan Sayfalar](#yapılan-sayfalar)
3. [Dosya Yapısı](#dosya-yapısı)
4. [Teknik Özellikler](#teknik-özellikler)
5. [Bileşen Açıklamaları](#bileşen-açıklamaları)
6. [Tema Renkleri](#tema-renkleri)
7. [Kullanılan Teknolojiler](#kullanılan-teknolojiler)

---

## 🎯 Proje Özeti

Tamamı React + Vite + Tailwind CSS ile geliştirilmiş 9 adet sayfa bileşeni oluşturulmuştur. Tasarımlar, kullanıcı deneyimini ön planda tutarak, modern ve responsive bir yapıda tasarlanmıştır.

**Hedef Kullanıcılar:**
- Öğrenciler
- Akademisyenler  
- Yöneticiler

---

## 📄 Yapılan Sayfalar

### 1. **Login.jsx** (Giriş Sayfası) ✅
**Konum:** `src/Login.jsx`  
**Açıklama:** Sistem giriş ekranı. Üç rol tipine göre giriş yapılabilir.

**Özellikler:**
- Rol seçimi (Öğrenci / Akademisyen / İdari)
- Dinamik placeholder ve etiket değişimi
- Şifre göster/gizle butonu
- "Beni Hatırla" seçeneği
- Dinamik footer (Destek, Gizlilik)
- Responsive tasarım

**Kod Satırı:** ~200 satır

---

### 2. **Dashboard.jsx** (Ana Sayfa)
**Konum:** `src/Dashboard.jsx`  
**Açıklama:** Öğrenci ana sayfası. İstatistikler, aktif dersler ve duyuruları görüntüler.

**Özellikler:**
- Yan menü (Sidebar) navigasyon
- 4 istatistik kartı (Dersler, Not Ort., Devamsızlık, Ödeme)
- Aktif dersler tablosu
- Son duyurular listesi
- Duyuru öncelik göstergesi
- Responsive grid layout
- Mobile menu toggle

**Kod Satırı:** ~250 satır

---

### 3. **DersKaydi.jsx** (Ders Kaydı)
**Konum:** `src/DersKaydi.jsx`  
**Açıklama:** Öğrencilerin dersleri seçip kaydolabileceği sayfa.

**Özellikler:**
- Ders listesi gösterimi
- Kontenjan kontrolü
- Çoklu seçim (checkbox)
- Toplam kredi hesaplama
- Kredi filtreleme
- Kayıt ve sıfırla butonları
- Ders kapasitesi göstergesi

**Kod Satırı:** ~160 satır

---

### 4. **Notlar.jsx** (Notlar Görüntüleme)
**Konum:** `src/Notlar.jsx`  
**Açıklama:** Öğrencinin tüm dönemler boyunca aldığı notları gösterir.

**Özellikler:**
- KGP (GPA) gösterimi
- Dönem filtrelemesi
- Detaylı not tablosu (Ara Sınav, Final, Proje, Ortalama)
- Harf notu gösterimi
- Transkript indirme butonu
- Responsive tablo

**Kod Satırı:** ~180 satır

---

### 5. **Transkript.jsx** (Resmi Transkript)
**Konum:** `src/Transkript.jsx`  
**Açıklama:** Resmi akademik transkripti görüntüle, yazdır, indir.

**Özellikler:**
- Dil seçeneği (Türkçe / İngilizce)
- Öğrenci bilgileri
- Dönem bazlı derslerin listelenmesi
- Yazdırma fonksiyonu
- PDF indirme (simüle)
- Profesyonel tasarım
- KGP özeti

**Kod Satırı:** ~220 satır

---

### 6. **Duyurular.jsx** (Duyuru Yönetimi)
**Konum:** `src/Duyurular.jsx`  
**Açıklama:** Sistem genelinde yapılan duyuruları kategorize edilerek gösterir.

**Özellikler:**
- Kategori filtrelemesi (Akademik, Tesis, Sistem, Etkinlik)
- Arama fonksiyonu
- Öncelik göstergesi (Acil, Orta, Düşük)
- Renk kodlu kategori etiketleri
- Duyuru detay gösterimi
- Scroll özelliği

**Kod Satırı:** ~230 satır

---

### 7. **Devamsizlik.jsx** (Devamsızlık Takibi)
**Konum:** `src/Devamsizlik.jsx`  
**Açıklama:** Öğrencinin derslerdeki devamsızlık durumunu görüntüler.

**Özellikler:**
- Genel devam yüzdesi
- Ders bazlı devamsızlık (seçim ile detay)
- Oturum detayları (Tarih, Saat, Durum)
- Renk kodlu durum göstergesi
- Uyarı sistemi (% 80 altında)
- Progress bar göstergesi

**Kod Satırı:** ~200 satır

---

### 8. **Profil.jsx** (Profil & Ayarlar)
**Konum:** `src/Profil.jsx`  
**Açıklama:** Kullanıcı profil bilgileri, şifre değişikliği ve tercihler.

**Özellikler:**
- 3 sekmeli interface (Kişisel Bilgiler, Güvenlik, Tercihler)
- Düzenleme modu
- Şifre değişikliği
- Bildirim tercihleri
- Avatar gösterimi
- Form validasyonu

**Kod Satırı:** ~280 satır

---

### 9. **AdminDashboard.jsx** (Yönetici Paneli)
**Konum:** `src/AdminDashboard.jsx`  
**Açıklama:** Yönetici için sistem kontrol paneli.

**Özellikler:**
- 4 istatistik kartı (Öğrenci, Ders, Akademisyen, Sistem Sağlığı)
- Son kaydolan kullanıcılar
- Sistem günlüğü
- Yan menü navigasyonu
- Erişim göstergesi (yeşil nokta)
- Admin spesifik ikonlar

**Kod Satırı:** ~220 satır

---

## 📁 Dosya Yapısı

```
deneme_obs_tasarım/
├── src/
│   ├── Login.jsx              ✅ Giriş sayfası
│   ├── Dashboard.jsx          ✅ Öğrenci ana sayfası
│   ├── DersKaydi.jsx          ✅ Ders kaydı
│   ├── Notlar.jsx             ✅ Notlar görüntüleme
│   ├── Transkript.jsx         ✅ Transkript
│   ├── Duyurular.jsx          ✅ Duyurular
│   ├── Devamsizlik.jsx        ✅ Devamsızlık takibi
│   ├── Profil.jsx             ✅ Profil & ayarlar
│   ├── AdminDashboard.jsx     ✅ Yönetici paneli
│   ├── App.jsx                ✅ Ana uygulama
│   ├── main.jsx               ✅ Entry point
│   └── index.css              ✅ Global stiller
├── index.html                 ✅ HTML şablonu
├── package.json               ✅ Bağımlılıklar
├── vite.config.js             ✅ Vite konfigürasyonu
├── tailwind.config.js         ✅ Tailwind konfigürasyonu
└── postcss.config.js          ✅ PostCSS konfigürasyonu
```

---

## 🔧 Teknik Özellikler

### React Hooks Kullanımı:
- `useState()` - State yönetimi
- Koşullu rendering
- Event handling
- Form validation

### Tailwind CSS Özellikleri:
- **Responsive Design** - Mobile, Tablet, Desktop
- **Gradient Backgrounds** - Modern görünüm
- **Hover Effects** - Etkileşimli ui
- **Accessibility Classes** - Erişilebilirlik

### Komponent Mimarisi:
- Reusable components
- Props drilling
- Modular tasarım
- Consistent styling

---

## 🎨 Bileşen Açıklamaları

### Ortak Özellikler (Tüm Sayfaları):

1. **Renk Tema:**
   - Arka Plan: `#02050b` (Çok koyu mavi-siyah)
   - Kartlar: `#07142c` / `#061430` (Koyu mavi)
   - Vurgular: `#5b7cd7` (Lacivert)
   - Metinler: Beyaz / Gri tonları

2. **Tipografi:**
   - Font: Inter (Google Fonts)
   - Başlıklar: Bold / 600+
   - Gövde: Regular / 400

3. **Boşluklandırma:**
   - Padding: Genellikle `p-4` - `p-8`
   - Margin: `mb-`, `mt-` classes
   - Gap: Flex/Grid items arası

4. **Sınırlar & Gölgeler:**
   - Border: `border-white/10` (Saydam beyaz)
   - Shadow: Hover states'te `shadow-lg`
   - Transitions: Smooth 200ms

5. **Etkileşim:**
   - Hover state'leri
   - Focus indicators
   - Loading states (placeholder)
   - Error/Success messaging

---

## 🎨 Tema Renkleri

| Renk | Hex | Kullanım |
|------|-----|---------|
| Arka Plan | `#02050b` | Sayfa arka planı |
| Koyu Mavi | `#061430` | Header, sidebar |
| Daha Koyu | `#091a3c` | Sekmeler |
| Çok Koyu | `#07142c` | Form alanı |
| Lacivert | `#5b7cd7` | Vurgular, butonlar |
| Koyu Lacivert | `#4a6cb5` | Hover states |
| Saydam Beyaz | `white/5-20` | Border, background |
| Gri | `#5b7cd7-slate-500` | Ikincil metinler |

---

## 💻 Kullanılan Teknolojiler

```json
{
  "frontend": {
    "framework": "React 18.3.1",
    "bundler": "Vite 5.4.21",
    "styling": "Tailwind CSS 3.4.5",
    "fonts": "Google Fonts (Inter)",
    "icons": "Material Symbols Outlined",
    "build": "npm run build",
    "dev": "npm run dev"
  }
}
```

---

## 📊 Kod İstatistikleri

| Sayfa | Satır Sayısı | Bileşen Sayısı | Özellik Sayısı |
|-------|--------------|-----------------|-------------------|
| Login | ~200 | 2 | 6 |
| Dashboard | ~250 | 2 | 8 |
| DersKaydi | ~160 | 1 | 7 |
| Notlar | ~180 | 1 | 6 |
| Transkript | ~220 | 1 | 6 |
| Duyurular | ~230 | 1 | 5 |
| Devamsizlik | ~200 | 1 | 7 |
| Profil | ~280 | 1 | 6 |
| AdminDashboard | ~220 | 2 | 7 |
| **TOPLAM** | **~1,840** | **12** | **58** |

---

## 🚀 Başlatma Komutları

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Preview
npm run preview
```

---

## 📝 Yapılacaklar (Future)

- [ ] Backend API entegrasyonu
- [ ] State management (Redux/Zustand)
- [ ] Route yönetimi (React Router)
- [ ] Form validation kütüphanesi
- [ ] Data table pagination
- [ ] Real-time notifications
- [ ] PDF export fonksiyonu
- [ ] Multilingual support
- [ ] Dark/Light mode toggle
- [ ] Accessibility improvements

---

## 📞 İletişim

**Tarafından:** Frontend Developer  
**Tarih:** 2026-06-09  
**Durum:** ✅ Tamamlandı

---

**Not:** Tüm sayfalar dummy data ile oluşturulmuştur. Backend API entegrasyonu yapılmadan önce mock data değiştirilmelidir.
