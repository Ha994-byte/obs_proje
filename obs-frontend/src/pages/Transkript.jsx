import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';

export default function Transkript() {
  const [language, setLanguage] = useState('tr');
  const [studentInfo, setStudentInfo] = useState({
    name: 'Havva Kelekli',
    id: '202104010',
    program: 'Bilgisayar Mühendisliği (%100 İngilizce)',
    faculty: 'Mühendislik Fakültesi',
    gpa: 3.42,
    totalCredits: 18
  });

  const [semestersList, setSemestersList] = useState([
    { semester: 'Güz 2023', courses: [
      { code: 'BGM301', name: 'Veritabanı Yönetim Sistemleri', credit: 3, grade: 'BB', average: 82.0 },
      { code: 'BGM303', name: 'İşletim Sistemleri', credit: 3, grade: 'BA', average: 85.2 },
      { code: 'MAT201', name: 'Diferansiyel Denklemler', credit: 4, grade: 'AA', average: 92.0 }
    ]},
    { semester: 'Bahar 2024', courses: [
      { code: 'CS201', name: 'Algoritma Analizi', credit: 4, grade: 'CB', average: 76.5 },
      { code: 'CS202', name: 'Veri Yapıları', credit: 4, grade: 'CC', average: 71.0 }
    ]}
  ]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentNo = user ? user.no || '202104010' : '202104010';

  useEffect(() => {
    if (!user || !user.extraId) return;

    const loadTranscript = async () => {
      try {
        const data = await api.get(`/not/ogrenci/${user.extraId}`);
        if (Array.isArray(data) && data.length > 0) {
          let totalCred = 0;
          let totalPoints = 0.0;

          const mapping = {
            'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
            'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
          };

          const resolvedCourses = data.map(g => {
            const gradePoints = mapping[g.harfNotu] || 0.0;
            totalCred += 3;
            totalPoints += gradePoints * 3;

            return {
              code: 'DERS-101',
              name: g.dersAdi || 'Ders',
              credit: 3,
              grade: g.harfNotu || 'FF',
              average: g.ortalama || 0.0
            };
          });

          const calculatedGpa = totalCred > 0 ? (totalPoints / totalCred).toFixed(2) : '0.00';

          setStudentInfo({
            name: `${user.ad || ''} ${user.soyad || ''}`,
            id: studentNo,
            program: 'Bilgisayar Mühendisliği (%100 İngilizce)',
            faculty: 'Mühendislik Fakültesi',
            gpa: parseFloat(calculatedGpa),
            totalCredits: totalCred
          });

          setSemestersList([
            { semester: 'Güz 2023', courses: resolvedCourses }
          ]);
        }
      } catch (err) {
        console.warn("Could not fetch transcript from backend, using fallback:", err);
      }
    };

    loadTranscript();
  }, [user?.extraId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!user || !user.extraId) return;
    try {
      const response = await fetch(`http://localhost:8080/not/transkript-pdf/${user.extraId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Dosya oluşturulamadı.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transkript_${studentNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Transkript PDF'i indirilemedi: " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden animate-fadeIn">
      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white border border-border-subtle rounded-md px-3.5 py-2 text-slate-700 outline-none text-xs sm:text-sm font-bold focus:border-secondary"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
        <button
          onClick={handlePrint}
          className="bg-white hover:bg-slate-50 border border-border-subtle text-slate-700 py-2 px-3.5 rounded-md font-bold transition flex items-center gap-1.5 text-xs sm:text-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-base">print</span>
          <span>Yazdır</span>
        </button>
        <button
          onClick={handleDownload}
          className="bg-primary hover:bg-[#1C2C40] text-white py-2 px-3.5 rounded-md font-bold transition flex items-center gap-1.5 text-xs sm:text-sm shadow-md shadow-primary/10"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>PDF Olarak İndir</span>
        </button>
      </div>

      {/* Transcript Content */}
      <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-5 sm:p-7">
        {/* Header */}
        <div className="border-b border-border-subtle pb-4 mb-5 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-primary mb-0.5">
            {language === 'tr' ? 'RESMİ TRANSKRİPT' : 'OFFICIAL TRANSCRIPT'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-bold tracking-wider">OFFICIAL TRANSCRIPT</p>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 pb-5 border-b border-border-subtle text-xs sm:text-sm font-semibold">
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-0.5">Adı Soyadı / Name</p>
            <p className="font-bold text-slate-800">{studentInfo.name}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-0.5">Öğrenci Numarası / Student ID</p>
            <p className="font-bold text-slate-800">{studentInfo.id}</p>
          </div>
          <div className="mt-1 sm:mt-0">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-0.5">Program / Department</p>
            <p className="font-bold text-slate-800">{studentInfo.program}</p>
          </div>
          <div className="mt-1 sm:mt-0">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-0.5">Fakülte / Faculty</p>
            <p className="font-bold text-slate-800">{studentInfo.faculty}</p>
          </div>
        </div>

        {/* Courses by Semester */}
        <div className="space-y-5 mb-5">
          {semestersList.map((semester, semIdx) => (
            <div key={semIdx}>
              <h3 className="text-sm sm:text-base font-bold text-primary mb-2.5 pb-1 border-b border-border-subtle">{semester.semester}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle bg-[#F4F6F8]/60 text-primary">
                      <th className="text-left py-2 px-3 font-bold">Ders Kodu</th>
                      <th className="text-left py-2 px-3 font-bold">Ders Adı</th>
                      <th className="text-center py-2 px-3 font-bold">Kredi</th>
                      <th className="text-center py-2 px-3 font-bold">Ortalama</th>
                      <th className="text-center py-2 px-3 font-bold">Harf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course, courseIdx) => (
                      <tr key={courseIdx} className="border-b border-border-subtle font-semibold">
                        <td className="py-2.5 px-3 text-slate-500 font-bold">{course.code}</td>
                        <td className="py-2.5 px-3 text-slate-800 font-bold">{course.name}</td>
                        <td className="text-center py-2.5 px-3 text-slate-600 font-bold">{course.credit}</td>
                        <td className="text-center py-2.5 px-3 text-slate-700 font-bold">{course.average.toFixed(1)}</td>
                        <td className="text-center py-2.5 px-3">
                          <span className="bg-secondary/15 text-primary px-2 py-0.5 rounded text-xs font-bold">
                            {course.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border-subtle text-center">
          <div className="bg-slate-50 border border-border-subtle rounded-md p-3 shadow-sm">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Genel GANO</p>
            <p className="text-lg sm:text-xl font-bold text-primary">{studentInfo.gpa.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 border border-border-subtle rounded-md p-3 shadow-sm">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Toplam Kredi</p>
            <p className="text-lg sm:text-xl font-bold text-slate-800">{studentInfo.totalCredits}</p>
          </div>
          <div className="bg-slate-50 border border-border-subtle rounded-md p-3 shadow-sm">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Akademik Durum</p>
            <p className="text-lg sm:text-xl font-bold text-green-600">Aktif</p>
          </div>
        </div>
      </div>
    </div>
  );
}
