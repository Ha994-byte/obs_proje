import { useState, useEffect } from 'react';
import { api } from './utils/api.js';
import Login from "./pages/Login";
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import AcademicianDashboard from './pages/AcademicianDashboard.jsx';
import DersKaydi from './pages/DersKaydi.jsx';
import Notlar from './pages/Notlar.jsx';
import Transkript from './pages/Transkript.jsx';
import Duyurular from './pages/Duyurular.jsx';
import Devamsizlik from './pages/Devamsizlik.jsx';
import Profil from './pages/Profil.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import DersProgrami from './pages/DersProgrami.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await api.get('/auth/me');
          if (profile) {
            localStorage.setItem('user', JSON.stringify(profile));
            const roleClean = profile.role.trim().toUpperCase().replace(/İ/g, 'I');
            if (roleClean === 'ROLE_ADMIN') {
              setCurrentPage('admin');
            } else if (roleClean === 'ROLE_AKADEMISYEN') {
              setCurrentPage('academicDashboard');
            } else {
              setCurrentPage('studentDashboard');
            }
          }
        } catch (e) {
          console.error("Auto login failed:", e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentPage('login');
        }
      }
    };
    checkAuth();
  }, []);

  // Helper to check if a page belongs to the student portal
  const isStudentPage = (page) => {
    return [
      'studentDashboard',
      'dersProgrami',
      'dersKaydi',
      'notlar',
      'transkript',
      'duyurular',
      'devamsizlik',
      'profil'
    ].includes(page);
  };

  const handleLogin = (role) => {
    if (role === 'student') {
      setCurrentPage('studentDashboard');
    } else if (role === 'admin') {
      setCurrentPage('admin');
    } else if (role === 'academic') {
      setCurrentPage('academicDashboard');
    } else {
      // Academic or other - fall back to student dashboard for demo
      setCurrentPage('studentDashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      case 'academicDashboard':
        return <AcademicianDashboard onLogout={handleLogout} />;
      case 'studentDashboard':
        return <StudentDashboard onPageChange={setCurrentPage} />;
      case 'dersProgrami':
        return <DersProgrami />;
      case 'dersKaydi':
        return <DersKaydi />;
      case 'notlar':
        return <Notlar onPageChange={setCurrentPage} />;
      case 'transkript':
        return <Transkript />;
      case 'duyurular':
        return <Duyurular />;
      case 'devamsizlik':
        return <Devamsizlik />;
      case 'profil':
        return <Profil onPageChange={setCurrentPage} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  // Sayfa seçim menüsü (geliştirme amaçlı test aracı)
  const PageSelector = () => (
    <div className="fixed bottom-4 right-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 z-50 backdrop-blur-md max-w-xs shadow-2xl">
      <p className="text-white text-[10px] font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Hızlı Seçim (Test)
      </p>
      <select 
        value={currentPage}
        onChange={(e) => setCurrentPage(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#5b7cd7]"
      >
        <option value="login">🔐 Giriş Sayfası</option>
        <option value="studentDashboard">🎓 Öğrenci Dashboard</option>
        <option value="dersProgrami">📅 Ders Programı</option>
        <option value="academicDashboard">👨‍🏫 Akademisyen Paneli</option>
        <option value="dersKaydi">📚 Ders Kaydı</option>
        <option value="notlar">📝 Notlar</option>
        <option value="transkript">📄 Transkript</option>
        <option value="duyurular">📢 Duyurular</option>
        <option value="devamsizlik">✓ Devamsızlık</option>
        <option value="profil">👤 Profil</option>
        <option value="admin">⚙️ İdari Dashboard</option>
      </select>
    </div>
  );

  return (
    <>
      {isStudentPage(currentPage) ? (
        <StudentLayout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderContent()}
        </StudentLayout>
      ) : (
        renderContent()
      )}
      <PageSelector />
    </>
  );
}

export default App;
