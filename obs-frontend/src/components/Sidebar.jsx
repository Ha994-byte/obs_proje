import React from 'react';

export default function Sidebar({ currentPage, onPageChange, isOpen, onClose }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentName = user ? `${user.ad || ''} ${user.soyad || ''}` : 'Havva Kelekli';
  const studentNo = user ? user.no || '202104010' : '202104010';
  const menuItems = [
    { icon: 'home', label: 'Ana Sayfa', page: 'studentDashboard' },
    { icon: 'calendar_month', label: 'Ders Programı', page: 'dersProgrami' },
    { icon: 'school', label: 'Ders Kaydı', page: 'dersKaydi' },
    { icon: 'file_download', label: 'Transkript', page: 'transkript' },
    { icon: 'description', label: 'Notlar', page: 'notlar' },
    { icon: 'event_note', label: 'Duyurular', page: 'duyurular' },
    { icon: 'person_off', label: 'Devamsızlık', page: 'devamsizlik' },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10 bg-primary flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center shadow-lg shadow-secondary/10 flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">school</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-none mb-1.5">ÖBYS</h1>
            <p className="text-xs lg:text-sm text-secondary font-bold uppercase tracking-wider">Öğrenci Bilgi Yönetim Sistemi</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-md transition flex items-center justify-center flex-shrink-0"
          aria-label="Menüyü Kapat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2.5 overflow-y-auto bg-primary">
        {menuItems.map((item, idx) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={idx}
              onClick={() => {
                onPageChange(item.page);
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-md transition-all duration-300 text-base lg:text-lg font-bold text-left ${
                isActive
                  ? 'bg-white/10 text-secondary border-l-4 border-secondary font-extrabold shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <span className="material-symbols-outlined text-xl lg:text-2xl flex-shrink-0">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-6 border-t border-white/10 space-y-4 bg-[#0B141E]">
        {/* Profil & Ayarlar */}
        <button
          onClick={() => {
            onPageChange('profil');
            onClose();
          }}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-md transition-all duration-300 text-base lg:text-lg font-bold text-left ${
            currentPage === 'profil'
              ? 'bg-white/10 text-secondary border-l-4 border-secondary font-extrabold shadow-md'
              : 'text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-xl lg:text-2xl flex-shrink-0">
            settings
          </span>
          <span>Profil & Ayarlar</span>
        </button>

        <div className="bg-white/5 border border-white/10 rounded-md p-4">
          <p className="text-xs text-secondary mb-1.5 font-bold uppercase tracking-wider">Giriş Yapan Öğrenci</p>
          <p className="text-base lg:text-lg font-bold text-white truncate">{studentName}</p>
          <p className="text-xs lg:text-sm text-slate-400 font-medium tracking-wide">ID: {studentNo}</p>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => {
            onPageChange('login');
            onClose();
          }}
          className="w-full bg-red-950/20 hover:bg-red-950/45 border border-red-900/30 text-red-400 py-3 rounded-md font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm lg:text-base"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Sistemden Çıkış Yap</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static w-[360px] lg:w-[450px] h-screen bg-primary border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 flex flex-col z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 lg:hidden z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
}
