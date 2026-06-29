import React from 'react';

export default function Navbar({ currentPage, onMenuClick, onPageChange }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentName = user ? `${user.ad || ''} ${user.soyad || ''}` : 'Havva Kelekli';
  const studentInitials = user ? (user.ad ? user.ad[0] : '') + (user.soyad ? user.soyad[0] : '') : 'HK';
  const pageTitles = {
    studentDashboard: 'Akademik Vizyon',
    dersKaydi: 'Ders Seçim & Kayıt İşlemleri',
    notlar: 'Not Bilgisi & Başarı Durumu',
    transkript: 'Resmi Transkript',
    duyurular: 'Duyurular & Bildirimler',
    devamsizlik: 'Devamsızlık Takip Sistemi',
    profil: 'Öğrenci Profili & Ayarlar',
  };

  const title = pageTitles[currentPage] || 'Öğrenci Bilgi Sistemi';

  return (
    <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16 text-slate-800">
      {/* Left */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 p-1 hover:bg-slate-100 rounded-md transition flex items-center justify-center flex-shrink-0"
          aria-label="Menüyü Aç"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <span className="hidden sm:inline-block material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
        <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight truncate">
          {title}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Messages */}
        <button 
          onClick={() => alert("Mesajlaşma özelliği henüz aktif değildir.")}
          className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-50 rounded-md transition-all hidden sm:flex"
          title="Mesajlar"
        >
          <span className="material-symbols-outlined text-xl">mail</span>
        </button>

        {/* Notifications */}
        <button 
          onClick={() => onPageChange && onPageChange('duyurular')}
          className="relative p-2 text-slate-500 hover:text-secondary hover:bg-slate-50 rounded-md transition-all flex"
          title="Duyurular & Bildirimler"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Settings */}
        <button 
          onClick={() => onPageChange && onPageChange('profil')}
          className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-50 rounded-md transition-all hidden sm:flex"
          title="Profil ve Ayarlar"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center font-extrabold text-xs shadow-md shadow-secondary/10 flex-shrink-0">
            {studentInitials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">{studentName}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Öğrenci</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
