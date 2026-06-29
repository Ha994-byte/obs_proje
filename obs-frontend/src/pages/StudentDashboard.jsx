import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard.jsx';
import AnnouncementCard from '../components/AnnouncementCard.jsx';
import { api } from '../utils/api.js';

export default function StudentDashboard({ onPageChange }) {
  // States
  const [stats, setStats] = useState([
    { icon: 'library_books', label: 'Alınan Ders Sayısı', value: '8', color: '#121E2D' },
    { icon: 'star', label: 'GANO', value: '3.42 / 4.00', color: '#D4AF37' },
    { icon: 'timer_off', label: 'Devamsızlık Oranı', value: '%12', color: '#ba1a1a', trend: { type: 'down', value: 'Sınırda' } },
    { icon: 'date_range', label: 'Aktif Dönem', value: '2023-24 Güz', color: '#337AB7' },
  ]);

  const [recentGrades, setRecentGrades] = useState([
    { name: 'Veritabanı Yönetim Sistemleri', instructor: 'Prof. Dr. Yılmaz Ö.', semester: 'Güz 2023', average: 82.0, grade: 'BB' },
    { name: 'İşletim Sistemleri', instructor: 'Doç. Dr. Ayşe K.', semester: 'Güz 2023', average: 85.2, grade: 'BA' },
    { name: 'Diferansiyel Denklemler', instructor: 'Dr. Öğr. Üyesi Ali S.', semester: 'Güz 2023', average: 92.0, grade: 'AA' },
  ]);

  const [announcements, setAnnouncements] = useState([
    { title: 'Ara Sınav (Vize) Takvimi Hakkında', content: '2023-2024 Güz dönemi ara sınav takvimi bölüm panolarında ve sistemde ilan edilmiştir.', date: '24 Eki 2023', priority: 'high', category: 'Akademik' },
    { title: 'Erasmus+ Başvuruları Başlıyor', content: 'Bahar dönemi hareketliliği için başvurular önümüzdeki hafta OBS üzerinden alınacaktır.', date: '18 Eki 2023', priority: 'medium', category: 'Ders' },
  ]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentName = user ? `${user.ad || ''} ${user.soyad || ''}` : 'Havva Kelekli';
  const studentNo = user ? user.no || '202104010' : '202104010';

  useEffect(() => {
    if (!user || !user.extraId) return;

    const fetchDashboardData = async () => {
      try {
        // 1. Fetch GANO
        let ganoVal = '3.42 / 4.00';
        try {
          const gano = await api.get(`/not/ogrenci-gano/${user.extraId}`);
          if (gano !== null && typeof gano === 'number') {
            ganoVal = `${gano.toFixed(2)} / 4.00`;
          }
        } catch (e) {
          console.warn("Could not fetch GANO from backend, using fallback:", e);
        }

        // 2. Fetch Absences Percentage
        let absPctVal = '%12';
        let absTrend = { type: 'down', value: 'Sınırda' };
        try {
          const abs = await api.get(`/devamsizlik/yuzde/${user.extraId}`);
          if (abs && typeof abs.devamsizlikYuzdesi === 'number') {
            absPctVal = `%${Math.round(abs.devamsizlikYuzdesi)}`;
            absTrend = abs.devamsizlikYuzdesi >= 30 ? { type: 'up', value: 'Kritik' } : { type: 'down', value: 'Güvenli' };
          }
        } catch (e) {
          console.warn("Could not fetch Absences from backend, using fallback:", e);
        }

        // 3. Fetch Registered Courses Count
        let courseCountVal = '3';
        try {
          const regs = await api.get(`/ders-kaydi/ogrenci/${user.extraId}`);
          if (Array.isArray(regs)) {
            courseCountVal = `${regs.length}`;
          }
        } catch (e) {
          console.warn("Could not fetch course count from backend, using fallback:", e);
        }

        // Update Stats State
        setStats([
          { icon: 'library_books', label: 'Alınan Ders Sayısı', value: courseCountVal, color: '#121E2D' },
          { icon: 'star', label: 'GANO', value: ganoVal, color: '#D4AF37' },
          { icon: 'timer_off', label: 'Devamsızlık Oranı', value: absPctVal, color: '#ba1a1a', trend: absTrend },
          { icon: 'date_range', label: 'Aktif Dönem', value: '2023-24 Güz', color: '#337AB7' },
        ]);

        // 4. Fetch Recent Grades
        try {
          const grades = await api.get(`/not/ogrenci/${user.extraId}`);
          if (Array.isArray(grades) && grades.length > 0) {
            setRecentGrades(grades.map(g => ({
              name: g.dersAdi || 'Ders',
              instructor: 'Öğretim Görevlisi',
              semester: 'Güz 2023',
              average: g.ortalama || 0.0,
              grade: g.harfNotu || 'FF'
            })));
          }
        } catch (e) {
          console.warn("Could not fetch recent grades from backend, using fallback:", e);
        }

        // 5. Fetch Announcements
        try {
          const anns = await api.get('/duyuru/rol/OGRENCI');
          if (Array.isArray(anns) && anns.length > 0) {
            setAnnouncements(anns.map(a => ({
              title: a.baslik,
              content: a.icerik,
              date: a.tarih ? new Date(a.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Şimdi',
              priority: 'medium',
              category: 'Duyuru'
            })));
          }
        } catch (e) {
          console.warn("Could not fetch announcements from backend, using fallback:", e);
        }

      } catch (err) {
        console.error("General dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, [user?.extraId]);



  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-[#121E2D]/5 border border-primary/15 rounded-lg p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary mb-2">
            Hoş geldin, {studentName}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold">
            No: {studentNo} • Bilgisayar Mühendisliği (%100 İngilizce)
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Announcements */}
        <div className="xl:col-span-2 bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-primary">Duyurular</h3>
            <button 
              onClick={() => onPageChange('duyurular')}
              className="text-sm sm:text-base text-tertiary hover:underline font-bold"
            >
              Tümünü Gör
            </button>
          </div>
          <div className="space-y-4">
            {announcements.map((ann, idx) => (
              <AnnouncementCard
                key={idx}
                title={ann.title}
                content={ann.content}
                date={ann.date}
                priority={ann.priority}
                category={ann.category}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 h-fit">
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-5">Hızlı İşlemler</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onPageChange('profil')}
              className="w-full flex justify-between items-center px-4 py-3 bg-slate-50 hover:bg-slate-100/75 border border-border-subtle rounded-md transition duration-300 font-bold text-sm text-slate-700"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-xl">lock</span>
                <span>Şifre Değiştir</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
