import React, { useState } from 'react';
import { api } from '../utils/api.js';

function Login({ onLogin }) {
  // --- State Management ---
  const [activeRole, setActiveRole] = useState('student'); // 'student', 'academic', 'admin'
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // --- Dynamic Placeholders ---
  const roleContent = {
    student: {
      label: 'Öğrenci Numarası / Kullanıcı Adı',
      placeholder: 'Öğrenci numaranızı girin'
    },
    academic: {
      label: 'Akademisyen Sicil No / Kullanıcı Adı',
      placeholder: 'Personel numaranızı girin'
    },
    admin: {
      label: 'İdari Kullanıcı Adı',
      placeholder: 'İdari kullanıcı adınızı girin'
    }
  };

  // --- Login Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = await api.post('/auth/login', {
        username: username,
        password: password
      });

      if (loginData && loginData.token) {
        localStorage.setItem('token', loginData.token);

        // Fetch user profile info
        const profile = await api.get('/auth/me');
        if (profile) {
          localStorage.setItem('user', JSON.stringify(profile));

          // Map ROLE_X to UI role keys
          const roleClean = profile.role.trim().toUpperCase().replace(/İ/g, 'I');
          let roleKey = 'student';
          if (roleClean === 'ROLE_ADMIN') {
            roleKey = 'admin';
          } else if (roleClean === 'ROLE_AKADEMISYEN') {
            roleKey = 'academic';
          }

          if (onLogin) {
            onLogin(roleKey);
          }
        } else {
          alert("Kullanıcı profil bilgileri yüklenemedi.");
        }
      } else {
        alert("Giriş başarısız! Kullanıcı adı veya şifre hatalı.");
      }
    } catch (err) {
      console.error("Giriş Hatası:", err);
      alert("Giriş sırasında hata oluştu: " + err.message);
    }
  };

  // --- Seed Database handler ---
  const handleSeed = async () => {
    try {
      const res = await api.get('/auth/seed');
      alert(res || "Veritabanı başarıyla seed edildi!");
    } catch (err) {
      console.error("Seed Hatası:", err);
      alert("Seed sırasında hata oluştu: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(circle_at_top,_rgba(18,30,45,0.06),_rgba(248,249,250,1)_75%)] flex flex-col justify-between font-sans text-slate-800">
      
      {/* Centered Login Box */}
      <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
        <div className="bg-white rounded-lg shadow-xl border border-border-subtle w-full max-w-[700px] sm:max-w-[820px] overflow-hidden">
          
          {/* Header */}
          <div className="p-8 sm:p-12 text-center border-b border-border-subtle bg-[#F4F6F8]/40">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary text-primary rounded-md mb-6 shadow-lg shadow-secondary/10">
              <span className="material-symbols-outlined" style={{ fontSize: 44 }}>
                school
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Öğrenci Bilgi Yönetim Sistemi</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">Giriş Paneli</p>
          </div>
  
          {/* Tab Buttons (Student / Academic / Admin) */}
          <div className="flex border-b border-border-subtle bg-[#F4F6F8]/20 flex-row">
            <button
              type="button"
              onClick={() => {
                setActiveRole('student');
                setUsername('');
                setPassword('');
              }}
              className={`flex-1 py-4 text-sm sm:text-lg font-bold transition-all border-b-[3px] ${
                activeRole === 'student'
                  ? 'text-primary border-secondary bg-white font-extrabold'
                  : 'text-slate-500 border-transparent hover:text-primary hover:bg-[#F4F6F8]/30'
              }`}
            >
              Öğrenci
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole('academic');
                setUsername('');
                setPassword('');
              }}
              className={`flex-1 py-4 text-sm sm:text-lg font-bold transition-all border-b-[3px] ${
                activeRole === 'academic'
                  ? 'text-primary border-secondary bg-white font-extrabold'
                  : 'text-slate-500 border-transparent hover:text-primary hover:bg-[#F4F6F8]/30'
              }`}
            >
              Akademisyen
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setUsername('');
                setPassword('');
              }}
              className={`flex-1 py-4 text-sm sm:text-lg font-bold transition-all border-b-[3px] ${
                activeRole === 'admin'
                  ? 'text-primary border-secondary bg-white font-extrabold'
                  : 'text-slate-500 border-transparent hover:text-primary hover:bg-[#F4F6F8]/30'
              }`}
            >
              İdari Personel
            </button>
          </div>
  
          {/* Form */}
          <div className="p-8 sm:p-12 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider" htmlFor="username">
                  {roleContent[activeRole].label}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl sm:text-2xl">
                    person
                  </span>
                  <input
                    type="text"
                    id="username"
                    required
                    placeholder={roleContent[activeRole].placeholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-border-subtle rounded-md pl-12 pr-5 py-3.5 text-base outline-none bg-[#F4F6F8]/50 text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary/35 transition-all font-medium"
                  />
                </div>
              </div>
  
              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">
                    Şifre
                  </label>
                  <a className="text-xs sm:text-sm font-bold text-secondary hover:text-secondary/80 hover:underline" href="#forgot">
                    Şifremi Unuttum?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl sm:text-2xl">
                    lock
                  </span>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border-subtle rounded-md pl-12 pr-12 py-3.5 text-base outline-none bg-[#F4F6F8]/50 text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary/35 transition-all font-medium"
                  />
                  {/* Show/Hide Password */}
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 flex items-center"
                  >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">
                      {isPasswordVisible ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
  
              {/* Remember Me checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-secondary border-border-subtle rounded accent-secondary focus:ring-secondary cursor-pointer"
                />
                <label className="ml-3 text-sm sm:text-base text-slate-600 cursor-pointer select-none font-bold" htmlFor="remember">
                  Beni Hatırla
                </label>
              </div>
  
              {/* Login Button */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#1C2C40] transition text-white py-4 rounded-md text-base sm:text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
                >
                  <span>Giriş Yap</span>
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    login
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleSeed}
                  className="w-full bg-slate-100 hover:bg-slate-200/80 transition text-slate-700 py-3.5 rounded-md text-base font-bold flex items-center justify-center gap-2 border border-slate-200"
                >
                  <span className="material-symbols-outlined text-xl">database</span>
                  <span>Test Veritabanını Seed Et (Seed Database)</span>
                </button>
              </div>
  
            </form>
          </div>
        </div>
      </main>      
      
      {/* Footer */}
      <footer className="border-t border-border-subtle w-full bg-gradient-to-b from-transparent to-slate-100/30 py-6 sm:py-8 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row justify-center items-center text-sm sm:text-base text-slate-500 gap-4 sm:gap-8 mb-4">
            <a href="#sp" className="text-slate-550 hover:text-primary hover:underline underline-offset-2 transition-colors duration-200 font-bold">Destek</a>
            <a href="#pr" className="text-slate-550 hover:text-primary hover:underline underline-offset-2 transition-colors duration-200 font-bold">Gizlilik Sözleşmesi</a>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm sm:text-base text-slate-400 border-t border-border-subtle/50 pt-5">
            <p className="hover:text-slate-500 transition-colors cursor-default font-semibold">
              © 2026 Tüm Hakları Saklıdır
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
