import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, Check, Save, User, BookOpen, AlertCircle, Plus, Calendar, Megaphone, Clock } from 'lucide-react';
import { api } from '../utils/api.js';
import Profil from './Profil.jsx';

export default function AcademicianDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for Course & Student Management
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  
  // Notification states
  const [notification, setNotification] = useState(null);

  // Forms states
  const [vizeInput, setVizeInput] = useState('');
  const [finalInput, setFinalInput] = useState('');
  
  const [devamsizlikTarih, setDevamsizlikTarih] = useState(new Date().toISOString().split('T')[0]);
  const [geldiMiInput, setGeldiMiInput] = useState(true);

  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('OGRENCI');

  // Academician Info (Matches backend Akademisyen & Insan entity)
  const [academicianInfo, setAcademicianInfo] = useState({
    sicilNo: 'AK-201934',
    unvan: 'Prof. Dr.',
    ad: 'Yılmaz',
    soyad: 'Öztürk',
    email: 'y.ozturk@obys.edu.tr',
    alan: 'Bilgisayar Mühendisliği'
  });

  // Mock fallback courses taught by this academician (AcilanDers, Ders & Sinif entities)
  const [myCourses, setMyCourses] = useState([
    {
      id: 'acilan-1',
      dersKodu: 'BGM301',
      dersAdi: 'Veritabanı Yönetim Sistemleri',
      kredi: 4,
      sinif: 'Lab B-201',
      gun: 'Pazartesi',
      saat: '09:00 - 12:50',
      ogrenciSayisi: 3,
      students: [
        { id: 'ogrenci-1', dersKaydiId: 'mock-1', no: '202104010', ad: 'Havva', soyad: 'Kelekli', vize: 85, finalNotu: 80, devamsizlikSayisi: 2, devamsizlikDetay: [{ tarih: '2026-05-18', geldiMi: false }, { tarih: '2026-05-25', geldiMi: false }] },
        { id: 'ogrenci-2', dersKaydiId: 'mock-2', no: '202104011', ad: 'Ahmet', soyad: 'Yılmaz', vize: 65, finalNotu: 70, devamsizlikSayisi: 4, devamsizlikDetay: [{ tarih: '2026-05-11', geldiMi: false }, { tarih: '2026-05-18', geldiMi: false }, { tarih: '2026-05-25', geldiMi: false }, { tarih: '2026-06-01', geldiMi: false }] },
        { id: 'ogrenci-3', dersKaydiId: 'mock-3', no: '202104012', ad: 'Zeynep', soyad: 'Şimşek', vize: 90, finalNotu: 95, devamsizlikSayisi: 0, devamsizlikDetay: [] }
      ]
    },
    {
      id: 'acilan-2',
      dersKodu: 'BGM303',
      dersAdi: 'İşletim Sistemleri',
      kredi: 3,
      sinif: 'Derslik A-102',
      gun: 'Çarşamba',
      saat: '13:00 - 15:50',
      ogrenciSayisi: 2,
      students: [
        { id: 'ogrenci-1', dersKaydiId: 'mock-4', no: '202104010', ad: 'Havva', soyad: 'Kelekli', vize: 78, finalNotu: 90, devamsizlikSayisi: 1, devamsizlikDetay: [{ tarih: '2026-05-20', geldiMi: false }] },
        { id: 'ogrenci-3', dersKaydiId: 'mock-5', no: '202104012', ad: 'Zeynep', soyad: 'Şimşek', vize: 85, finalNotu: 88, devamsizlikSayisi: 2, devamsizlikDetay: [{ tarih: '2026-05-13', geldiMi: false }, { tarih: '2026-05-20', geldiMi: false }] }
      ]
    }
  ]);

  // Mock Announcements created by this user
  const [myAnnouncements, setMyAnnouncements] = useState([
    { id: 'duyuru-1', baslik: 'Veritabanı Proje Teslim Tarihleri', icerik: 'Dönem sonu SQL veritabanı tasarım projesi teslimleri en geç 15 Haziran saat 23:59\'a kadar sisteme yüklenmelidir.', tarih: '2026-06-08', hedefRol: 'OGRENCI' },
    { id: 'duyuru-2', baslik: 'Ara Sınav İtirazları Hakkında', icerik: 'Sınav kağıdı inceleme talepleri için son gün cuma günü mesai bitimidir.', tarih: '2026-06-05', hedefRol: 'OGRENCI' }
  ]);

  // Load profile and sync data from backend on mount
  useEffect(() => {
    const syncData = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const roleClean = user.role ? user.role.trim().toUpperCase().replace(/İ/g, 'I') : '';
        const isAcademician = roleClean === 'ROLE_AKADEMISYEN';
        
        const activeAd = user.ad || 'Ahmet';
        const activeSoyad = user.soyad || 'Yılmaz';
        const activeSicilNo = user.no || 'AK-201934';
        const activeEmail = (user.username || 'user') + '@obys.edu.tr';
        const activeExtraId = user.extraId;

        setAcademicianInfo({
          sicilNo: activeSicilNo,
          unvan: isAcademician ? 'Prof. Dr.' : '',
          ad: activeAd,
          soyad: activeSoyad,
          email: activeEmail,
          alan: isAcademician ? 'Bilgisayar Mühendisliği' : 'Öğrenci Hesabı',
          extraId: activeExtraId
        });

        try {
          // Fetch announcements
          const annList = await api.get('/duyuru');
          if (annList && Array.isArray(annList)) {
            setMyAnnouncements(annList.map(a => ({
              id: a.id,
              baslik: a.baslik,
              icerik: a.icerik,
              tarih: a.tarih ? a.tarih.substring(0, 10) : new Date().toISOString().split('T')[0],
              hedefRol: a.hedefRol
            })));
          }

          // Fetch courses
          const allCourses = await api.get('/acilan-ders');
          if (allCourses && Array.isArray(allCourses)) {
            // Filter by academician ID
            const filtered = allCourses.filter(c => c.akademisyenId === activeExtraId);
            
            // Fetch student registrations
            const allRegistrations = await api.get('/ders-kaydi');
            
            // Map students to courses
            const resolvedCourses = [];
            
            for (const c of filtered) {
              const regsForCourse = allRegistrations.filter(r => r.acilanDersId === c.id);
              const resolvedStudents = [];

              for (const reg of regsForCourse) {
                // Fetch student info
                let studentInfo = null;
                try {
                  studentInfo = await api.get(`/ogrenci/${reg.ogrenciId}`);
                } catch (e) {
                  console.warn("Ogrenci fetch error:", reg.ogrenciId);
                }

                // Fetch student grades for this course
                let vize = null;
                let finalNotu = null;
                try {
                  const grades = await api.get(`/not/ogrenci/${reg.ogrenciId}`);
                  const courseGrade = grades.find(g => g.dersId === c.dersId);
                  if (courseGrade) {
                    vize = courseGrade.vize;
                    finalNotu = courseGrade.finalNotu;
                  }
                } catch (e) {
                  // If it fails, fallback to local state
                }

                // Fetch absences for this student in this course
                let devamsizlikCount = 0;
                let devamsizlikDetay = [];
                try {
                  const absences = await api.get(`/devamsizlik/ogrenci/${reg.ogrenciId}`);
                  const courseAbs = absences.filter(a => a.acilanDersId === c.id);
                  devamsizlikCount = courseAbs.filter(a => !a.geldiMi).length;
                  devamsizlikDetay = courseAbs.map(a => ({
                    tarih: a.tarih ? a.tarih.substring(0, 10) : '',
                    geldiMi: a.geldiMi
                  }));
                } catch (e) {
                  // Fallback
                }

                // Resolve student names from student number or generated name
                const no = studentInfo ? studentInfo.ogrenciNo : '202104010';
                const mockNames = {
                  '202104010': { ad: 'Havva', soyad: 'Kelekli' },
                  '202104011': { ad: 'Ahmet', soyad: 'Yılmaz' },
                  '202104012': { ad: 'Zeynep', soyad: 'Şimşek' }
                };
                const nameRes = mockNames[no] || { ad: 'Öğrenci', soyad: 'No ' + no.substring(no.length - 4) };

                resolvedStudents.push({
                  id: reg.ogrenciId,
                  dersKaydiId: reg.id,
                  no,
                  ad: nameRes.ad,
                  soyad: nameRes.soyad,
                  vize,
                  finalNotu,
                  devamsizlikSayisi: devamsizlikCount,
                  devamsizlikDetay
                });
              }

              // Resolve course name
              let courseName = 'Ders Tanımsız';
              let courseKodu = 'DERS-000';
              try {
                const ders = await api.get(`/ders/${c.dersId}`);
                if (ders) {
                  courseName = ders.dersAdi;
                  courseKodu = ders.dersKodu;
                }
              } catch (e) {}

              resolvedCourses.push({
                id: c.id,
                dersKodu: courseKodu,
                dersAdi: courseName,
                kredi: c.kredi || 3,
                sinif: c.sinif ? c.sinif.id : 'Lab B-201',
                gun: c.gun || 'Pazartesi',
                saat: c.baslangicSaati ? `${c.baslangicSaati}:00 - ${c.bitisSaati}:00` : '09:00 - 12:50',
                ogrenciSayisi: resolvedStudents.length,
                students: resolvedStudents
              });
            }

            if (resolvedCourses.length > 0) {
              setMyCourses(resolvedCourses);
            }
          }
        } catch (error) {
          console.error("Backend fetch error:", error);
        }
      }
    };
    syncData();
  }, []);

  // Trigger brief alert notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper formula matching backend: (Vize * 0.4) + (Final * 0.6)
  const calculateOrtalama = (vize, finalNotu) => {
    if (vize === null || finalNotu === null || vize === undefined || finalNotu === undefined) return '-';
    return (vize * 0.4) + (finalNotu * 0.6);
  };

  // Helper matching backend NotController grade scales
  const getHarfNotu = (ortalama) => {
    if (ortalama === '-') return '-';
    if (ortalama >= 90) return 'AA';
    if (ortalama >= 85) return 'BA';
    if (ortalama >= 80) return 'BB';
    if (ortalama >= 75) return 'CB';
    if (ortalama >= 70) return 'CC';
    if (ortalama >= 60) return 'DC';
    if (ortalama >= 50) return 'DD';
    if (ortalama >= 40) return 'FD';
    return 'FF';
  };

  // Save student grades to database
  const handleSaveGrades = async (studentId, dersKaydiId) => {
    const vize = parseInt(vizeInput);
    const final = parseInt(finalInput);

    if (isNaN(vize) || vize < 0 || vize > 100 || isNaN(final) || final < 0 || final > 100) {
      showNotification('Lütfen 0 - 100 arasında geçerli notlar giriniz.', 'error');
      return;
    }

    try {
      // POST to backend if real dersKaydiId exists
      if (dersKaydiId && !dersKaydiId.startsWith('mock')) {
        await api.post('/not', {
          dersKaydiId,
          vize,
          finalNotu: final
        });
      }

      // Update local state
      setMyCourses(prevCourses => prevCourses.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            students: course.students.map(student => {
              if (student.id === studentId) {
                return { ...student, vize, finalNotu: final };
              }
              return student;
            })
          };
        }
        return course;
      }));

      showNotification('Notlar başarıyla veritabanına kaydedildi.');
      setExpandedStudentId(null);
    } catch (err) {
      console.error(err);
      showNotification('Not kaydedilemedi: ' + err.message, 'error');
    }
  };

  // Add attendance record to database
  const handleAddDevamsizlik = async (studentId, acilanDersId) => {
    if (!devamsizlikTarih) {
      showNotification('Lütfen geçerli bir tarih seçiniz.', 'error');
      return;
    }

    try {
      // POST to backend if real acilanDersId exists
      if (acilanDersId && !acilanDersId.startsWith('mock')) {
        await api.post('/devamsizlik', {
          ogrenciId: studentId,
          acilanDersId,
          tarih: devamsizlikTarih,
          geldiMi: geldiMiInput
        });
      }

      setMyCourses(prevCourses => prevCourses.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            students: course.students.map(student => {
              if (student.id === studentId) {
                const duplicate = student.devamsizlikDetay.some(d => d.tarih === devamsizlikTarih);
                if (duplicate) {
                  showNotification('Bu tarihe ait yoklama kaydı zaten var.', 'error');
                  return student;
                }
                const newDetay = [...student.devamsizlikDetay, { tarih: devamsizlikTarih, geldiMi: geldiMiInput }];
                const devamsizlikSayisi = newDetay.filter(d => !d.geldiMi).length;
                return {
                  ...student,
                  devamsizlikDetay: newDetay,
                  devamsizlikSayisi
                };
              }
              return student;
            })
          };
        }
        return course;
      }));

      if (!geldiMiInput) {
        showNotification('Devamsızlık (Gelmedi) kaydı eklendi.');
      } else {
        showNotification('Derse katılım kaydı eklendi.');
      }
    } catch (err) {
      console.error(err);
      showNotification('Yoklama eklenemedi: ' + err.message, 'error');
    }
  };

  // Add announcement to database
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      showNotification('Lütfen tüm alanları doldurunuz.', 'error');
      return;
    }

    try {
      const savedAnn = await api.post('/duyuru', {
        baslik: announcementTitle,
        icerik: announcementContent,
        hedefRol: announcementTarget
      });

      const newAnnouncement = {
        id: savedAnn ? savedAnn.id : `duyuru-${Date.now()}`,
        baslik: announcementTitle,
        icerik: announcementContent,
        tarih: new Date().toISOString().split('T')[0],
        hedefRol: announcementTarget
      };

      setMyAnnouncements([newAnnouncement, ...myAnnouncements]);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      showNotification('Duyuru başarıyla veritabanında yayınlandı.');
      setActiveTab('announcements');
    } catch (err) {
      console.error(err);
      showNotification('Duyuru yayınlanamadı: ' + err.message, 'error');
    }
  };

  // Summary Metrics for Overview tab
  const totalStudentsTaught = new Set(myCourses.flatMap(c => c.students.map(s => s.id))).size;
  const criticalAttendanceStudents = myCourses.flatMap(c => 
    c.students.map(s => ({ ...s, courseName: c.dersAdi, code: c.dersKodu }))
  ).filter(s => s.devamsizlikSayisi >= 4);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col lg:flex-row font-sans relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl transition-all duration-300 border animate-slideIn ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          <span className="text-sm font-extrabold">{notification.message}</span>
        </div>
      )}

      {/* Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 lg:hidden z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static w-[360px] lg:w-[450px] h-screen bg-primary border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 flex flex-col z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-md transition flex items-center justify-center flex-shrink-0"
            aria-label="Menüyü Kapat"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2.5 overflow-y-auto bg-primary">
          {[
            {icon: 'home', label: 'Ana Sayfa', tab: 'overview'},
            { icon: 'book_5', label: 'Ders Listesi', tab: 'course_list' },
            { icon: 'groups', label: 'Sınıf Listesi', tab: 'class_list' },
            { icon: 'edit_note', label: 'Not Girişi', tab: 'grade_entry' },
            { icon: 'campaign', label: 'Duyuru Panosu', tab: 'announcements' },
            { icon: 'add_circle', label: 'Duyuru Yayınla', tab: 'new_announcement' }
          ].map((item, idx) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(item.tab);
                  setSidebarOpen(false);
                  setSelectedCourse(null);
                  setExpandedStudentId(null);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-md transition-all duration-300 text-base lg:text-lg font-bold text-left ${
                  isActive
                    ? 'bg-white/10 text-secondary border-l-4 border-secondary font-extrabold shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined text-xl lg:text-2xl flex-shrink-0">{item.icon}</span>
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
              setActiveTab('profil');
              setSidebarOpen(false);
              setSelectedCourse(null);
              setExpandedStudentId(null);
            }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-md transition-all duration-300 text-base lg:text-lg font-bold text-left ${
              activeTab === 'profil'
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
            <p className="text-xs text-secondary mb-1.5 font-bold uppercase tracking-wider">Giriş Yapan Akademisyen</p>
            <p className="text-base lg:text-lg font-bold text-white truncate">{academicianInfo.unvan ? academicianInfo.unvan + ' ' : ''}{academicianInfo.ad} {academicianInfo.soyad}</p>
            <p className="text-xs lg:text-sm text-slate-400 font-medium tracking-wide">Sicil No: {academicianInfo.sicilNo}</p>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="w-full bg-red-950/20 hover:bg-red-950/45 border border-red-900/30 text-red-400 py-3 rounded-md font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sistemden Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* Navbar */}
        <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16 text-slate-800">
          {/* Left */}
          <div className="flex items-center gap-3.5 min-w-0">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-600 p-1 hover:bg-slate-100 rounded-md transition flex items-center justify-center flex-shrink-0"
              aria-label="Menüyü Aç"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <span className="hidden sm:inline-block material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight truncate">
              {activeTab === 'overview' ? 'Akademik Genel Bakış' : 
               activeTab === 'course_list' ? 'Ders Listesi & Müfredat' :
               activeTab === 'class_list' ? 'Sınıf Listesi & Yoklama' :
               activeTab === 'grade_entry' ? 'Öğrenci Not Girişi' :
               activeTab === 'announcements' ? 'Duyuru Yönetimi' : 
               activeTab === 'new_announcement' ? 'Yeni Duyuru Yayınlama' : 
               activeTab === 'profil' ? 'Profil Ayarları' : 'Akademisyen Paneli'}
            </h2>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Semester */}
            <span className="text-xs sm:text-sm font-bold bg-secondary/15 text-primary px-2.5 py-1.5 rounded-lg hidden md:inline-block">2023-2024 Güz Dönemi</span>

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
              onClick={() => setActiveTab('announcements')}
              className="relative p-2 text-slate-500 hover:text-secondary hover:bg-slate-50 rounded-md transition-all flex"
              title="Duyuru Panosu"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => alert("Profil ayarları modülü yakında eklenecektir.")}
              className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-50 rounded-md transition-all hidden sm:flex"
              title="Ayarlar"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-border-subtle">
              <div className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center font-extrabold text-xs shadow-md shadow-secondary/10 flex-shrink-0">
                {(academicianInfo.ad ? academicianInfo.ad[0] : '') + (academicianInfo.soyad ? academicianInfo.soyad[0] : '')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                  {academicianInfo.unvan ? academicianInfo.unvan + ' ' : ''}{academicianInfo.ad} {academicianInfo.soyad}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">Akademisyen</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-3.5 sm:p-6 lg:p-8 w-full min-w-0 overflow-x-hidden">
          <div className="w-full space-y-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 hover:border-secondary/30 transition duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="material-symbols-outlined text-3xl text-secondary">book_5</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Aktif</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Ders Sayısı</p>
                    <p className="text-3xl font-black text-slate-800">{myCourses.length}</p>
                  </div>

                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 hover:border-secondary/30 transition duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="material-symbols-outlined text-3xl text-emerald-500">groups</span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Toplam</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Öğrenci Sayısı</p>
                    <p className="text-3xl font-black text-slate-800">{totalStudentsTaught}</p>
                  </div>

                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 hover:border-secondary/30 transition duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="material-symbols-outlined text-3xl text-red-500">person_off</span>
                      <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold">Kritik</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Devamsızlık Sınırında</p>
                    <p className="text-3xl font-black text-slate-800">{criticalAttendanceStudents.length}</p>
                  </div>

                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 hover:border-secondary/30 transition duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="material-symbols-outlined text-3xl text-purple-500">campaign</span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">Yayınlanan</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Duyurularım</p>
                    <p className="text-3xl font-black text-slate-800">{myAnnouncements.length}</p>
                  </div>
                </div>

                {/* Critical Warnings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Critical Attendance list */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-6 md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-extrabold text-slate-850 flex items-center gap-1.5">
                        <AlertCircle className="text-red-500" size={18} />
                        Kritik Devamsızlık Limitindeki Öğrenciler (4+ Yoklama)
                      </h3>
                    </div>
                    
                    {criticalAttendanceStudents.length === 0 ? (
                      <p className="text-slate-500 text-sm py-4 text-center">Devamsızlık sınırında öğrenci bulunmamaktadır.</p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {criticalAttendanceStudents.map((student, idx) => (
                          <div key={idx} className="py-3 flex justify-between items-center text-sm sm:text-base">
                            <div>
                              <p className="font-extrabold text-slate-800">{student.ad} {student.soyad}</p>
                              <p className="text-xs text-slate-400 font-bold">{student.no} • {student.code} - {student.courseName}</p>
                            </div>
                            <span className="bg-red-50 border border-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-extrabold">
                              {student.devamsizlikSayisi} Gün Devamsız
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick actions for academicians */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-6 h-fit md:col-span-1">
                    <h3 className="text-base font-extrabold text-slate-850 mb-4 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-slate-400 text-base">dashboard_customize</span>
                      Hızlı İşlemler
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('new_announcement')}
                        className="w-full flex justify-between items-center px-4 py-3 bg-slate-50 hover:bg-slate-100/75 border border-border-subtle rounded-md transition duration-300 font-bold text-sm text-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-500 text-lg">campaign</span>
                          <span>Yeni Duyuru Oluştur</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLASS LIST */}
            {activeTab === 'class_list' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Sınıf Listesi & Yoklama</h1>
                  <p className="text-slate-500 text-sm sm:text-base font-bold">Yoklama kaydetmek ve geçmişi incelemek için aşağıdaki derslerinizden birini seçin.</p>
                </div>

                {!selectedCourse ? (
                  /* Course Cards Grid - CLEAN AND COMPACT */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myCourses.map((course) => (
                      <div 
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setExpandedStudentId(null);
                        }}
                        className="bg-white border border-border-subtle hover:border-secondary/60 shadow-sm rounded-lg p-6 transition duration-300 cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-extrabold text-secondary uppercase tracking-wider bg-secondary/15 px-2 py-0.5 rounded">
                              {course.dersKodu}
                            </span>
                            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">room</span>
                              {course.sinif}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1 group-hover:text-secondary transition">
                            {course.dersAdi}
                          </h3>
                          <p className="text-sm text-slate-500 font-semibold mb-4">
                            {course.gun} • {course.saat}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-border-subtle mt-2">
                          <span className="text-sm font-bold text-slate-500">
                            {course.ogrenciSayisi} Öğrenci Kayıtlı
                          </span>
                          <span className="text-sm font-bold text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Sınıf Listesini Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Selected Course Panel - Expandable Student rows */
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Back button and course header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border-subtle p-5 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            setSelectedCourse(null);
                            setExpandedStudentId(null);
                          }}
                          className="p-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-md transition flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-base">arrow_back</span>
                        </button>
                        <div>
                          <h2 className="text-base sm:text-lg font-extrabold text-slate-800 leading-tight">
                            {selectedCourse.dersKodu} - {selectedCourse.dersAdi}
                          </h2>
                          <p className="text-sm text-slate-500 font-semibold">
                            {selectedCourse.sinif} • {selectedCourse.gun} {selectedCourse.saat}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold bg-secondary/15 text-primary px-3 py-1.5 rounded-md">
                          Kayıtlı: {selectedCourse.students.length} Öğrenci
                        </span>
                      </div>
                    </div>

                    {/* Öğrenci Yoklama Detayları Card (Stacked vertically on top of list view) */}
                    <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 w-full">
                      <h3 className="text-sm font-extrabold text-primary mb-4 border-b border-border-subtle pb-3 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-slate-400 text-base">analytics</span>
                        Öğrenci Yoklama Girişi & Geçmişi
                      </h3>
                      {expandedStudentId ? (
                        (() => {
                          const student = selectedCourse.students.find(s => s.id === expandedStudentId);
                          if (!student) return null;

                          return (
                            <div className="space-y-5 animate-fadeIn">
                              {/* Selected Student Brief Info */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-border-subtle rounded-md gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                                    {student.ad[0]}{student.soyad[0]}
                                  </div>
                                  <div>
                                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800">{student.ad} {student.soyad}</h4>
                                    <p className="text-xs text-slate-400 font-bold">{student.no} • Bilgisayar Mühendisliği</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs sm:text-sm">
                                  <div className="text-center bg-white px-3 py-1.5 border border-border-subtle rounded-md">
                                    <p className="text-[10px] text-slate-400 font-bold">Toplam Ders Haftası</p>
                                    <p className="font-black text-secondary">14 Hafta</p>
                                  </div>
                                  <div className="text-center bg-white px-3 py-1.5 border border-border-subtle rounded-md">
                                    <p className="text-[10px] text-slate-400 font-bold">Devamsızlık Durumu</p>
                                    <span className={`font-extrabold ${student.devamsizlikSayisi >= 4 ? 'text-red-700' : 'text-slate-650'}`}>
                                      {student.devamsizlikSayisi} Gün
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Attendance Form */}
                              <div className="bg-white p-4 border border-border-subtle rounded-lg shadow-sm space-y-4">
                                <h4 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-border-subtle pb-2">
                                  <span className="material-symbols-outlined text-sm">person_remove</span>
                                  Yeni Yoklama Kaydı Ekle
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tarih</label>
                                    <input 
                                      type="date"
                                      value={devamsizlikTarih}
                                      onChange={(e) => setDevamsizlikTarih(e.target.value)}
                                      className="w-full border border-border-subtle rounded-md px-3 py-1.5 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 bg-slate-50 text-slate-700 font-medium"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Katılım Durumu</label>
                                    <div className="flex gap-2 h-[34px]">
                                      <button
                                        type="button"
                                        onClick={() => setGeldiMiInput(true)}
                                        className={`flex-1 rounded-md text-xs font-bold border transition ${
                                          geldiMiInput 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                            : 'bg-white text-slate-600 border-border-subtle hover:bg-slate-50'
                                        }`}
                                      >
                                        Derse Geldi
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setGeldiMiInput(false)}
                                        className={`flex-1 rounded-md text-xs font-bold border transition ${
                                          !geldiMiInput 
                                            ? 'bg-red-50 text-red-700 border-red-200' 
                                            : 'bg-white text-slate-600 border-border-subtle hover:bg-slate-50'
                                        }`}
                                      >
                                        Gelmedi (Devamsız)
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleAddDevamsizlik(student.id, selectedCourse.id)}
                                  className="w-full bg-primary hover:bg-[#4a6cb5] text-white py-2 text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-secondary/10"
                                >
                                  <Plus size={14} />
                                  <span>Yoklama Kaydını Veritabanına Ekle</span>
                                </button>
                              </div>

                              {/* Yoklama Geçmişi */}
                              <div className="bg-white p-4 border border-border-subtle rounded-lg shadow-sm">
                                <h4 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-border-subtle pb-2 mb-3">
                                  <Clock size={14} className="text-slate-400" />
                                  Yoklama Geçmişi Logları
                                </h4>
                                {student.devamsizlikDetay.length === 0 ? (
                                  <p className="text-slate-400 text-sm py-2 font-medium">Bu öğrenciye ait girilmiş devamsızlık yoklama kaydı bulunmamaktadır.</p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {student.devamsizlikDetay.map((detay, dIdx) => (
                                      <span 
                                        key={dIdx} 
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold border flex items-center gap-1.5 ${
                                          detay.geldiMi 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                            : 'bg-red-50 text-red-700 border-red-100'
                                        }`}
                                      >
                                        <Calendar size={10} />
                                        {detay.tarih} • {detay.geldiMi ? 'Geldi' : 'Gelmedi'}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-center py-6 text-slate-500 font-bold text-sm flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-4xl text-slate-350">touch_app</span>
                          <p>Detayları görmek ve yoklama kaydetmek için aşağıdaki öğrencilerden birini seçin.</p>
                        </div>
                      )}
                    </div>

                    {/* Students List Table (Unexpanded, simple list row click triggers selection) */}
                    <div className="bg-white border border-border-subtle shadow-sm rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-border-subtle bg-slate-50/50">
                        <h3 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider">
                          Kayıtlı Öğrenci Listesi
                        </h3>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {selectedCourse.students.map((student) => {
                          const isSelected = expandedStudentId === student.id;

                          return (
                            <div 
                              key={student.id} 
                              onClick={() => {
                                setExpandedStudentId(student.id);
                                window.scrollTo({ top: 120, behavior: 'smooth' });
                              }}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50/60 transition cursor-pointer select-none gap-3.5 ${
                                isSelected ? 'bg-secondary/5 border-l-4 border-l-secondary' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                  {student.ad[0]}{student.soyad[0]}
                                </div>
                                <div>
                                  <p className="text-sm sm:text-base font-extrabold text-slate-800">{student.ad} {student.soyad}</p>
                                  <p className="text-xs text-slate-400 font-bold">{student.no}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 text-sm sm:text-base w-full sm:w-auto border-t sm:border-0 pt-2.5 sm:pt-0 border-border-subtle">
                                <div className="text-center">
                                  <p className="text-xs text-slate-400 font-bold">Devamsızlık Durumu</p>
                                  <span className={`px-2.5 py-1 rounded font-bold text-xs ${
                                    student.devamsizlikSayisi >= 4 ? 'bg-red-50 text-red-700 font-extrabold' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {student.devamsizlikSayisi} Gün
                                  </span>
                                </div>

                                <span className="material-symbols-outlined text-slate-400 text-base">
                                  chevron_right
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2.5: GRADE ENTRY */}
            {activeTab === 'grade_entry' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Öğrenci Not Girişi</h1>
                  <p className="text-slate-500 text-sm sm:text-base font-bold">Vize ve final sınavı sonuçlarını kaydetmek için aşağıdaki derslerinizden birini seçin.</p>
                </div>

                {!selectedCourse ? (
                  /* Course Cards Grid - CLEAN AND COMPACT */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myCourses.map((course) => (
                      <div 
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setExpandedStudentId(null);
                        }}
                        className="bg-white border border-border-subtle hover:border-secondary/60 shadow-sm rounded-lg p-6 transition duration-300 cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-extrabold text-secondary uppercase tracking-wider bg-secondary/15 px-2 py-0.5 rounded">
                              {course.dersKodu}
                            </span>
                            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">room</span>
                              {course.sinif}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1 group-hover:text-secondary transition">
                            {course.dersAdi}
                          </h3>
                          <p className="text-sm text-slate-500 font-semibold mb-4">
                            {course.gun} • {course.saat}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-border-subtle mt-2">
                          <span className="text-sm font-bold text-slate-500">
                            {course.ogrenciSayisi} Öğrenci Kayıtlı
                          </span>
                          <span className="text-sm font-bold text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Not Giriş Ekranını Aç <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Selected Course Panel - Expandable Student rows */
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Back button and course header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border-subtle p-5 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            setSelectedCourse(null);
                            setExpandedStudentId(null);
                          }}
                          className="p-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-md transition flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-base">arrow_back</span>
                        </button>
                        <div>
                          <h2 className="text-base sm:text-lg font-extrabold text-slate-800 leading-tight">
                            {selectedCourse.dersKodu} - {selectedCourse.dersAdi}
                          </h2>
                          <p className="text-sm text-slate-500 font-semibold">
                            {selectedCourse.sinif} • {selectedCourse.gun} {selectedCourse.saat}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold bg-secondary/15 text-primary px-3 py-1.5 rounded-md">
                          Kayıtlı: {selectedCourse.students.length} Öğrenci
                        </span>
                      </div>
                    </div>

                    {/* Öğrenci Değerlendirme Card (Stacked vertically on top of list view) */}
                    <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 w-full">
                      <h3 className="text-sm font-extrabold text-primary mb-4 border-b border-border-subtle pb-3 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-slate-400 text-base">analytics</span>
                        Öğrenci Not Değerlendirmesi
                      </h3>
                      {expandedStudentId ? (
                        (() => {
                          const student = selectedCourse.students.find(s => s.id === expandedStudentId);
                          if (!student) return null;
                          const ortalama = calculateOrtalama(student.vize, student.finalNotu);
                          const harf = getHarfNotu(ortalama);

                          return (
                            <div className="space-y-5 animate-fadeIn">
                              {/* Selected Student Brief Info */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-border-subtle rounded-md gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                                    {student.ad[0]}{student.soyad[0]}
                                  </div>
                                  <div>
                                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800">{student.ad} {student.soyad}</h4>
                                    <p className="text-xs text-slate-400 font-bold">{student.no} • Bilgisayar Mühendisliği</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs sm:text-sm">
                                  <div className="text-center bg-white px-3 py-1.5 border border-border-subtle rounded-md">
                                    <p className="text-[10px] text-slate-400 font-bold">Ortalama</p>
                                    <p className="font-black text-secondary">{typeof ortalama === 'number' ? ortalama.toFixed(1) : '-'}</p>
                                  </div>
                                  <div className="text-center bg-white px-3 py-1.5 border border-border-subtle rounded-md">
                                    <p className="text-[10px] text-slate-400 font-bold">Harf Notu</p>
                                    <span className={`font-extrabold ${
                                      harf.includes('A') ? 'text-green-700' :
                                      harf.includes('B') ? 'text-blue-700' :
                                      harf.includes('C') ? 'text-yellow-700' : 'text-red-700'
                                    }`}>{harf}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Grading Form */}
                              <div className="bg-white p-4 border border-border-subtle rounded-lg shadow-sm space-y-4">
                                <h4 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-border-subtle pb-2">
                                  <span className="material-symbols-outlined text-sm">edit_note</span>
                                  Not Değerlendirmesi
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vize (%40)</label>
                                    <input 
                                      type="number" 
                                      min="0"
                                      max="100"
                                      value={vizeInput}
                                      onChange={(e) => setVizeInput(e.target.value)}
                                      placeholder="Not giriniz"
                                      className="w-full border border-border-subtle rounded-md px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 bg-slate-50 text-slate-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Final (%60)</label>
                                    <input 
                                      type="number" 
                                      min="0"
                                      max="100"
                                      value={finalInput}
                                      onChange={(e) => setFinalInput(e.target.value)}
                                      placeholder="Not giriniz"
                                      className="w-full border border-border-subtle rounded-md px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 bg-slate-50 text-slate-800"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleSaveGrades(student.id, student.dersKaydiId)}
                                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 text-sm font-bold transition flex items-center justify-center gap-1.5"
                                >
                                  <Save size={14} />
                                  <span>Notları Veritabanına Kaydet</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-center py-6 text-slate-500 font-bold text-sm flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-4xl text-slate-350">touch_app</span>
                          <p>Not girişi yapmak veya mevcut notları güncellemek için aşağıdaki öğrencilerden birini seçin.</p>
                        </div>
                      )}
                    </div>

                    {/* Students List Table */}
                    <div className="bg-white border border-border-subtle shadow-sm rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-border-subtle bg-slate-50/50">
                        <h3 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider">
                          Kayıtlı Öğrenci Listesi (Sınav Notları)
                        </h3>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {selectedCourse.students.map((student) => {
                          const isSelected = expandedStudentId === student.id;
                          const ortalama = calculateOrtalama(student.vize, student.finalNotu);
                          const harf = getHarfNotu(ortalama);

                          return (
                            <div 
                              key={student.id} 
                              onClick={() => {
                                setExpandedStudentId(student.id);
                                setVizeInput(student.vize !== null ? student.vize.toString() : '');
                                setFinalInput(student.finalNotu !== null ? student.finalNotu.toString() : '');
                                window.scrollTo({ top: 120, behavior: 'smooth' });
                              }}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50/60 transition cursor-pointer select-none gap-3.5 ${
                                isSelected ? 'bg-secondary/5 border-l-4 border-l-secondary' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                  {student.ad[0]}{student.soyad[0]}
                                </div>
                                <div>
                                  <p className="text-sm sm:text-base font-extrabold text-slate-800">{student.ad} {student.soyad}</p>
                                  <p className="text-xs text-slate-400 font-bold">{student.no}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 text-sm sm:text-base w-full sm:w-auto border-t sm:border-0 pt-2.5 sm:pt-0 border-border-subtle">
                                <div className="text-right hidden sm:block">
                                  <p className="text-xs text-slate-400 font-bold">Vize / Final</p>
                                  <p className="font-extrabold text-slate-700">
                                    {student.vize !== null ? student.vize : '-'} / {student.finalNotu !== null ? student.finalNotu : '-'}
                                  </p>
                                </div>

                                <div className="text-center">
                                  <p className="text-xs text-slate-400 font-bold">Ortalama</p>
                                  <p className="font-black text-secondary">{typeof ortalama === 'number' ? ortalama.toFixed(1) : '-'}</p>
                                </div>

                                <div className="text-center">
                                  <p className="text-xs text-slate-400 font-bold">Harf</p>
                                  <span className={`px-2.5 py-1 rounded font-extrabold text-xs ${
                                    harf.includes('A') ? 'bg-green-50 text-green-700' :
                                    harf.includes('B') ? 'bg-secondary/15 text-blue-700' :
                                    harf.includes('C') ? 'bg-yellow-50 text-yellow-700' :
                                    harf === '-' ? 'bg-slate-50 text-slate-400' : 'bg-red-50 text-red-700'
                                  }`}>
                                    {harf}
                                  </span>
                                </div>

                                <span className="material-symbols-outlined text-slate-400 text-base">
                                  chevron_right
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ANNOUNCEMENT BOARD */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Duyuru Panosu</h1>
                    <p className="text-slate-500 text-sm sm:text-base font-bold">Tarafınızdan yayınlanan duyurular. Yeni duyuru yayınlayabilirsiniz.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('new_announcement')}
                    className="bg-gradient-to-r from-[#5b7cd7] to-[#3d5fa3] text-white font-bold py-2.5 px-4 rounded-md text-sm flex items-center gap-1.5 transition shadow-md shadow-secondary/10"
                  >
                    <Plus size={16} />
                    <span>Duyuru Ekle</span>
                  </button>
                </div>

                {/* Announcements List */}
                <div className="grid grid-cols-1 gap-4">
                  {myAnnouncements.map((ann) => (
                    <div key={ann.id} className="bg-white border border-border-subtle rounded-lg p-6 shadow-sm hover:border-secondary/30 transition duration-300">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                          {ann.baslik}
                        </h3>
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                          {ann.hedefRol === 'OGRENCI' ? 'Öğrencilere' : 'Tümüne'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mb-4 whitespace-pre-line leading-relaxed">
                        {ann.icerik}
                      </p>
                      <div className="text-xs text-slate-400 font-bold border-t border-border-subtle pt-3 flex items-center gap-1">
                        <Calendar size={12} />
                        Yayınlanma Tarihi: {ann.tarih}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PUBLISH NEW ANNOUNCEMENT */}
            {activeTab === 'new_announcement' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Yeni Duyuru Yayınla</h1>
                  <p className="text-slate-500 text-sm sm:text-base font-bold">Öğrencilerinize veya akademik birimlere duyuru göndermek için formu doldurun.</p>
                </div>

                <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-6 max-w-xl">
                  <form onSubmit={handleAddAnnouncement} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-650" htmlFor="title">Duyuru Başlığı</label>
                      <input 
                        type="text"
                        id="title"
                        required
                        placeholder="Başlık girin (örn: Telafi Dersi Duyurusu)"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 bg-slate-50 text-slate-800 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-650" htmlFor="target">Hedef Kitle</label>
                      <select
                        id="target"
                        value={announcementTarget}
                        onChange={(e) => setAnnouncementTarget(e.target.value)}
                        className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 bg-slate-50 text-slate-700 font-bold"
                      >
                        <option value="OGRENCI">Sadece Öğrenciler (Ders Grubu)</option>
                        <option value="GENEL">Herkes (Genel OBS Duyurusu)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-650" htmlFor="content">İçerik</label>
                      <textarea 
                        id="content"
                        required
                        rows="5"
                        placeholder="Duyuru metnini yazın..."
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 bg-slate-50 text-slate-800 font-medium resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-md text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10"
                    >
                      <Megaphone size={16} />
                      <span>Duyuruyu Yayınla</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: COURSE LIST */}
            {activeTab === 'course_list' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Ders Listesi</h1>
                  <p className="text-slate-500 text-sm sm:text-base font-bold">Bu dönem sorumlu olduğunuz aktif derslerin ve müfredat bilgilerinin listesi.</p>
                </div>

                <div className="bg-white border border-border-subtle shadow-sm rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-border-subtle bg-slate-50/50">
                    <h3 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider">
                      Aktif Derslerim
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border-subtle bg-slate-50/30 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                          <th className="p-4">Ders Kodu</th>
                          <th className="p-4">Ders Adı</th>
                          <th className="p-4">Derslik</th>
                          <th className="p-4">Gün & Saat</th>
                          <th className="p-4 text-center">Kredi</th>
                          <th className="p-4 text-center">Kayıtlı Öğrenci</th>
                          <th className="p-4 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {myCourses.map((course) => (
                          <tr key={course.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              <span className="text-xs font-extrabold text-secondary bg-secondary/15 px-2.5 py-1 rounded">
                                {course.dersKodu}
                              </span>
                            </td>
                            <td className="p-4 font-extrabold text-slate-800">{course.dersAdi}</td>
                            <td className="p-4 font-semibold text-slate-500">{course.sinif}</td>
                            <td className="p-4 font-semibold text-slate-500">{course.gun} • {course.saat}</td>
                            <td className="p-4 text-center font-bold text-slate-700">{course.kredi}</td>
                            <td className="p-4 text-center font-bold text-slate-700">{course.ogrenciSayisi}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setActiveTab('class_list');
                                  setSelectedCourse(course);
                                  setExpandedStudentId(null);
                                }}
                                className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold px-3 py-1.5 rounded-md text-xs transition inline-flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">groups</span>
                                <span>Sınıf Listesi</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTab('grade_entry');
                                  setSelectedCourse(course);
                                  setExpandedStudentId(null);
                                }}
                                className="bg-secondary/15 hover:bg-secondary/25 text-primary font-bold px-3 py-1.5 rounded-md text-xs transition inline-flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">edit_note</span>
                                <span>Not Girişi</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PROFILE & SETTINGS */}
            {activeTab === 'profil' && (
              <Profil onPageChange={(page) => {
                if (page === 'login') {
                  onLogout();
                } else if (page === 'studentDashboard' || page === 'academicDashboard') {
                  setActiveTab('overview');
                } else {
                  setActiveTab(page);
                }
              }} />
            )}

          </div>
        </main>
      </div>

    </div>
  );
}
