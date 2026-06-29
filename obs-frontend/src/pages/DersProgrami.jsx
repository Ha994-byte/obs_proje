import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';

export default function DersProgrami() {
  const [schedule, setSchedule] = useState([
    { day: 'Pazartesi', hours: '09:00 - 10:50', course: 'BGM301', room: 'Derslik A-101', instructor: 'Prof. Dr. Yılmaz Ö.', name: 'Veritabanı Yönetim Sistemleri' },
    { day: 'Çarşamba', hours: '11:00 - 12:50', course: 'MAT201', room: 'Amfi 2', instructor: 'Doç. Dr. Ayşe K.', name: 'Diferansiyel Denklemler' },
    { day: 'Cuma', hours: '14:00 - 15:50', course: 'BGM303', room: 'Laboratuvar B', instructor: 'Dr. Öğr. Üyesi Ali S.', name: 'İşletim Sistemleri' }
  ]);

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || !user.extraId) return;

    const fetchSchedule = async () => {
      try {
        const regs = await api.get(`/ders-kaydi/ogrenci/${user.extraId}`);
        const allAcilan = await api.get('/acilan-ders');
        const allDers = await api.get('/ders');

        if (Array.isArray(regs) && Array.isArray(allAcilan) && Array.isArray(allDers)) {
          const resolved = [];

          regs.forEach(reg => {
            const acilan = allAcilan.find(a => a.id === reg.acilanDersId);
            if (acilan) {
              const ders = allDers.find(d => d.id === acilan.dersId);
              if (ders) {
                const startHour = acilan.baslangicSaati !== null && acilan.baslangicSaati !== undefined 
                  ? String(acilan.baslangicSaati).padStart(2, '0') + ':00' 
                  : '09:00';
                const endHour = acilan.bitisSaati !== null && acilan.bitisSaati !== undefined 
                  ? String(acilan.bitisSaati).padStart(2, '0') + ':00' 
                  : '11:50';
                resolved.push({
                  day: acilan.gun || 'Pazartesi',
                  hours: `${startHour} - ${endHour}`,
                  course: ders.dersKodu || 'DERS-000',
                  room: acilan.sinif ? acilan.sinif.sinifAdi : 'Derslik A-101',
                  instructor: 'Öğretim Görevlisi',
                  name: ders.dersAdi || 'Bilinmeyen Ders'
                });
              }
            }
          });

          if (resolved.length > 0) {
            setSchedule(resolved);
          }
        }
      } catch (err) {
        console.warn("Could not fetch schedule from backend, using fallback:", err);
      }
    };

    fetchSchedule();
  }, [user?.extraId]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden animate-fadeIn">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary mb-1">Haftalık Ders Programı</h1>
        <p className="text-slate-500 text-xs sm:text-sm lg:text-base font-semibold">
          2023-2024 Güz Dönemi ders ve sınıf saatleri.
        </p>
      </div>

      {/* Modern Grid Layout for Weekly Days */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {daysOfWeek.map((day) => {
          // Find courses for this day
          const dayCourses = schedule.filter((item) => item.day === day);

          return (
            <div key={day} className="bg-white border border-border-subtle rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[300px]">
              {/* Day Header */}
              <div className="bg-primary p-4 border-b border-border-subtle text-center">
                <h3 className="font-extrabold text-white text-sm tracking-wider uppercase">{day}</h3>
              </div>

              {/* Day Content */}
              <div className="p-4 flex-1 flex flex-col justify-start space-y-4 bg-slate-50/35">
                {dayCourses.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">event_busy</span>
                    <p className="text-slate-400 text-xs font-semibold">Bu gün dersiniz bulunmamaktadır.</p>
                  </div>
                ) : (
                  dayCourses.map((item, idx) => (
                    <div key={idx} className="bg-white border border-border-subtle rounded-md p-4 hover:border-secondary hover:shadow-md transition-all duration-300 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-secondary/15 text-primary border border-secondary/20 px-2 py-0.5 rounded font-extrabold tracking-wider">{item.course}</span>
                        <span className="text-xs text-slate-400 font-bold">{item.hours}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{item.name}</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-slate-400">room</span>
                          {item.room}
                        </p>
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-600">
                          {item.instructor.charAt(0)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold truncate">{item.instructor}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Informative alert box */}
      <div className="bg-amber-50 border border-amber-200/50 rounded-lg p-5 text-xs sm:text-sm text-amber-800 font-medium flex items-start gap-3 leading-relaxed shadow-sm">
        <span className="material-symbols-outlined text-xl text-amber-600 flex-shrink-0 mt-0.5">info</span>
        <p>
          Ders programınızdaki olası değişiklikler veya çakışma durumları için ilgili bölüm danışmanınızla görüşmeniz gerekmektedir. Ders kayıt onayının ardından programınız kesinleşmektedir.
        </p>
      </div>
    </div>
  );
}
