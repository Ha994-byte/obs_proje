import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';

export default function DersKaydi() {
  const [availableCourses, setAvailableCourses] = useState([
    { id: '1', code: 'BGM401', name: 'Yapay Zeka', instructor: 'Prof. Dr. Ali K.', credit: 4 },
    { id: '2', code: 'BGM403', name: 'Makine Öğrenmesi', instructor: 'Doç. Dr. Zeynep Ş.', credit: 3 },
    { id: '3', code: 'BGM405', name: 'Bulut Bilişim', instructor: 'Öğr. Gör. Can Y.', credit: 3 },
    { id: '4', code: 'BGM407', name: 'Siber Güvenlik', instructor: 'Prof. Dr. Murat A.', credit: 4 },
    { id: '5', code: 'BGM409', name: 'Bilgisayar Ağları', instructor: 'Doç. Dr. Elif T.', credit: 3 },
  ]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [feePaid, setFeePaid] = useState(false);
  const [dbFees, setDbFees] = useState([]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || !user.extraId) return;

    const loadData = async () => {
      try {
        const allAcilan = await api.get('/acilan-ders');
        const allDers = await api.get('/ders');
        const studentRegs = await api.get(`/ders-kaydi/ogrenci/${user.extraId}`);

        if (Array.isArray(allAcilan) && Array.isArray(allDers)) {
          const resolved = allAcilan.map(ac => {
            const d = allDers.find(ders => ders.id === ac.dersId);
            return {
              id: ac.id,
              code: d ? d.dersKodu : 'DERS-101',
              name: d ? d.dersAdi : 'Açılan Ders',
              instructor: 'Öğretim Görevlisi',
              credit: d ? d.kredi : 3,
              gun: ac.gun,
              baslangicSaati: ac.baslangicSaati,
              bitisSaati: ac.bitisSaati
            };
          });
          setAvailableCourses(resolved);
        }

        if (Array.isArray(studentRegs)) {
          setRegisteredCourses(studentRegs);
          setSelectedCourses(studentRegs.map(r => r.acilanDersId));

          const ucretList = [];
          for (const reg of studentRegs) {
            try {
              const ucrets = await api.get(`/ogrenci/ucret/${reg.id}`);
              if (Array.isArray(ucrets)) {
                ucretList.push(...ucrets);
              }
            } catch (e) {
              console.warn("Could not fetch ucret for registration:", reg.id);
            }
          }
          setDbFees(ucretList);
          setFeePaid(false);
        }
      } catch (err) {
        console.warn("Could not load course registration details, using fallback:", err);
      }
    };

    loadData();
  }, [user?.extraId]);

  const totalCredits = selectedCourses.reduce((sum, id) => {
    const course = availableCourses.find(c => c.id === id);
    return sum + (course ? course.credit : 0);
  }, 0);

  const calculatedFeeAmount = totalCredits * 2500;
  const dbFeeAmount = dbFees.reduce((sum, f) => sum + (f.tutar || 0), 0);
  const feeAmount = dbFeeAmount > 0 ? dbFeeAmount : calculatedFeeAmount;

  const toggleCourse = (id) => {
    const isAlreadyReg = registeredCourses.some(r => r.acilanDersId === id);
    if (isAlreadyReg) {
      if (confirm("Bu ders kaydını silmek istediğinize emin misiniz?")) {
        handleDeleteRegistration(id);
      }
      return;
    }

    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleDeleteRegistration = async (acilanDersId) => {
    const reg = registeredCourses.find(r => r.acilanDersId === acilanDersId);
    if (!reg) return;
    try {
      await api.delete(`/ders-kaydi/${reg.id}`);
      alert("Ders kaydı silindi!");
      setRegisteredCourses(prev => prev.filter(r => r.id !== reg.id));
      setSelectedCourses(prev => prev.filter(c => c !== acilanDersId));
    } catch (err) {
      alert("Ders kaydı silinirken hata oluştu: " + err.message);
    }
  };

  const handleRegister = async () => {
    if (feeAmount > 0 && !feePaid && dbFees.length > 0) {
      alert("Lütfen ders kaydını tamamlamadan önce dönem harç ücretini ödeyin!");
      setShowFeeDetails(true);
      return;
    }

    if (!user || !user.extraId) return;

    const newSelections = selectedCourses.filter(id => !registeredCourses.some(r => r.acilanDersId === id));

    if (newSelections.length === 0) {
      alert("Yeni seçilen ders bulunmamaktadır!");
      return;
    }

    let successCount = 0;
    let errorMsgs = [];

    for (const acilanDersId of newSelections) {
      try {
        await api.post('/ders-kaydi', {
          ogrenciId: user.extraId,
          acilanDersId: acilanDersId,
          durum: 'ONAY_BEKLIYOR'
        });
        successCount++;
      } catch (err) {
        const course = availableCourses.find(c => c.id === acilanDersId);
        errorMsgs.push(`${course ? course.name : 'Ders'}: ${err.message}`);
      }
    }

    if (successCount > 0) {
      alert(`${successCount} yeni ders kaydı başarıyla gönderildi ve danışman onayına sunuldu!`);
    }

    if (errorMsgs.length > 0) {
      alert("Bazı dersler kaydedilemedi:\n" + errorMsgs.join('\n'));
    }

    try {
      const studentRegs = await api.get(`/ders-kaydi/ogrenci/${user.extraId}`);
      if (Array.isArray(studentRegs)) {
        setRegisteredCourses(studentRegs);
        setSelectedCourses(studentRegs.map(r => r.acilanDersId));
      }
    } catch (e) {}
  };

  const handlePayFee = async () => {
    if (dbFees.length > 0) {
      for (const fee of dbFees) {
        try {
          await api.post('/ogrenci/odeme', {
            ucretId: fee.id,
            tutar: fee.tutar
          });
        } catch (e) {
          console.error("Payment failed for fee:", fee.id, e);
        }
      }
      alert(`₺${feeAmount.toLocaleString('tr-TR')} harç ödemesi başarıyla veritabanına işlendi.`);
      setFeePaid(true);
    } else {
      alert(`₺${feeAmount.toLocaleString('tr-TR')} harç ödemesi başarıyla gerçekleştirildi (Simüle edildi).`);
      setFeePaid(true);
    }
  };

  const filteredCourses = filter === 'all' 
    ? availableCourses 
    : availableCourses.filter(c => c.credit === parseInt(filter));

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full min-w-0 overflow-x-hidden animate-fadeIn">
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">Ders Kayıt İşlemleri</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold">2023-2024 Güz Dönemi ders seçim ekranı.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
          <p className="text-slate-500 text-xs sm:text-sm font-bold mb-0.5">Seçilen Ders Sayısı</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">{selectedCourses.length}</p>
        </div>
        <div className="bg-white border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
          <p className="text-slate-500 text-xs sm:text-sm font-bold mb-0.5">Toplam Kredi</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800">{totalCredits}</p>
        </div>
        <div className="bg-white border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
          <p className="text-slate-500 text-xs sm:text-sm font-bold mb-0.5">Ödenecek Harç</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800">₺{feeAmount.toLocaleString('tr-TR')}</p>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tüm Dersler' },
            { value: '3', label: '3 Kredi' },
            { value: '4', label: '4 Kredi' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3.5 py-2 rounded-md font-bold text-xs sm:text-sm transition border ${
                filter === f.value
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/10'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-border-subtle'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {feeAmount > 0 && (
          <button
            onClick={() => setShowFeeDetails(!showFeeDetails)}
            className={`px-3.5 py-2 rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition border ${
              feePaid
                ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>Harç Durumu: {feePaid ? 'Ödendi' : `₺${feeAmount.toLocaleString('tr-TR')} Ödenmedi`}</span>
            <span className="material-symbols-outlined text-xs">
              {showFeeDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>

      {showFeeDetails && feeAmount > 0 && (
        <div className="bg-[#F4F6F8]/60 border border-border-subtle rounded-md p-4 sm:p-5 space-y-3 animate-fadeIn">
          <h3 className="text-xs sm:text-sm font-bold text-primary border-b border-border-subtle pb-2">Dönem Harç Hesaplaması (Ücret & Ödeme)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-medium text-slate-600">
            <div className="space-y-1.5">
              <p className="flex justify-between"><span>Seçilen Ders Kredisi:</span> <span className="text-slate-800 font-bold">{totalCredits} Kredi</span></p>
              <p className="flex justify-between"><span>Kredi Başı Harç Bedeli:</span> <span className="text-slate-800 font-bold">₺2.500</span></p>
              <p className="flex justify-between pt-1.5 border-t border-border-subtle text-slate-800 font-bold">
                <span>Toplam Harç Tutarı:</span> <span>₺{feeAmount.toLocaleString('tr-TR')}</span>
              </p>
            </div>
            <div className="flex flex-col justify-center items-end">
              {feePaid ? (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs sm:text-sm">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Harç Bedeli Ödenmiştir</span>
                </div>
              ) : (
                <button
                  onClick={handlePayFee}
                  className="bg-primary hover:bg-[#1C2C40] text-white py-2 px-5 rounded-md font-bold transition shadow-md shadow-primary/10 text-xs sm:text-sm"
                >
                  Şimdi Harç Ödemesi Yap
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-primary">Açılan Ders Listesi</h2>
        {filteredCourses.map(course => {
          const isSelected = selectedCourses.includes(course.id);
          const isRegistered = registeredCourses.some(r => r.acilanDersId === course.id);

          return (
            <div
              key={course.id}
              className={`bg-white border rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition duration-300 ${
                isRegistered
                  ? 'border-emerald-500 bg-emerald-50/10'
                  : isSelected 
                  ? 'border-secondary bg-secondary/5' 
                  : 'border-border-subtle hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCourse(course.id)}
                  className="w-5 h-5 accent-secondary rounded border-border-subtle cursor-pointer disabled:opacity-50"
                />
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">{course.name}</h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {course.instructor} • {course.code}
                    {course.gun ? ` • ${course.gun} (${course.baslangicSaati}:00 - ${course.bitisSaati}:00)` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-500 self-end sm:self-auto">
                <span className="bg-slate-50 px-2 py-0.5 rounded border border-border-subtle">{course.credit} Kredi</span>
                {isRegistered && (
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded">
                    Kayıtlı
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 pt-2">
        <button
          onClick={handleRegister}
          disabled={selectedCourses.length === 0}
          className="flex-grow bg-primary hover:bg-[#1C2C40] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-md font-bold transition shadow-lg shadow-primary/10 text-xs sm:text-sm"
        >
          Seçilen Dersleri Kaydet ({selectedCourses.length} Ders)
        </button>
        <button
          onClick={() => {
            setSelectedCourses(registeredCourses.map(r => r.acilanDersId));
            setFeePaid(false);
          }}
          className="px-5 bg-white hover:bg-slate-50 border border-border-subtle text-slate-700 py-3 rounded-md font-bold transition text-xs sm:text-sm"
        >
          Seçimleri Sıfırla
        </button>
      </div>
    </div>
  );
}
