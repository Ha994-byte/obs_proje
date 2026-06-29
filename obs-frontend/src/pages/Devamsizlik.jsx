import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';

export default function Devamsizlik() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // State representing backend entities (Devamsizlik)
  const [attendanceData, setAttendanceData] = useState([
    { id: '1', name: 'Veritabanı Yönetim Sistemleri', instructor: 'Prof. Dr. Yılmaz Ö.', totalWeeks: 14, absentCount: 2 },
    { id: '2', name: 'İşletim Sistemleri', instructor: 'Doç. Dr. Ayşe K.', totalWeeks: 14, absentCount: 1 },
    { id: '3', name: 'Diferansiyel Denklemler', instructor: 'Dr. Öğr. Üyesi Ali S.', totalWeeks: 14, absentCount: 3 },
    { id: '4', name: 'Algoritma Analizi', instructor: 'Prof. Dr. Murat A.', totalWeeks: 14, absentCount: 0 },
    { id: '5', name: 'Veri Yapıları', instructor: 'Prof. Dr. Ahmet Y.', totalWeeks: 14, absentCount: 4 },
  ]);

  // Detailed sessions representing dates of absences/presences
  const [sessionLogs, setSessionLogs] = useState({
    '1': [
      { date: '2023-10-23', status: 'present' },
      { date: '2023-10-16', status: 'absent' },
      { date: '2023-10-09', status: 'present' },
      { date: '2023-10-02', status: 'absent' },
    ],
    '2': [
      { date: '2023-10-25', status: 'present' },
      { date: '2023-10-18', status: 'present' },
      { date: '2023-10-11', status: 'absent' },
    ]
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || !user.extraId) return;

    const fetchAttendance = async () => {
      try {
        const regs = await api.get(`/ders-kaydi/ogrenci/${user.extraId}`);
        const allAcilan = await api.get('/acilan-ders');
        const allDers = await api.get('/ders');
        const absences = await api.get(`/devamsizlik/ogrenci/${user.extraId}`);

        if (Array.isArray(regs) && Array.isArray(allAcilan) && Array.isArray(allDers) && Array.isArray(absences)) {
          const resolvedData = [];
          const resolvedLogs = {};

          regs.forEach(reg => {
            const acilan = allAcilan.find(a => a.id === reg.acilanDersId);
            if (acilan) {
              const ders = allDers.find(d => d.id === acilan.dersId);
              if (ders) {
                const courseAbs = absences.filter(ab => ab.acilanDersId === acilan.id);
                const absentCount = courseAbs.filter(ab => !ab.geldiMi).length;

                resolvedData.push({
                  id: acilan.id,
                  name: ders.dersAdi || 'Ders',
                  instructor: 'Öğretim Görevlisi',
                  totalWeeks: 14,
                  absentCount: absentCount
                });

                resolvedLogs[acilan.id] = courseAbs.map(ab => ({
                  date: ab.tarih ? ab.tarih.substring(0, 10) : '2026-06-10',
                  status: ab.geldiMi ? 'present' : 'absent'
                }));
              }
            }
          });

          if (resolvedData.length > 0) {
            setAttendanceData(resolvedData);
            setSessionLogs(resolvedLogs);
          }
        }
      } catch (err) {
        console.warn("Could not fetch attendance from backend, using fallback:", err);
      }
    };

    fetchAttendance();
  }, [user?.extraId]);

  const getAbsencePercentage = (absentCount) => {
    return ((absentCount / 14.0) * 100).toFixed(1);
  };

  const totalAbsents = attendanceData.reduce((sum, c) => sum + c.absentCount, 0);
  const averageAbsencePercentage = attendanceData.length > 0 
    ? ((totalAbsents / (attendanceData.length * 14.0)) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden animate-fadeIn">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">Devamsızlık Takibi</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold">14 haftalık akademik takvime göre devamsızlık durumu. Detaylar için derse tıklayın.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-red-50/70 border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
          <p className="text-red-700 text-xs sm:text-sm font-bold mb-0.5">Genel Oran</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-850">%{averageAbsencePercentage}</p>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">14 hafta üzerinden</p>
        </div>
        <div className="bg-white border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
          <p className="text-slate-500 text-xs sm:text-sm font-bold mb-0.5">Kayıtlı Ders</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-850">{attendanceData.length}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Aktif dönem dersleri</p>
        </div>
        <div className="bg-white border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
          <p className="text-slate-500 text-xs sm:text-sm font-bold mb-0.5">Toplam Devamsız</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-850">{totalAbsents}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Gün sayısı</p>
        </div>
        <div className="bg-emerald-50/70 border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
          <p className="text-emerald-700 text-xs sm:text-sm font-bold mb-0.5">Durum</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-850">
            {totalAbsents >= 4 ? 'Riskli' : 'Güvenli'}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Devamsızlık limiti %30</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col gap-6">
        {/* Yoklama Kaydı Detayları */}
        <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 w-full">
          <h2 className="text-base font-extrabold text-primary mb-4 border-b border-border-subtle pb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-slate-400 text-base">receipt_long</span>
            Yoklama Kaydı Detayları
          </h2>
          {selectedCourse ? (
            <div className="space-y-3 animate-fadeIn">
              <div>
                <h3 className="text-base font-extrabold text-primary mb-0.5">{selectedCourse.name}</h3>
                <p className="text-xs text-slate-400 font-semibold">{selectedCourse.instructor}</p>
              </div>

              <div className="pt-2 border-t border-border-subtle space-y-2.5">
                {(sessionLogs[selectedCourse.id] || []).map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-border-subtle rounded-md text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${session.status === 'present' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-slate-700">{session.date}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                      session.status === 'present'
                        ? 'bg-emerald-50 border-emerald-200/40 text-emerald-700'
                        : 'bg-red-50 border-red-200/40 text-red-700'
                    }`}>
                      {session.status === 'present' ? 'Katıldı' : 'Devamsız'}
                    </span>
                  </div>
                ))}
                {(sessionLogs[selectedCourse.id] || []).length === 0 && (
                  <p className="text-center py-4 text-sm text-slate-400 font-semibold">Tüm oturumlara katılım sağlandı.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">touch_app</span>
              <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">Tarih bazlı devamsızlık kayıtlarını listelemek için aşağıdaki derslerden birini seçin.</p>
            </div>
          )}
        </div>

        {/* Courses List */}
        <div className="space-y-3 w-full">
          <h2 className="text-base sm:text-lg font-bold text-primary mb-3">Ders Devam Özetleri</h2>
          <div className="space-y-3">
            {attendanceData.map(course => {
              const pct = getAbsencePercentage(course.absentCount);
              const limitReached = course.absentCount >= 4; 
              const isSelected = selectedCourse?.id === course.id;
              
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(isSelected ? null : course)}
                  className={`p-4 sm:p-4.5 rounded-md cursor-pointer transition-all border text-xs sm:text-sm shadow-sm ${
                    isSelected
                      ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                      : 'bg-white border-border-subtle hover:border-secondary/40 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{course.name}</h3>
                    <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded border ${
                      isSelected
                        ? 'bg-white/20 border-white/20 text-white'
                        : limitReached 
                          ? 'bg-red-50 border-red-200/50 text-red-700' 
                          : 'bg-slate-50 border-slate-200/50 text-slate-700'
                    }`}>
                      Devamsızlık Oranı: %{pct}
                    </span>
                  </div>
                  <p className={`text-xs mb-2.5 font-medium ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>{course.instructor}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex-1 rounded-full h-1.5 ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                      <div
                        className={`h-full rounded-full transition-all ${
                          isSelected
                            ? 'bg-white'
                            : limitReached ? 'bg-red-500' : 'bg-secondary'
                        }`}
                        style={{ width: `${((14 - course.absentCount) / 14) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold whitespace-nowrap ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                      {14 - course.absentCount}/14 Hafta Katılım
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Warnings Panel */}
      {attendanceData.some(c => c.absentCount >= 3) && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-md p-4 sm:p-5 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-amber-600 text-lg sm:text-xl flex-shrink-0">warning</span>
          <div>
            <p className="font-bold text-amber-850 text-xs sm:text-sm mb-0.5">Kritik Devam Sınırı Uyarısı</p>
            <p className="text-amber-750 text-xs font-medium leading-relaxed">
              Bazı derslerinizde devamsızlık sayısı 3 ve üzerine ulaşmıştır. Yönetmelik gereğince devamsızlığı 4 hafta ve üzeri olan öğrenciler doğrudan FF harf notu ile başarısız sayılacaktır. Devam durumunuza özen göstermeniz önemle rica olunur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
