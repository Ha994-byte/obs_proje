import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { GraduationCap, User, ShieldCheck } from "lucide-react";
import StudentDashboard from "./pages/StudentDashboard";
import AcademicDashboard from "./pages/AcademicDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentLogin from "./pages/StudentLogin";
import AcademicLogin from "./pages/AcademicLogin";
import AdminLogin from "./pages/AdminLogin";
import logo from './logo.png';
import crud from './crud.png';
import Login from "./pages/Login";







function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fb]">

      {/* TOPBAR */}
      <div className="w-full bg-white border-b border-slate-200 px-10 py-5 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <img 
    src={logo} 
    alt="Üniversite Logo" 
    className="w-12 h-12 object-contain" 
  />





          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              İstanbul Esenyurt Üniversitesi
            </h1>

            <p className="text-slate-500 text-lg">
              Öğrenci Bilgi Sistemi
              
            </p>
          </div>
        </div>

        <div className="flex gap-10 text-slate-700 text-lg">
          <span className="cursor-pointer hover:text-blue-600">
            Ana Sayfa
          </span>

          <span className="cursor-pointer hover:text-blue-600">
            Duyurular

              <img 
    src={crud} 
    alt="Üniversite Logo" 
    className="w-12 h-12 object-contain" 
  />
          </span>

          <span className="cursor-pointer hover:text-blue-600">
            Akademik Takvim
          </span>

          <span className="cursor-pointer hover:text-blue-600">
            İletişim
          </span>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center mt-20 px-4">

        <div className="bg-blue-100 text-blue-700 px-6 py-2 rounded-full text-lg font-semibold">
          Yeni Nesil Üniversite Otomasyonu
        </div>

        <h1 className="text-[90px] leading-[95px] font-black text-slate-900 text-center mt-8">
          Öğrenci
          <br />
          Bilgi Sistemi
        </h1>

        <p className="text-slate-600 text-2xl text-center mt-8 leading-10 max-w-4xl">
          Öğrenci, akademisyen ve idari personeller için geliştirilmiş modern üniversite yönetim platformu.
        </p>

        {/* LOGIN CARD */}
        <div className="w-full flex justify-center mt-20">

          <div className="w-full max-w-2xl bg-white rounded-[35px] shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-[#3572b0] text-white text-center py-7 text-4xl font-bold">
              Önlisans / Lisans / Enstitü
            </div>

            {/* STUDENT */}
            <button
              onClick={() => navigate("/student-login")}
              className="w-full flex items-center justify-center gap-5 py-10 text-[36px] text-slate-800 hover:bg-slate-50 transition"
            >
              <GraduationCap className="w-10 h-10 text-blue-600" />
              Öğrenci Girişi
            </button>

            {/* ACADEMIC */}
            <button
              onClick={() => navigate("/academic-login")}
              className="w-full flex items-center justify-center gap-5 py-10 text-[36px] text-slate-800 border-t hover:bg-slate-50 transition"
            >
              <User className="w-10 h-10 text-cyan-700" />
              Akademisyen Girişi
            </button>

            {/* ADMIN */}
            <button
              onClick={() => navigate("/admin-login")}
              className="w-full flex items-center justify-center gap-5 py-10 text-[36px] text-slate-800 border-t hover:bg-slate-50 transition"
            >
              <ShieldCheck className="w-10 h-10 text-green-600" />
              İdari Girişi
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route
        path="/student-login"
        element={<StudentLogin />}
      />

      <Route
        path="/academic-login"
        element={<AcademicLogin />}
      />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/student-dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/academic-dashboard"
        element={<AcademicDashboard />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

    </Routes>
  );
}

export default App;