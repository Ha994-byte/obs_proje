import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';

export default function Notlar({ onPageChange }) {
  const [semester, setSemester] = useState('all');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [gradesList, setGradesList] = useState([
    { courseId: '1', code: 'BGM301', courseName: 'Veritabanı Yönetim Sistemleri', instructor: 'Prof. Dr. Yılmaz Ö.', semester: 'Güz 2023', vize: 85, finalNotu: 80, classAverage: 68.5 },
    { courseId: '2', code: 'BGM303', courseName: 'İşletim Sistemleri', instructor: 'Doç. Dr. Ayşe K.', semester: 'Güz 2023', vize: 78, finalNotu: 90, classAverage: 72.0 },
    { courseId: '3', code: 'MAT201', courseName: 'Diferansiyel Denklemler', instructor: 'Dr. Öğr. Üyesi Ali S.', semester: 'Güz 2023', vize: 95, finalNotu: 90, classAverage: 61.2 },
    { courseId: '4', code: 'CS201', courseName: 'Algoritma Analizi', instructor: 'Prof. Dr. Murat A.', semester: 'Bahar 2024', vize: 60, finalNotu: 75, classAverage: 58.4 },
    { courseId: '5', code: 'CS202', courseName: 'Veri Yapıları', instructor: 'Prof. Dr. Ahmet Y.', semester: 'Bahar 2024', vize: 70, finalNotu: 55, classAverage: 65.0 }
  ]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Helper functions for grade calculations based on backend Controller rules
  const calculateOrtalama = (vize, finalNotu) => {
    return (vize * 0.4) + (finalNotu * 0.6);
  };

  const getHarfNotu = (ortalama) => {
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

  const getHarfPuan = (harf) => {
    const mapping = {
      'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
      'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
    };
    return mapping[harf] || 0.0;
  };

  useEffect(() => {
    if (!user || !user.extraId) return;

    const fetchGrades = async () => {
      try {
        const data = await api.get(`/not/ogrenci/${user.extraId}`);
        if (Array.isArray(data) && data.length > 0) {
          const resolved = [];
          for (const g of data) {
            let classAvg = 70.0;
            try {
              const avg = await api.get(`/not/ders-ortalamasi/${g.dersId}`);
              if (avg !== null && typeof avg === 'number') {
                classAvg = avg;
              }
            } catch (e) {
              console.warn("Could not load class average for course:", g.dersId);
            }

            resolved.push({
              courseId: g.dersId,
              code: 'DERS-101', // fallback since code is not directly returned by NotDto
              courseName: g.dersAdi || 'Ders',
              instructor: 'Öğretim Görevlisi',
              semester: 'Güz 2023',
              vize: g.vize,
              finalNotu: g.finalNotu,
              classAverage: classAvg
            });
          }
          setGradesList(resolved);
        }
      } catch (err) {
        console.warn("Could not load grades from backend, using mock fallback:", err);
      }
    };

    fetchGrades();
  }, [user?.extraId]);

  // Calculate details for each grade item
  const gradesWithCalculations = gradesList.map(g => {
    const ort = calculateOrtalama(g.vize, g.finalNotu);
    const harf = getHarfNotu(ort);
    return {
      ...g,
      ortalama: ort,
      grade: harf,
      puan: getHarfPuan(harf)
    };
  });

  const filteredGrades = semester === 'all' 
    ? gradesWithCalculations 
    : gradesWithCalculations.filter(g => g.semester.includes(semester === 'fall' ? 'Güz' : 'Bahar'));

  const totalPoints = filteredGrades.reduce((sum, g) => sum + g.puan, 0);
  const gpa = filteredGrades.length > 0 ? (totalPoints / filteredGrades.length).toFixed(2) : '0.00';

  const highestGrade = filteredGrades.length > 0 
    ? filteredGrades.reduce((max, g) => g.puan > max.puan ? g : max, filteredGrades[0]) 
    : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden animate-fadeIn">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">Not Kartım</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold">Tüm akademik dönemlerin vize ve final notları. Ayrıntılar için derse tıklayın.</p>
      </div>

      {/* GPA Card & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary rounded-lg p-5 text-white shadow-lg shadow-primary/10">
          <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Kümülatif Ortalama (GANO)</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">{gpa}</p>
          <p className="text-xs sm:text-sm font-semibold text-white/90 mt-2">Dönem Not Ortalaması</p>
        </div>
        <div className="bg-white border border-border-subtle rounded-lg p-5 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Toplam Alınan Ders</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">{filteredGrades.length}</p>
        </div>
        <div className="bg-white border border-border-subtle rounded-lg p-5 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">En Yüksek Not</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">
            {highestGrade ? `${highestGrade.grade} (${highestGrade.puan.toFixed(2)})` : 'AA (4.00)'}
          </p>
        </div>
      </div>

      {/* Filter & Action Buttons */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tüm Dönemler' },
            { value: 'fall', label: 'Güz Dönemi' },
            { value: 'spring', label: 'Bahar Dönemi' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => {
                setSemester(filter.value);
                setSelectedCourseId(null);
              }}
              className={`px-3.5 py-2 rounded-md font-bold text-xs sm:text-sm transition border ${
                semester === filter.value
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-border-subtle'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onPageChange('transkript')}
          className="bg-white hover:bg-slate-50 border border-border-subtle text-slate-700 font-bold px-3.5 py-2 rounded-md text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm"
        >
          <span className="material-symbols-outlined text-base">file_download</span>
          <span>Resmi Transkript</span>
        </button>
      </div>

      {/* Main Section */}
      <div className="flex flex-col gap-6">
        {/* Ders Performans Analizi */}
        <div className="bg-white border border-border-subtle shadow-sm rounded-lg p-6 w-full">
          <h3 className="text-sm font-extrabold text-primary mb-4 border-b border-border-subtle pb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-slate-400 text-base">analytics</span>
            Ders Performans Analizi
          </h3>
          {selectedCourseId ? (
            (() => {
              const selectedCourse = gradesWithCalculations.find(g => g.courseId === selectedCourseId);
              const diff = selectedCourse.ortalama - selectedCourse.classAverage;
              return (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 mb-0.5">{selectedCourse.courseName}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{selectedCourse.instructor}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 border border-border-subtle rounded-md p-3">
                      <p className="text-[10px] text-slate-400 font-bold">Kişisel Ort.</p>
                      <p className="text-base font-extrabold text-primary">{selectedCourse.ortalama.toFixed(1)}</p>
                    </div>
                    <div className="bg-slate-50 border border-border-subtle rounded-md p-3">
                      <p className="text-[10px] text-slate-400 font-bold">Sınıf Ort.</p>
                      <p className="text-base font-extrabold text-slate-700">{selectedCourse.classAverage.toFixed(1)}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400 font-bold mb-1">Karşılaştırma</p>
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-base ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {diff >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      <p className="text-xs font-semibold text-slate-700">
                        Sınıf ortalamasından <span className={diff >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{Math.abs(diff).toFixed(1)} GANO</span> {diff >= 0 ? 'yukarıdasınız' : 'aşağıdasınız'}.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-subtle space-y-1.5 text-[11px] text-slate-550 font-semibold">
                    <p className="flex justify-between"><span>Vize Katkısı (%40)</span> <span className="font-bold text-slate-700">{(selectedCourse.vize * 0.4).toFixed(1)}</span></p>
                    <p className="flex justify-between"><span>Final Katkısı (%60)</span> <span className="font-bold text-slate-700">{(selectedCourse.finalNotu * 0.6).toFixed(1)}</span></p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">ads_click</span>
              <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">Detaylı sınıf ortalama karşılaştırması için aşağıdaki derslerden birini seçin.</p>
            </div>
          )}
        </div>

        {/* Grades Table */}
        <div className="bg-white border border-border-subtle shadow-sm rounded-lg overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-[#F4F6F8]/60 text-primary">
                  <th className="text-left py-3 px-5 font-bold whitespace-nowrap">Ders Adı</th>
                  <th className="text-center py-3 px-4 font-bold">Vize</th>
                  <th className="text-center py-3 px-4 font-bold">Final</th>
                  <th className="text-center py-3 px-4 font-bold">Ort.</th>
                  <th className="text-center py-3 px-4 font-bold">Harf</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((course) => {
                  const isSelected = selectedCourseId === course.courseId;
                  return (
                    <tr 
                      key={course.courseId} 
                      onClick={() => setSelectedCourseId(isSelected ? null : course.courseId)}
                      className={`border-b border-border-subtle hover:bg-slate-50/70 transition cursor-pointer ${
                        isSelected ? 'bg-secondary/5 border-l-4 border-l-secondary' : ''
                      }`}
                    >
                      <td className="py-3.5 px-5">
                        <div>
                          <p className="font-bold text-slate-800 text-xs sm:text-sm">{course.courseName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold tracking-wider">{course.code} • {course.semester}</p>
                        </div>
                      </td>
                      <td className="text-center py-3.5 px-4 text-slate-800 font-semibold text-xs sm:text-sm">{course.vize}</td>
                      <td className="text-center py-3.5 px-4 text-slate-800 font-semibold text-xs sm:text-sm">{course.finalNotu}</td>
                      <td className="text-center py-3.5 px-4">
                        <span className="font-bold text-primary text-xs sm:text-sm">{course.ortalama.toFixed(1)}</span>
                      </td>
                      <td className="text-center py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] sm:text-xs ${
                          course.grade.includes('A') ? 'bg-green-50 text-green-700' :
                          course.grade.includes('B') ? 'bg-secondary/15 text-primary' :
                          course.grade.includes('C') ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
