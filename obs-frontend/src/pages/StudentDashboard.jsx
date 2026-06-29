import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  CalendarDays,
  User,
  LogOut,
  Bell,
  TrendingUp,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";

function StudentDashboard() {

  const [activePage, setActivePage] = useState("dashboard");
  const lessons = [
  {
    code: "BLM301",
    course: "Veritabanı Yönetim Sistemleri",
    credit: 6,
    teacher: "Dr. Ahmet Kaya",
    status: "Aktif",
  },

  {
    code: "BLM305",
    course: "Web Programlama",
    credit: 5,
    teacher: "Dr. Mehmet Yılmaz",
    status: "Aktif",
  },

  {
    code: "BLM210",
    course: "Nesne Tabanlı Programlama",
    credit: 4,
    teacher: "Dr. Ayşe Demir",
    status: "Devam Ediyor",
  },

  {
    code: "MAT201",
    course: "Ayrık Matematik",
    credit: 5,
    teacher: "Dr. Hasan Çelik",
    status: "Aktif",
  },

  {
    code: "BLM415",
    course: "Yapay Zeka",
    credit: 6,
    teacher: "Dr. Elif Yıldız",
    status: "Aktif",
  },
];

  const announcements = [
    "2026 Bahar dönemi ders kayıtları başladı.",
    "Vize sınav programı yayınlandı.",
    "Akademik takvim güncellendi.",
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">
      
      {/* SIDEBAR */}
      <aside className="w-[320px] bg-gradient-to-b from-[#0f172a] to-[#111827] text-white flex flex-col justify-between p-6 shadow-2xl">
        
        <div>
          
          {/* LOGO */}
          <div className="mb-14">
            <h1 className="text-4xl font-bold tracking-tight">
              OBS Panel
            </h1>

            <p className="text-slate-400 mt-2 text-lg">
              Öğrenci Bilgi Sistemi
            </p>
          </div>

          {/* MENU */}
          <nav className="space-y-3">
            
            <button className="w-full flex items-center gap-4 bg-blue-600 px-5 py-4 rounded-2xl text-xl font-medium shadow-lg">
              <LayoutDashboard className="w-6 h-6" />
             
            </button>

            <button
  onClick={() => setActivePage("lessons")}
  className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl text-xl transition"
>
  <BookOpen className="w-6 h-6" />
  Derslerim
</button>

            <button
  onClick={() => setActivePage("grades")}
  className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl text-xl transition"
>
  <GraduationCap className="w-6 h-6" />
  Notlarım
</button>

            <button
  onClick={() => setActivePage("transcript")}
  className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl text-xl transition"
>
  <FileText className="w-6 h-6" />
  Transkript
</button>

            <button
  onClick={() => setActivePage("calendar")}
  className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl text-xl transition"
>
  <CalendarDays className="w-6 h-6" />
  ÖğrenciTakvim
</button>

            <button
  onClick={() => setActivePage("profile")}
  className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl text-xl transition"
>
  <User className="w-6 h-6" />
  Profil
</button>
          </nav>
        </div>

        {/* LOGOUT */}
        <button className="w-full flex items-center gap-4 bg-red-500 hover:bg-red-600 transition px-5 py-4 rounded-2xl text-xl font-medium">
          <LogOut className="w-6 h-6" />
          Çıkış Yap
        </button>
      </aside>

      {/* MAIN */}
<main className="flex-1 p-10 overflow-y-auto">

  {/* MAVİ HEADER */}
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[35px] p-10 text-white shadow-2xl mb-10 flex items-center justify-between">

    <button className="bg-white shadow-lg p-5 rounded-2xl hover:scale-105 transition">
      <Bell className="w-8 h-8 text-slate-700" />
    </button>

    <div>
    

      <h1 className="text-5xl font-bold mt-3">
         Havva KELEKLİ
      </h1>

      <p className="mt-6 text-2xl opacity-90">
        Aktif Dönem: 2026 Bahar
      </p>
    </div>

    <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
      H
    </div>
  </div>

  {/* STAT CARDS */}

  {activePage === "dashboard" && (
  <>
  <div className="grid grid-cols-4 gap-8 mb-10">

    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <div className="flex items-center justify-between">
        <TrendingUp className="w-10 h-10 text-blue-600" />
        <span className="text-green-500 font-semibold">
          +0.12
        </span>
      </div>

      <p className="text-slate-500 text-xl mt-6">
        Genel Ortalama
      </p>

      <h1 className="text-6xl font-bold text-slate-900 mt-3">
        3.42
      </h1>
    </div>

    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <Clock3 className="w-10 h-10 text-emerald-600" />

      <p className="text-slate-500 text-xl mt-6">
        Toplam AKTS
      </p>

      <h1 className="text-6xl font-bold text-slate-900 mt-3">
        142
      </h1>
    </div>

    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <BookOpen className="w-10 h-10 text-orange-500" />

      <p className="text-slate-500 text-xl mt-6">
        Alınan Ders
      </p>

      <h1 className="text-6xl font-bold text-slate-900 mt-3">
        38
      </h1>
    </div>

    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <BadgeCheck className="w-10 h-10 text-purple-600" />

      <p className="text-slate-500 text-xl mt-6">
        Başarı Oranı
      </p>

      <h1 className="text-6xl font-bold text-slate-900 mt-3">
        %89
      </h1>
    </div>
  </div>
  </>
)}


  {/* DASHBOARD */}
  {activePage === "dashboard" && (
    <div className="grid grid-cols-3 gap-8">

        

      {/* RIGHT */}
      <div className="space-y-8">

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[35px] p-8 text-white shadow-2xl">

          <h2 className="text-3xl font-bold">
            Yaklaşan Sınav
          </h2>

          

          <p className="text-2xl mt-6 opacity-90">
            Web Programlama Final
          </p>

          <p className="text-xl mt-3 opacity-80">
            14 Haziran 2026 • 13:00
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

  <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl font-bold text-slate-900">
        Son Duyurular
    </h2>

    <button className="text-blue-600 font-semibold hover:underline">
      Tümünü Gör
    </button>
  </div>

  <div className="space-y-5">

    <div className="border-l-4 border-blue-600 bg-slate-50 rounded-2xl p-5">
      <p className="text-slate-500 text-sm">
        12 Mayıs 2026
      </p>

      <h3 className="text-xl font-bold mt-1">
        Vize sınav programı yayınlandı
      </h3>

      <p className="text-slate-600 mt-2">
        Fakülte bazlı sınav saatleri OBS üzerinden görüntülenebilir.
      </p>
    </div>

    <div className="border-l-4 border-emerald-500 bg-slate-50 rounded-2xl p-5">
      <p className="text-slate-500 text-sm">
        8 Mayıs 2026
      </p>

      <h3 className="text-xl font-bold mt-1">
        Ders kayıt haftası başladı
      </h3>

      <p className="text-slate-600 mt-2">
        Danışman onayı gereken öğrenciler işlemlerini tamamlamalıdır.
      </p>
    </div>

  </div>
</div>
      </div>
    </div>
  )}

  {/* DERSLERİM */}
  {activePage === "lessons" && (
    <div>

      <div className="mb-10">
        <h1 className="text-5xl font-bold text-slate-900">
          Derslerim
        </h1>

        <p className="text-slate-500 text-xl mt-3">
          Aktif dönem ders bilgileri
        </p>
      </div>

      <div className="bg-white rounded-[30px] shadow-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="text-left py-6 px-8 text-slate-700 text-xl">
                  Ders Kodu
                </th>

                <th className="text-left py-6 px-8 text-slate-700 text-xl">
                  Ders Adı
                </th>

                <th className="text-left py-6 px-8 text-slate-700 text-xl">
                  AKTS
                </th>

                <th className="text-left py-6 px-8 text-slate-700 text-xl">
                  Akademisyen
                </th>

                <th className="text-left py-6 px-8 text-slate-700 text-xl">
                  Durum
                </th>
              </tr>

            </thead>

            <tbody>

  {lessons.map((lesson, index) => (

    <tr
      key={index}
      className="border-b hover:bg-slate-50 transition"
    >

      <td className="py-6 px-8 text-lg">
        {lesson.code}
      </td>

      <td className="py-6 px-8 text-lg font-semibold">
        {lesson.course}
      </td>

      <td className="py-6 px-8 text-lg">
        {lesson.credit}
      </td>

      <td className="py-6 px-8 text-lg">
        {lesson.teacher}
      </td>

      <td className="py-6 px-8">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
          {lesson.status}
        </span>
      </td>

    </tr>

  ))}

</tbody>
          </table>
        </div>
      </div>
    </div>
  )}

  {/* NOTLARIM */}
{activePage === "grades" && (
  <div>

    <div className="mb-10">
      <h1 className="text-5xl font-bold text-slate-900">
        Notlarım
      </h1>

      <p className="text-slate-500 text-xl mt-3">
        Sınav sonuçları ve başarı durumu
      </p>
    </div>

    <div className="bg-white rounded-[30px] shadow-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="text-left py-6 px-8 text-xl">
              Ders
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Vize
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Final
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Ortalama
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Durum
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Harf
              </th>
              
          </tr>
        </thead>

        <tbody>

          <tr className="border-b hover:bg-slate-50 transition">
            <td className="py-6 px-8">
              Web Programlama
            </td>

            <td className="py-6 px-8">
              90
            </td>

            <td className="py-6 px-8">
              95
            </td>

            <td className="py-6 px-8 font-bold text-blue-600">
              93
            </td>

            <td className="py-6 px-8 text-green-600 font-semibold">
              Başarılı
            </td>

            <td className="py-6 px-8 font-bold">
  AA
</td> 
          </tr>

          <tr>
            <td className="py-6 px-8">
              Veritabanı
            </td>

            <td className="py-6 px-8">
              75
            </td>

            <td className="py-6 px-8">
              84
            </td>

            <td className="py-6 px-8 font-bold text-blue-600">
              80
            </td>

            <td className="py-6 px-8 text-green-600 font-semibold">
              Başarılı
            </td>
            <td className="py-6 px-8 font-bold">
  AB
</td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
)}

{/* TRANSKRİPT */}
{activePage === "transcript" && (
  <div>

    <div className="mb-10">
      <h1 className="text-5xl font-bold text-slate-900">
        Transkript
      </h1>

      <p className="text-slate-500 text-xl mt-3">
        Genel akademik durum belgesi
      </p>
    </div>

    <div className="space-y-8">

      {/* 2024 GÜZ */}
      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            2024 Güz Dönemi
          </h2>

          <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-semibold">
            GANO: 3.21
          </span>
        </div>

        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              <th className="text-left py-4 px-6">
                Ders
              </th>

              <th className="text-left py-4 px-6">
                AKTS
              </th>

              <th className="text-left py-4 px-6">
                Harf
              </th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b">
              <td className="py-5 px-6">
                Web Programlama
              </td>

              <td className="py-5 px-6">
                5
              </td>

              <td className="py-5 px-6 font-bold text-green-600">
                AA
              </td>
            </tr>

            <tr>
              <td className="py-5 px-6">
                Veritabanı
              </td>

              <td className="py-5 px-6">
                6
              </td>

              <td className="py-5 px-6 font-bold text-blue-600">
                BA
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* 2025 BAHAR */}
      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            2025 Bahar Dönemi
          </h2>

          <span className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-xl font-semibold">
            GANO: 3.42
          </span>
        </div>

        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              <th className="text-left py-4 px-6">
                Ders
              </th>

              <th className="text-left py-4 px-6">
                AKTS
              </th>

              <th className="text-left py-4 px-6">
                Harf
              </th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b">
              <td className="py-5 px-6">
                Nesne Tabanlı Programlama
              </td>

              <td className="py-5 px-6">
                4
              </td>

              <td className="py-5 px-6 font-bold text-yellow-600">
                BB
              </td>
            </tr>

            <tr>
              <td className="py-5 px-6">
                Ayrık Matematik
              </td>

              <td className="py-5 px-6">
                5
              </td>

              <td className="py-5 px-6 font-bold text-green-600">
                AA
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  </div>
)}

{/* AKADEMİK TAKVİM */}
{activePage === "calendar" && (
  <div>

    <div className="mb-10">
      <h1 className="text-5xl font-bold text-slate-900">
        Öğrenci Takvim
      </h1>

      <p className="text-slate-500 text-xl mt-3">
        Dönem içi önemli tarihler
      </p>
    </div>

    <div className="space-y-6">

      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <p className="text-slate-500 text-lg">
          10 Şubat 2026
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Bahar Dönemi Başlangıcı
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <p className="text-slate-500 text-lg">
          20 Mart 2026
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Vize Sınav Haftası
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <p className="text-slate-500 text-lg">
          14 Haziran 2026
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Final Sınavları Başlangıcı
        </h2>
      </div>

    </div>
  </div>
)}


{/* PROFİL */}
{activePage === "profile" && (
  <div>

    <div className="mb-10">
      <h1 className="text-5xl font-bold text-slate-900">
        Profil
      </h1>

      <p className="text-slate-500 text-xl mt-3">
        Öğrenci bilgileri ve hesap ayarları
      </p>
    </div>

    <div className="bg-white rounded-[35px] shadow-2xl p-10">

      <div className="flex items-center gap-8 border-b pb-10">

        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
          H
        </div>

        <div>
          <h2 className="text-4xl font-bold text-slate-900">
            Havva Kelekli
          </h2>

          <p className="text-slate-500 text-xl mt-2">
            Yazılım Mühendisliği - 3. Sınıf
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-8 mt-10">

        <div className="bg-slate-50 rounded-2xl p-6">
          <p className="text-slate-500 text-lg">
            Öğrenci Numarası
          </p>

          <h3 className="text-2xl font-bold mt-2">
            202312345
          </h3>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6">
          <p className="text-slate-500 text-lg">
            Bölüm
          </p>

          <h3 className="text-2xl font-bold mt-2">
            Yazılım Mühendisliği
          </h3>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6">
          <p className="text-slate-500 text-lg">
            Üniversite Maili
          </p>

          <h3 className="text-2xl font-bold mt-2">
            havva@esenyurt.edu.tr
          </h3>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6">
          <p className="text-slate-500 text-lg">
            Telefon
          </p>

          <h3 className="text-2xl font-bold mt-2">
            +90 555 555 55 55
          </h3>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6">
          <p className="text-slate-500 text-lg">
            Danışman
          </p>

          <h3 className="text-2xl font-bold mt-2">
            Dr. Ahmet Kaya
          </h3>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6">
          <p className="text-slate-500 text-lg">
            Aktif Dönem
          </p>

          <h3 className="text-2xl font-bold mt-2">
            2026 Bahar
          </h3>
        </div>

      </div>

      <div className="mt-10 flex gap-5">

        <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-4 rounded-2xl text-xl font-semibold">
          Bilgileri Güncelle
        </button>

        <button className="bg-slate-200 hover:bg-slate-300 transition text-slate-800 px-8 py-4 rounded-2xl text-xl font-semibold">
          Şifre Değiştir
        </button>

      </div>

    </div>
  </div>
)}


</main>
    </div>
  );
}

export default StudentDashboard;