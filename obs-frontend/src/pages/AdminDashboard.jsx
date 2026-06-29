import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, Trash2, Plus, Users, BookOpen, Megaphone, Activity, Calendar, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { api } from '../utils/api.js';
import Profil from './Profil.jsx';

export default function AdminDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Stats State
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAcademicians: 0,
    totalCourses: 0,
    totalFees: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // User Management State
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    ad: '',
    soyad: '',
    tcKimlik: '',
    username: '',
    password: '',
    rol: 'ROLE_OGRENCI'
  });

  // Course Management State
  const [courses, setCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [newCourse, setNewCourse] = useState({
    dersKodu: '',
    dersAdi: '',
    kredi: 3
  });

  // Announcement State
  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    baslik: '',
    icerik: '',
    hedefRol: 'OGRENCI',
    dersId: null
  });

  // Term (Dönem) State
  const [donemList, setDonemList] = useState([]);
  const [donemLoading, setDonemLoading] = useState(false);
  const [newDonem, setNewDonem] = useState({
    ad: ''
  });

  // Student State (for Fee allocation and deactivation status lookup)
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Opened Courses (Açılan Dersler) State
  const [acilanDersList, setAcilanDersList] = useState([]);
  const [acilanDersLoading, setAcilanDersLoading] = useState(false);

  // Fee Assignment Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentRegistrations, setStudentRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [selectedDersKaydiId, setSelectedDersKaydiId] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeDueDate, setFeeDueDate] = useState('');
  const [feeSubmitting, setFeeSubmitting] = useState(false);

  // Get Admin Profile from storage
  const userStr = localStorage.getItem('user');
  const adminUser = userStr ? JSON.parse(userStr) : null;
  const adminName = adminUser ? `${adminUser.ad || 'İdari'} ${adminUser.soyad || 'Kullanıcı'}` : 'Sistem Admin';
  const adminInitial = adminUser && adminUser.ad ? adminUser.ad.charAt(0).toUpperCase() : 'A';

  // Fetch initial data
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchCourses();
    fetchAnnouncements();
    fetchSemesters();
    fetchStudents();
    fetchAcilanDersler();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await api.get('/admin/istatistik');
      if (data) {
        setStats({
          totalStudents: data.toplamOgrenci || 0,
          totalAcademicians: data.toplamAkademisyen || 0,
          totalCourses: data.toplamDers || 0,
          totalFees: data.toplamUcretKaydi || 0
        });
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const data = await api.get('/admin/kullanicilar');
      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Users fetch error:", err);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchCourses = async () => {
    setCourseLoading(true);
    try {
      const data = await api.get('/ders');
      if (data) {
        setCourses(data);
      }
    } catch (err) {
      console.error("Courses fetch error:", err);
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    setAnnouncementLoading(true);
    try {
      const data = await api.get('/duyuru');
      if (data) {
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Announcements fetch error:", err);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const fetchSemesters = async () => {
    setDonemLoading(true);
    try {
      const data = await api.get('/admin/donem');
      if (data) {
        setDonemList(data);
      }
    } catch (err) {
      console.error("Semesters fetch error:", err);
    } finally {
      setDonemLoading(false);
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const data = await api.get('/ogrenci');
      if (data) {
        setStudents(data);
      }
    } catch (err) {
      console.error("Students fetch error:", err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchAcilanDersler = async () => {
    setAcilanDersLoading(true);
    try {
      const data = await api.get('/acilan-ders');
      if (data) {
        setAcilanDersList(data);
      }
    } catch (err) {
      console.error("Acilan dersler fetch error:", err);
    } finally {
      setAcilanDersLoading(false);
    }
  };

  // Actions
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/kullanici', newUser);
      alert("Kullanıcı başarıyla oluşturuldu!");
      setNewUser({ ad: '', soyad: '', tcKimlik: '', username: '', password: '', rol: 'ROLE_OGRENCI' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert("Kullanıcı oluşturulurken hata oluştu: " + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/kullanici/${userId}`);
      alert("Kullanıcı silindi!");
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert("Kullanıcı silinirken hata oluştu: " + err.message);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ders', newCourse);
      alert("Ders başarıyla eklendi!");
      setNewCourse({ dersKodu: '', dersAdi: '', kredi: 3 });
      fetchCourses();
      fetchStats();
    } catch (err) {
      alert("Ders eklenirken hata oluştu: " + err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Bu dersi silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/ders/${courseId}`);
      alert("Ders silindi!");
      fetchCourses();
      fetchStats();
    } catch (err) {
      alert("Ders silinirken hata oluştu: " + err.message);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/duyuru', newAnnouncement);
      alert("Duyuru başarıyla yayınlandı!");
      setNewAnnouncement({ baslik: '', icerik: '', hedefRol: 'OGRENCI', dersId: null });
      fetchAnnouncements();
    } catch (err) {
      alert("Duyuru yayınlanırken hata oluştu: " + err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/rol/${userId}?rol=${newRole}`);
      alert("Kullanıcı rolü başarıyla güncellendi!");
      fetchUsers();
    } catch (err) {
      alert("Kullanıcı rolü güncellenirken hata oluştu: " + err.message);
    }
  };

  const handleDeactivateStudent = async (studentId) => {
    if (!confirm("Bu öğrenciyi pasif yapmak istediğinize emin misiniz?")) return;
    try {
      await api.put(`/admin/ogrenci-pasif/${studentId}`);
      alert("Öğrenci başarıyla pasif yapıldı!");
      fetchStudents();
    } catch (err) {
      alert("Öğrenci pasif yapılırken hata oluştu: " + err.message);
    }
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();
    if (!newDonem.ad.trim()) return;
    try {
      await api.post('/admin/donem', newDonem);
      alert("Dönem başarıyla eklendi!");
      setNewDonem({ ad: '' });
      fetchSemesters();
    } catch (err) {
      alert("Dönem eklenirken hata oluştu: " + err.message);
    }
  };

  const handleStudentSelect = async (studentId) => {
    setSelectedStudentId(studentId);
    setSelectedDersKaydiId('');
    if (!studentId) {
      setStudentRegistrations([]);
      return;
    }
    setRegistrationsLoading(true);
    try {
      const data = await api.get(`/ders-kaydi/ogrenci/${studentId}`);
      if (data) {
        setStudentRegistrations(data);
      }
    } catch (err) {
      console.error("Student registrations fetch error:", err);
      setStudentRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleAssignFee = async (e) => {
    e.preventDefault();
    if (!selectedDersKaydiId || !feeAmount || !feeDueDate) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    setFeeSubmitting(true);
    try {
      await api.post('/admin/ucret', {
        dersKaydiId: selectedDersKaydiId,
        tutar: parseFloat(feeAmount),
        sonOdemeTarihi: feeDueDate
      });
      alert("Harç/Ücret başarıyla atandı!");
      setFeeAmount('');
      setFeeDueDate('');
      setSelectedDersKaydiId('');
      fetchStats();
    } catch (err) {
      alert("Harç atanırken hata oluştu: " + err.message);
    } finally {
      setFeeSubmitting(false);
    }
  };

  const adminStats = [
    { label: 'Toplam Öğrenci', value: stats.totalStudents, icon: 'people', color: '#5b7cd7', desc: 'Kayıtlı aktif öğrenciler' },
    { label: 'Aktif Dersler', value: stats.totalCourses, icon: 'book', color: '#10b981', desc: 'Müfredattaki ders sayısı' },
    { label: 'Akademisyenler', value: stats.totalAcademicians, icon: 'school', color: '#f59e0b', desc: 'Aktif öğretim elemanları' },
    { label: 'Harç Kayıtları', value: stats.totalFees, icon: 'payments', color: '#8b5cf6', desc: 'Ödeme bekleyen kayıtlar' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col lg:flex-row">
      
      {/* Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 lg:hidden z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static w-[360px] lg:w-[450px] bg-primary border-r border-white/10 h-screen transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50 flex flex-col`}>
        <div className="p-5 border-b border-white/10 bg-primary">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br bg-secondary text-primary flex items-center justify-center shadow-lg shadow-secondary/10 flex-shrink-0">
                <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-extrabold text-white tracking-tight leading-none mb-1">OBS İdari</h1>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Yönetim Paneli</p>
              </div>
            </div>
            {/* Close button on mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg transition"
              aria-label="Menüyü Kapat"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto bg-primary">
          {[
            { icon: 'home', label: 'Ana Sayfa', tab: 'overview' },
            { icon: 'people', label: 'Kullanıcı Yönetimi', tab: 'users' },
            { icon: 'book', label: 'Ders Yönetimi', tab: 'courses' },
            { icon: 'event_note', label: 'Duyuru Yönetimi', tab: 'announcements' },
            { icon: 'calendar_today', label: 'Dönem Yönetimi', tab: 'terms' },
            { icon: 'payments', label: 'Harç / Ücret Yönetimi', tab: 'fees' }
          ].map((item, idx) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(item.tab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-md transition-all duration-300 text-sm sm:text-base font-bold text-left ${
                  isActive
                    ? 'bg-white/10 text-secondary border-l-4 border-secondary font-bold shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined text-lg flex-shrink-0">{item.icon}</span>
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
            <p className="text-xs text-secondary mb-1.5 font-bold uppercase tracking-wider">Giriş Yapan İdari Personel</p>
            <p className="text-base lg:text-lg font-bold text-white truncate">{adminName}</p>
            <p className="text-xs lg:text-sm text-slate-400 font-medium tracking-wide">Rol: İdari Yönetici</p>
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
        {/* Header */}
        <header className="bg-white border-b border-border-subtle px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
          <button className="lg:hidden text-slate-700 text-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-base sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            İdari Kontrol
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-500 hidden sm:inline">Veritabanı Aktif</span>
            <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs shadow-md shadow-secondary/10">
              {adminInitial}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-3.5 sm:p-6 lg:p-8 w-full min-w-0 overflow-x-hidden">
          <div className="w-full space-y-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {adminStats.map((stat, idx) => (
                    <div key={idx} className="bg-white border border-border-subtle shadow-sm rounded-lg p-4 sm:p-6 hover:shadow-md transition duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl" style={{ color: stat.color }}>{stat.icon}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-none mb-2">{statsLoading ? '...' : stat.value}</p>
                      <p className="text-xs sm:text-sm text-slate-500 font-bold">{stat.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Users List */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-800">Son Eklenen Kullanıcılar</h4>
                      <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-secondary hover:underline">Tümünü Gör</button>
                    </div>
                    {userLoading ? (
                      <p className="text-center text-slate-500 py-6 text-sm">Yükleniyor...</p>
                    ) : users.length === 0 ? (
                      <p className="text-center text-slate-500 py-6 text-sm">Kayıtlı kullanıcı bulunamadı.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {users.slice(-4).reverse().map((u, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-md border border-border-subtle hover:border-secondary/20 transition gap-2 shadow-sm">
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-sm sm:text-base truncate">@{u.username}</p>
                              <p className="text-xs text-slate-400 font-semibold truncate uppercase tracking-wider">ID: {u.id.substring(0,8)}...</p>
                            </div>
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                              u.rol === 'ROLE_ADMIN' || u.rol === 'ROLE_ADMİN'
                                ? 'bg-purple-50 text-purple-600 border border-purple-200/40'
                                : u.rol === 'ROLE_AKADEMISYEN'
                                ? 'bg-amber-50 text-amber-600 border border-amber-200/40'
                                : 'bg-secondary/15 text-blue-600 border border-blue-200/40'
                            }`}>
                              {u.rol}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Announcements */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-800">Son Sistem Duyuruları</h4>
                      <button onClick={() => setActiveTab('announcements')} className="text-xs font-bold text-secondary hover:underline">Duyuru Ekle</button>
                    </div>
                    {announcementLoading ? (
                      <p className="text-center text-slate-500 py-6 text-sm">Yükleniyor...</p>
                    ) : announcements.length === 0 ? (
                      <p className="text-center text-slate-500 py-6 text-sm">Yayınlanmış duyuru bulunmuyor.</p>
                    ) : (
                      <div className="space-y-3">
                        {announcements.slice(-3).reverse().map((a, idx) => (
                          <div key={idx} className="text-sm sm:text-base p-3 bg-slate-50/50 rounded-md border border-border-subtle shadow-sm">
                            <div className="flex items-center justify-between mb-1.5 gap-2">
                              <p className="font-bold text-slate-800 truncate">{a.baslik}</p>
                              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{a.hedefRol}</span>
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-1 font-medium">{a.icerik}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Kullanıcı Yönetimi</h3>
                  <p className="text-sm sm:text-base text-slate-500 font-bold">Sisteme yeni Öğrenci veya Akademisyen ekleyin, silin ve yönetin.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* User Creation Form */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 lg:col-span-1">
                    <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">person_add</span>
                      Yeni Kullanıcı Ekle
                    </h4>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Ad</label>
                        <input 
                          type="text" 
                          required
                          value={newUser.ad} 
                          onChange={(e) => setNewUser({...newUser, ad: e.target.value})}
                          placeholder="Örn: Ahmet"
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Soyad</label>
                        <input 
                          type="text" 
                          required
                          value={newUser.soyad} 
                          onChange={(e) => setNewUser({...newUser, soyad: e.target.value})}
                          placeholder="Örn: Yılmaz"
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">TC Kimlik No</label>
                        <input 
                          type="text" 
                          required
                          maxLength={11}
                          value={newUser.tcKimlik} 
                          onChange={(e) => setNewUser({...newUser, tcKimlik: e.target.value})}
                          placeholder="11 haneli TC no"
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Kullanıcı Adı</label>
                        <input 
                          type="text" 
                          required
                          value={newUser.username} 
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          placeholder="Giriş için kullanıcı adı"
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Şifre</label>
                        <input 
                          type="password" 
                          required
                          value={newUser.password} 
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="••••••••"
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Kullanıcı Rolü</label>
                        <select
                          value={newUser.rol}
                          onChange={(e) => setNewUser({...newUser, rol: e.target.value})}
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white font-bold"
                        >
                          <option value="ROLE_OGRENCI">Öğrenci (ROLE_OGRENCI)</option>
                          <option value="ROLE_AKADEMISYEN">Akademisyen (ROLE_AKADEMISYEN)</option>
                          <option value="ROLE_ADMIN">İdari Yönetici (ROLE_ADMIN)</option>
                        </select>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-primary hover:bg-[#1c2c40] transition text-white py-3 rounded-md text-sm sm:text-base font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mt-2"
                      >
                        <Plus size={16} />
                        <span>Kullanıcıyı Kaydet</span>
                      </button>
                    </form>
                  </div>

                  {/* User List Table */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 lg:col-span-2">
                    <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle">
                      Kayıtlı Tüm Kullanıcılar ({users.length})
                    </h4>
                    {userLoading ? (
                      <p className="text-center text-slate-500 py-12 text-sm">Yükleniyor...</p>
                    ) : users.length === 0 ? (
                      <p className="text-center text-slate-500 py-12 text-sm">Kayıtlı kullanıcı bulunamadı.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm sm:text-base">
                          <thead>
                            <tr className="border-b border-border-subtle text-slate-400 font-bold bg-slate-50/50">
                              <th className="py-3 px-2 sm:px-3">Kullanıcı Adı</th>
                              <th className="py-3 px-2 sm:px-3">Rol</th>
                              <th className="py-3 px-2 sm:px-3 text-right">İşlemler</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {users.map((u) => {
                              const userRole = u.role || u.rol || 'ROLE_OGRENCI';
                              const student = userRole === 'ROLE_OGRENCI' 
                                ? students.find(s => s.insanId === u.insanId) 
                                : null;
                              
                              return (
                                <tr key={u.id} className="hover:bg-slate-50/30 transition">
                                  <td className="py-3 px-2 sm:px-3 font-semibold text-slate-800">
                                    <div className="flex flex-col">
                                      <span className="font-bold">@{u.username}</span>
                                      {student && (
                                        <span className="text-[11px] text-slate-400 font-medium">No: {student.ogrenciNo}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 sm:px-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <select
                                        value={userRole}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="border border-border-subtle rounded px-2 py-1 text-xs bg-slate-50 outline-none focus:border-secondary font-bold text-slate-700"
                                      >
                                        <option value="ROLE_OGRENCI">Öğrenci (ROLE_OGRENCI)</option>
                                        <option value="ROLE_AKADEMISYEN">Akademisyen (ROLE_AKADEMISYEN)</option>
                                        <option value="ROLE_ADMIN">İdari Yönetici (ROLE_ADMIN)</option>
                                      </select>
                                      
                                      {student && (
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                          student.aktif
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/40'
                                            : 'bg-rose-50 text-rose-600 border border-rose-200/40'
                                        }`}>
                                          {student.aktif ? 'Aktif' : 'Pasif'}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 sm:px-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {student && student.aktif && (
                                        <button 
                                          onClick={() => handleDeactivateStudent(student.id)}
                                          className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-2 py-1 rounded-md transition text-xs font-bold flex items-center gap-1 border border-amber-200/50"
                                          title="Öğrenciyi Pasif Yap"
                                        >
                                          <span className="material-symbols-outlined text-sm">block</span>
                                          <span className="hidden sm:inline">Pasif Yap</span>
                                        </button>
                                      )}
                                      
                                      <button 
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                                        title="Kullanıcıyı Sil"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: COURSE MANAGEMENT */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Ders Yönetimi</h3>
                  <p className="text-sm sm:text-base text-slate-500 font-bold">Müfredattaki dersleri ekleyin, düzenleyin ve silin.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Course Creation Form */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 lg:col-span-1">
                    <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#10b981]">library_add</span>
                      Yeni Ders Ekle
                    </h4>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Ders Kodu</label>
                        <input 
                          type="text" 
                          required
                          value={newCourse.dersKodu} 
                          onChange={(e) => setNewCourse({...newCourse, dersKodu: e.target.value})}
                          placeholder="Örn: BLM201"
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Ders Adı</label>
                        <input 
                          type="text" 
                          required
                          value={newCourse.dersAdi} 
                          onChange={(e) => setNewCourse({...newCourse, dersAdi: e.target.value})}
                          placeholder="Örn: Veri Yapıları"
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Ders Kredisi</label>
                        <input 
                          type="number" 
                          required
                          min={1}
                          max={10}
                          value={newCourse.kredi} 
                          onChange={(e) => setNewCourse({...newCourse, kredi: parseInt(e.target.value) || 3})}
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white font-bold"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-primary hover:bg-[#1c2c40] transition text-white py-3 rounded-md text-sm sm:text-base font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mt-2"
                      >
                        <Plus size={16} />
                        <span>Dersi Müfredata Ekle</span>
                      </button>
                    </form>
                  </div>

                  {/* Course List Table */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 lg:col-span-2">
                    <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle">
                      Aktif Ders Müfredatı ({courses.length})
                    </h4>
                    {courseLoading ? (
                      <p className="text-center text-slate-500 py-12 text-sm">Yükleniyor...</p>
                    ) : courses.length === 0 ? (
                      <p className="text-center text-slate-500 py-12 text-sm">Müfredatta tanımlı ders bulunamadı.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm sm:text-base">
                          <thead>
                            <tr className="border-b border-border-subtle text-slate-400 font-bold bg-slate-50/50">
                              <th className="py-3 px-2 sm:px-3">Ders Kodu</th>
                              <th className="py-3 px-2 sm:px-3">Ders Adı</th>
                              <th className="py-3 px-2 sm:px-3">Kredi</th>
                              <th className="py-3 px-2 sm:px-3 text-right">İşlemler</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {courses.map((c) => (
                              <tr key={c.id} className="hover:bg-slate-50/30 transition">
                                <td className="py-3 px-2 sm:px-3 font-bold text-slate-800">{c.dersKodu}</td>
                                <td className="py-3 px-2 sm:px-3 font-semibold text-slate-655 text-slate-700">{c.dersAdi}</td>
                                <td className="py-3 px-2 sm:px-3 text-slate-500 font-bold">{c.kredi} AKTS</td>
                                <td className="py-3 px-2 sm:px-3 text-right">
                                  <button 
                                    onClick={() => handleDeleteCourse(c.id)}
                                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                                    title="Dersi Sil"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Duyuru Yönetimi</h3>
                  <p className="text-sm sm:text-base text-slate-500 font-bold">Hedef gruplara yönelik duyurular oluşturun ve yayınlayın.</p>
                </div>

                <div className="space-y-6 w-full">
                  
                  {/* Announcement Creation Form */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 w-full">
                    <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#f59e0b]">campaign</span>
                      Yeni Duyuru Yayınla
                    </h4>
                    <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="block text-sm font-bold text-slate-600">Duyuru Başlığı</label>
                          <input 
                            type="text" 
                            required
                            value={newAnnouncement.baslik} 
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, baslik: e.target.value})}
                            placeholder="Örn: Sınav Takvimi Hakkında"
                            className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-[#f59e0b] focus:bg-white"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                          <label className="block text-sm font-bold text-slate-600">Hedef Kitle (Rol)</label>
                          <select
                            value={newAnnouncement.hedefRol}
                            onChange={(e) => setNewAnnouncement({...newAnnouncement, hedefRol: e.target.value})}
                            className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-[#f59e0b] focus:bg-white font-bold h-[45px] sm:h-[48px]"
                          >
                            <option value="OGRENCI">Tüm Öğrenciler (OGRENCI)</option>
                            <option value="AKADEMISYEN">Tüm Akademisyenler (AKADEMISYEN)</option>
                            <option value="ADMIN">Tüm İdari Kadro (ADMIN)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-600">Duyuru İçeriği</label>
                        <textarea 
                          required
                          rows={4}
                          value={newAnnouncement.icerik} 
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, icerik: e.target.value})}
                          placeholder="Yayınlanacak detaylı duyuru metni..."
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-[#f59e0b] focus:bg-white font-semibold leading-relaxed font-sans"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-[#1c2c40] transition text-white rounded-md text-sm sm:text-base font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mt-2"
                        >
                          <Megaphone size={16} />
                          <span>Duyuruyu Yayınla</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Announcement List */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 w-full">
                    <h4 className="text-lg font-black text-slate-805 mb-4 pb-2 border-b border-border-subtle">
                      Sistemde Yayınlanmış Tüm Duyurular ({announcements.length})
                    </h4>
                    {announcementLoading ? (
                      <p className="text-center text-slate-500 py-12 text-sm">Yükleniyor...</p>
                    ) : announcements.length === 0 ? (
                      <p className="text-center text-slate-500 py-12 text-sm">Yayınlanmış duyuru bulunmuyor.</p>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {announcements.slice().reverse().map((a, idx) => (
                          <div key={idx} className="p-4 bg-slate-50/50 rounded-lg border border-border-subtle hover:border-slate-300 transition duration-300 shadow-sm">
                            <div className="flex items-center justify-between mb-2 gap-2 border-b border-border-subtle pb-2">
                              <span className="font-black text-slate-800 text-base sm:text-lg">{a.baslik}</span>
                              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                                a.hedefRol === 'ADMIN'
                                  ? 'bg-purple-50 text-purple-600 border border-purple-200/40'
                                  : a.hedefRol === 'AKADEMISYEN'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-200/40'
                                  : 'bg-secondary/15 text-blue-600 border border-blue-200/40'
                              }`}>
                                {a.hedefRol}
                              </span>
                            </div>
                            <p className="text-slate-655 text-slate-700 text-sm sm:text-base leading-relaxed font-semibold whitespace-pre-line">{a.icerik}</p>
                            <div className="mt-3 flex items-center justify-end text-xs text-slate-400 font-bold">
                              <span>Tarih: {a.tarih ? new Date(a.tarih).toLocaleString() : 'Şimdi'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 5: TERMS MANAGEMENT */}
            {activeTab === 'terms' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Dönem Yönetimi</h3>
                  <p className="text-sm sm:text-base text-slate-500 font-bold">Akademik dönemleri ekleyin ve sistemde kayıtlı dönemleri listeleyin.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column: Semester Management */}
                  <div className="space-y-6 lg:col-span-1">
                    {/* Add Semester Form */}
                    <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6">
                      <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">calendar_today</span>
                        Yeni Dönem Ekle
                      </h4>
                      <form onSubmit={handleCreateSemester} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-slate-600">Dönem Adı</label>
                          <input 
                            type="text" 
                            required
                            value={newDonem.ad} 
                            onChange={(e) => setNewDonem({...newDonem, ad: e.target.value})}
                            placeholder="Örn: 2023-2024 Güz"
                            className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white font-semibold"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-primary hover:bg-[#1c2c40] transition text-white py-3 rounded-md text-sm sm:text-base font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mt-2"
                        >
                          <Plus size={16} />
                          <span>Dönemi Kaydet</span>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Semesters List */}
                  <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 lg:col-span-2">
                    <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle flex items-center justify-between">
                      <span>Sistem Dönemleri ({donemList.length})</span>
                      {donemLoading && <span className="text-xs text-slate-400 font-bold">Yükleniyor...</span>}
                    </h4>
                    {donemList.length === 0 ? (
                      <p className="text-center text-slate-500 py-12 text-sm">Kayıtlı dönem bulunamadı.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm sm:text-base">
                          <thead>
                            <tr className="border-b border-border-subtle text-slate-400 font-bold bg-slate-50/50">
                              <th className="py-3 px-2 sm:px-3">Dönem Adı</th>
                              <th className="py-3 px-2 sm:px-3 text-right">Dönem ID</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {donemList.map((d) => (
                              <tr key={d.id} className="hover:bg-slate-50/30 transition">
                                <td className="py-3 px-2 sm:px-3 font-bold text-slate-700 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-slate-400 text-lg">event</span>
                                  <span>{d.ad}</span>
                                </td>
                                <td className="py-3 px-2 sm:px-3 text-right text-xs text-slate-400 font-mono font-medium">{d.id}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: FEES MANAGEMENT */}
            {activeTab === 'fees' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Harç / Ücret Yönetimi</h3>
                  <p className="text-sm sm:text-base text-slate-500 font-bold">Öğrencilerin ders kayıtlarına harç / borç ücretleri atayın ve yönetin.</p>
                </div>

                <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-6 w-full">
                  <h4 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-border-subtle flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500">payments</span>
                    Öğrenciye Harç/Ücret Atama
                  </h4>
                  <form onSubmit={handleAssignFee} className="space-y-5">
                    
                    {/* Step 1: Select Student */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-600">1. Öğrenci Seçin</label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => handleStudentSelect(e.target.value)}
                        className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white font-bold text-slate-700"
                      >
                        <option value="">-- Öğrenci Seçin --</option>
                        {users
                          .filter(u => (u.role || u.rol) === 'ROLE_OGRENCI')
                          .map(u => {
                            const student = students.find(s => s.insanId === u.insanId);
                            const label = student 
                              ? `Öğrenci No: ${student.ogrenciNo} (@${u.username})`
                              : `@${u.username}`;
                            return (
                              <option key={student?.id || u.id} value={student?.id || ''} disabled={!student}>
                                {label} {!student ? '(Profil Eşleşmedi)' : ''}
                              </option>
                            );
                          })
                        }
                      </select>
                    </div>

                    {/* Step 2: Select Registered Course */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-600">2. Harç Atanacak Ders Kaydını Seçin</label>
                      {registrationsLoading ? (
                        <p className="text-sm text-slate-500 italic font-medium">Ders kayıtları yükleniyor...</p>
                      ) : selectedStudentId === '' ? (
                        <p className="text-sm text-slate-400 italic font-medium">Öncelikle yukarıdan bir öğrenci seçmelisiniz.</p>
                      ) : studentRegistrations.length === 0 ? (
                        <p className="text-sm text-amber-600 font-bold bg-amber-50 border border-amber-200/50 p-3 rounded-md">
                          Seçilen öğrencinin aktif ders kaydı bulunmamaktadır.
                        </p>
                      ) : (
                        <select
                          value={selectedDersKaydiId}
                          onChange={(e) => setSelectedDersKaydiId(e.target.value)}
                          className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/35 focus:bg-white font-bold text-slate-700"
                          required
                        >
                          <option value="">-- Ders Kaydı Seçin --</option>
                          {studentRegistrations.map(reg => {
                            const openedDers = acilanDersList.find(ad => ad.id === reg.acilanDersId);
                            const course = openedDers ? courses.find(c => c.id === openedDers.dersId) : null;
                            const semester = openedDers ? donemList.find(d => d.id === openedDers.donemId) : null;
                            
                            const courseLabel = course 
                              ? `${course.dersKodu} - ${course.dersAdi}` 
                              : `Açılan Ders (ID: ${reg.acilanDersId.substring(0,8)}...)`;
                            const semesterLabel = semester ? semester.ad : 'Bilinmeyen Dönem';
                            
                            return (
                              <option key={reg.id} value={reg.id}>
                                {courseLabel} [{semesterLabel}] (Durum: {reg.durum})
                              </option>
                            );
                          })}
                        </select>
                      )}
                    </div>

                    {/* Step 3: Fee Amount */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-600">3. Harç Tutarı (TL)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(e.target.value)}
                        placeholder="Örn: 2500.00"
                        className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-emerald-500 focus:bg-white font-bold text-slate-800"
                      />
                    </div>

                    {/* Step 4: Son Ödeme Tarihi */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-600">4. Son Ödeme Tarihi</label>
                      <input
                        type="date"
                        required
                        value={feeDueDate}
                        onChange={(e) => setFeeDueDate(e.target.value)}
                        className="w-full border border-border-subtle rounded-md px-3 py-2.5 text-sm sm:text-base bg-slate-50 outline-none focus:border-emerald-500 focus:bg-white font-bold text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={feeSubmitting || !selectedDersKaydiId}
                      className={`w-full py-3 rounded-md text-sm sm:text-base font-bold flex items-center justify-center gap-1.5 shadow-md transition-all ${
                        !selectedDersKaydiId
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-primary hover:bg-[#1c2c40] text-white shadow-primary/10'
                      }`}
                    >
                      {feeSubmitting ? (
                        <span>Harç Atanıyor...</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">save</span>
                          <span>Harç / Borç Ücretini Tanımla</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: PROFILE & SETTINGS */}
            {activeTab === 'profil' && (
              <Profil onPageChange={(page) => {
                if (page === 'login') {
                  onLogout();
                } else {
                  setActiveTab('overview');
                }
              }} />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
