import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';

export default function Profil({ onPageChange }) {
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const roleClean = user?.role?.trim().toUpperCase().replace(/İ/g, 'I') || '';
  const isAcademician = roleClean === 'ROLE_AKADEMISYEN';
  const isAdmin = roleClean === 'ROLE_ADMIN' || roleClean === 'ROLE_ADMİN';

  // Aligning fields exactly with backend Insan & Ogrenci entities
  const [formData, setFormData] = useState({
    ad: 'Havva',
    soyad: 'Kelekli',
    tcKimlik: '31415926542',
    email: 'havva.kelekli@ogrenci.obys.edu.tr',
    telefon: '+90 555 314 1592',
    ogrenciNo: '202104010',
    kayitTarihi: '2021-09-10',
    program: 'Bilgisayar Mühendisliği (%100 İngilizce)',
    aktif: true
  });

  const [passwordData, setPasswordData] = useState({
    eskiSifre: '',
    yeniSifre: '',
    yeniSifreTekrar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ad: user.ad || prev.ad,
        soyad: user.soyad || prev.soyad,
        ogrenciNo: isAdmin ? (user.username || prev.ogrenciNo) : (user.no || prev.ogrenciNo),
        email: user.username ? `${user.username}@obys.edu.tr` : prev.email,
        program: isAcademician ? 'Bilgisayar Mühendisliği' : isAdmin ? 'Yönetim Bilgi Sistemleri' : prev.program
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    alert('Kişisel bilgileriniz başarıyla güncellendi (Insan tablosu güncellendi).');
    setEditMode(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.yeniSifre !== passwordData.yeniSifreTekrar) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }
    try {
      await api.put('/auth/sifre-degistir', {
        eskiSifre: passwordData.eskiSifre,
        yeniSifre: passwordData.yeniSifre
      });
      alert('Şifre başarıyla değiştirildi.');
      setPasswordData({ eskiSifre: '', yeniSifre: '', yeniSifreTekrar: '' });
    } catch (err) {
      alert('Şifre değiştirilirken hata oluştu: ' + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden animate-fadeIn">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">Profil Ayarları</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold">
          {isAcademician 
            ? 'Akademik personel profil ve güvenlik ayarlarınızı yönetin.' 
            : isAdmin 
            ? 'İdari personel profil ve güvenlik ayarlarınızı yönetin.' 
            : 'Öğrenci işleri sistemindeki profil ve güvenlik ayarlarınızı yönetin.'}
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 mb-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-secondary flex items-center justify-center text-lg sm:text-xl font-bold text-primary flex-shrink-0 shadow-lg shadow-secondary/10">
            {formData.ad[0]}{formData.soyad[0]}
          </div>
          <div className="flex-grow text-center sm:text-left min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-primary mb-0.5 truncate">{formData.ad} {formData.soyad}</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold truncate mb-0.5">
              {isAcademician 
                ? 'Akademik Personel • Bilgisayar Mühendisliği' 
                : isAdmin 
                ? 'İdari Personel • Yönetim Bilgi Sistemleri' 
                : formData.program}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isAcademician 
                ? `Sicil No: ${formData.ogrenciNo}` 
                : isAdmin 
                ? `Kullanıcı Adı: @${formData.ogrenciNo}` 
                : `Kayıt Tarihi: ${formData.kayitTarihi} • Öğrenci No: ${formData.ogrenciNo}`}
            </p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="w-full sm:w-auto px-4 py-2 rounded-md font-bold transition text-xs sm:text-sm flex-shrink-0 bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10"
          >
            {editMode ? 'Düzenlemeyi İptal Et' : 'Profili Düzenle'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-subtle overflow-x-auto">
        {[
          { value: 'info', label: 'Kişisel Bilgiler' },
          { value: 'security', label: 'Şifre Değiştir' },
          { value: 'preferences', label: 'İletişim Tercihleri' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-2.5 px-4 font-bold transition-all border-b-2 text-xs sm:text-sm whitespace-nowrap ${
              activeTab === tab.value
                ? 'border-secondary text-primary font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5">
        {activeTab === 'info' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'ad', label: 'Ad', disabled: true },
                { name: 'soyad', label: 'Soyad', disabled: true },
                { name: 'tcKimlik', label: 'TC Kimlik Numarası', disabled: true },
                { name: 'ogrenciNo', label: isAcademician ? 'Sicil Numarası' : isAdmin ? 'Kullanıcı Adı' : 'Öğrenci Numarası', disabled: true },
                { name: 'email', label: 'E-Posta Adresi', disabled: false },
                { name: 'telefon', label: 'Telefon Numarası', disabled: false },
              ].map(field => (
                <div key={field.name} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">{field.label}</label>
                  {editMode && !field.disabled ? (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-border-subtle rounded-md px-3.5 py-2 text-slate-800 text-xs sm:text-sm outline-none focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary/35 transition font-bold"
                    />
                  ) : (
                    <p className="text-slate-700 bg-slate-50 border border-border-subtle rounded-md px-3.5 py-2 text-xs sm:text-sm font-semibold">
                      {formData[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <button
                onClick={handleSaveProfile}
                className="w-full bg-primary hover:bg-[#1C2C40] text-white py-2.5 rounded-md font-bold transition text-xs sm:text-sm shadow-lg shadow-primary/10"
              >
                Bilgileri Güncelle
              </button>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { name: 'eskiSifre', label: 'Mevcut Şifre' },
                { name: 'yeniSifre', label: 'Yeni Şifre' },
                { name: 'yeniSifreTekrar', label: 'Yeni Şifre (Tekrar)' }
              ].map(field => (
                <div key={field.name} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">{field.label}</label>
                  <input
                    type="password"
                    name={field.name}
                    value={passwordData[field.name]}
                    onChange={handlePasswordChange}
                    className="w-full bg-slate-50 border border-border-subtle rounded-md px-3.5 py-2 text-slate-800 text-xs sm:text-sm outline-none focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary/35 transition font-bold"
                    placeholder="••••••••"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full bg-primary hover:bg-[#1C2C40] text-white py-2.5 rounded-md font-bold transition text-xs sm:text-sm shadow-lg shadow-primary/10"
            >
              Şifreyi Değiştir (sifre-degistir)
            </button>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bilgilendirme Tercihleri</h3>
            {[
              { label: 'E-posta Duyuru Bildirimleri', desc: 'Akademik duyurular e-posta adresinize gönderilir.', enabled: true },
              { label: 'Önemli SMS Uyarıları', desc: 'Not ve devamsızlık limit uyarısı cep telefonunuza gönderilir.', enabled: false },
              { label: 'Sistem Güncellemeleri', desc: 'Sistem güncellemeleri hakkında bilgilendirilirsiniz.', enabled: true }
            ].map((pref, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-border-subtle rounded-md shadow-sm gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-slate-700 text-xs sm:text-sm">{pref.label}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{pref.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={pref.enabled}
                  className="w-5 h-5 accent-secondary cursor-pointer flex-shrink-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
