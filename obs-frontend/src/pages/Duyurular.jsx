import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';

export default function Duyurular() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnn, setSelectedAnn] = useState(null);
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Sınav Tarihleri Açıklandı', date: '2026-06-09', content: 'Bahar 2026 semestri sınav tarihleri resmi olarak açıklanmıştır. Ara sınavlar 10-18 Nisan, Final sınavları ise 5-15 Haziran tarihleri arasında yapılacaktır.', hedefRol: 'OGRENCI' },
    { id: '2', title: 'Kampüs Yazılımı Güncellendi', date: '2026-06-07', content: 'Öğrenci Bilgi Sistemi (OBS) yeni arayüz ve performans geliştirmeleri ile güncellenmiştir.', hedefRol: 'OGRENCI' }
  ]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.get('/duyuru');
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data.map(a => ({
            id: a.id,
            title: a.baslik || 'Duyuru',
            content: a.icerik || '',
            date: a.tarih ? a.tarih.substring(0, 10) : '2026-06-10',
            hedefRol: a.hedefRol || 'GENEL'
          })));
        }
      } catch (err) {
        console.warn("Could not load announcements from backend, using fallback:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(ann => {
    return ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           ann.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden animate-fadeIn">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">Duyurular</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold">Tüm önemli haberler, akademik duyurular ve bildirimler.</p>
      </div>

      {/* Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Duyurularda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 transition font-bold"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
        </div>
      </div>

      {/* Grid for Announcements & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white border border-border-subtle rounded-lg p-8 text-center">
              <p className="text-slate-500 text-xs sm:text-sm font-bold">Aradığınız kriterlere uygun duyuru bulunamadı.</p>
            </div>
          ) : (
            filteredAnnouncements.map(ann => {
              const isSelected = selectedAnn?.id === ann.id;
              return (
                <div 
                  key={ann.id} 
                  onClick={() => setSelectedAnn(isSelected ? null : ann)}
                  className={`bg-white border rounded-md p-4 sm:p-5 hover:border-secondary/40 hover:shadow-md transition cursor-pointer group ${
                    isSelected ? 'border-secondary bg-secondary/5' : 'border-border-subtle'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="text-lg flex-shrink-0 mt-0.5">📢</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-secondary transition truncate">{ann.title}</h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{ann.date}</p>
                        </div>
                      </div>

                      <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2 font-medium">{ann.content}</p>

                      <div className="flex items-center gap-3 pt-3 mt-2.5 border-t border-border-subtle flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold border bg-secondary/15 text-primary border-secondary/20">
                          {ann.hedefRol}
                        </span>
                        
                        <span className="ml-auto text-tertiary font-bold text-xs sm:text-sm flex items-center gap-0.5 hover:underline">
                          {isSelected ? 'Kapat' : 'Detayını Oku'}
                          <span className="material-symbols-outlined text-sm">
                            {isSelected ? 'expand_less' : 'arrow_forward'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Announcement Detail Card */}
        <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5">
          <h2 className="text-sm font-bold text-primary mb-3 border-b border-border-subtle pb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-slate-400 text-base">info</span>
            Duyuru Detayı
          </h2>
          {selectedAnn ? (
            <div className="space-y-3 animate-fadeIn">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold border bg-secondary/15 text-primary border-secondary/20">
                  {selectedAnn.hedefRol}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-primary mt-2 mb-0.5 leading-tight">{selectedAnn.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold">{selectedAnn.date}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-3.5 border border-border-subtle rounded-md whitespace-pre-line">
                {selectedAnn.content}
              </p>
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">drafts</span>
              <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-[220px] mx-auto">Duyurunun tam içeriğini okumak için listelenen duyurulardan birine tıklayın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
