import { useState } from "react";

function AcademicDashboard() {

  const [activePage, setActivePage] = useState("dashboard");

  const students = [
    {
      name: "Havva Kelekli",
      number: "202312345",
      course: "Web Programlama",
      grade: 95,
    },
    {
      name: "Ahmet Yılmaz",
      number: "202312346",
      course: "Veritabanı",
      grade: 88,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f7fb]">

      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#07122b] text-white p-6 flex flex-col">

        <div className="mb-12">
          <h1 className="text-4xl font-bold">
            Akademisyen
          </h1>

          <p className="text-slate-400 mt-2">
            Yönetim Paneli
          </p>
        </div>

        <div className="space-y-3">

          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activePage === "dashboard"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActivePage("students")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activePage === "students"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Öğrenciler
          </button>

          <button
            onClick={() => setActivePage("grades")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activePage === "grades"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Not Yönetimi
          </button>

          <button
  onClick={() => setActivePage("courses")}
  className={`w-full text-left px-5 py-4 rounded-2xl transition ${
    activePage === "courses"
      ? "bg-blue-600 text-white"
      : "hover:bg-white/10"
  }`}
>
  Verdiği Dersler
</button>

          <button
            onClick={() => setActivePage("announcements")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activePage === "announcements"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Duyurular
          </button>

          <button
            onClick={() => setActivePage("profile")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activePage === "profile"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Profil
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[35px] p-10 text-white shadow-2xl mb-10 flex items-center justify-between">

          <div>
            <h1 className="text-5xl font-bold">
              Dr. Mehmet Yılmaz
            </h1>

            <p className="text-2xl mt-3 opacity-90">
              Yazılım Mühendisliği Bölümü
            </p>
          </div>

          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
            M
          </div>

        </div>

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <div>

            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              Akademisyen Paneli
            </h1>

            <p className="text-slate-500 text-xl mb-10">
              Öğrenci not yönetim sistemi
            </p>

            <div className="grid grid-cols-3 gap-8 mb-10">

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <p className="text-slate-500 text-xl">
                  Toplam Öğrenci
                </p>

                <h1 className="text-6xl font-bold mt-4">
                  142
                </h1>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <p className="text-slate-500 text-xl">
                  Verilen Ders
                </p>

                <h1 className="text-6xl font-bold mt-4">
                  6
                </h1>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <p className="text-slate-500 text-xl">
                  Ortalama Başarı
                </p>

                <h1 className="text-6xl font-bold mt-4">
                  %87
                </h1>
              </div>

            </div>

          </div>
        )}

        {/* ÖĞRENCİLER */}
        {activePage === "students" && (
          <div>

            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              Öğrenciler
            </h1>

            <p className="text-slate-500 text-xl mb-10">
              Derse kayıtlı öğrenciler
            </p>

            <div className="bg-white rounded-[30px] shadow-xl p-8">

              <div className="space-y-5">

                {students.map((student, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl p-6 flex items-center justify-between"
                  >

                    <div>
                      <h3 className="text-2xl font-bold">
                        {student.name}
                      </h3>

                      <p className="text-slate-500 mt-2">
                        {student.number}
                      </p>

                      <p className="text-blue-600 mt-2">
                        {student.course}
                      </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-5 py-2 rounded-xl font-semibold">
                      Aktif
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

        {/* VERDİĞİ DERSLER */}
{activePage === "courses" && (
  <div>

    <h1 className="text-5xl font-bold text-slate-900 mb-3">
      Verdiği Dersler
    </h1>

    <p className="text-slate-500 text-xl mb-10">
      Akademisyene ait aktif dersler
    </p>

    <div className="grid grid-cols-2 gap-8">

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold">
          Web Programlama
        </h2>

        <p className="text-slate-500 text-xl mt-3">
          3. Sınıf
        </p>

        <div className="mt-6 flex items-center justify-between">

          <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-semibold">
            42 Öğrenci
          </span>

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-xl font-semibold">
            Aktif
          </span>

        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold">
          Veritabanı Yönetimi
        </h2>

        <p className="text-slate-500 text-xl mt-3">
          2. Sınıf
        </p>

        <div className="mt-6 flex items-center justify-between">

          <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-semibold">
            36 Öğrenci
          </span>

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-xl font-semibold">
            Aktif
          </span>

        </div>
      </div>

    </div>
  </div>
)}

        {/* NOT YÖNETİMİ */}
        {activePage === "grades" && (
          <div>

            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              Not Yönetimi
            </h1>

            <p className="text-slate-500 text-xl mb-10">
              Öğrenci not giriş sistemi
            </p>

            <div className="bg-white rounded-[30px] shadow-xl p-8">

              <div className="space-y-5">

                {students.map((student, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl p-6 flex items-center justify-between"
                  >

                    <div>
                      <h3 className="text-2xl font-bold">
                        {student.name}
                      </h3>

                      <p className="text-slate-500 mt-2">
                        {student.number}
                      </p>

                      <p className="text-blue-600 mt-2">
                        {student.course}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <input
                        type="number"
                        defaultValue={student.grade}
                        className="border border-slate-300 rounded-xl px-4 py-3 w-28 text-xl"
                      />

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
                        Kaydet
                      </button>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

        {/* DUYURULAR */}
        {activePage === "announcements" && (
          <div>

            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              Duyurular
            </h1>

            <p className="text-slate-500 text-xl mb-10">
              Öğrencilere duyuru paylaş
            </p>

            <div className="bg-white rounded-[30px] shadow-xl p-8">

              <textarea
                placeholder="Duyuru metnini yazınız..."
                className="w-full h-48 border border-slate-300 rounded-2xl p-5 text-xl outline-none"
              />


              <div className="mt-10 space-y-6">

  <div className="bg-slate-50 border-l-4 border-blue-600 rounded-2xl p-6">

    <div className="flex items-center justify-between">

      <h2 className="text-2xl font-bold">
        Web Programlama
      </h2>

      <span className="text-slate-500">
        13 Mayıs 2026
      </span>

    </div>

    <p className="text-slate-700 mt-4 text-lg">
      Vize sınavı sınıf dağılımları sisteme yüklenmiştir.
    </p>

  </div>

  <div className="bg-slate-50 border-l-4 border-emerald-500 rounded-2xl p-6">

    <div className="flex items-center justify-between">

      <h2 className="text-2xl font-bold">
        Veritabanı Yönetimi
      </h2>

      <span className="text-slate-500">
        10 Mayıs 2026
      </span>

    </div>

    <p className="text-slate-700 mt-4 text-lg">
      Final proje teslim tarihi güncellenmiştir.
    </p>

  </div>

</div>

              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xl font-semibold">
                Duyuru Yayınla
              </button>

            </div>

          </div>
        )}

        {/* PROFİL */}
        {activePage === "profile" && (
          <div>

            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              Profil
            </h1>

            <p className="text-slate-500 text-xl mb-10">
              Akademisyen bilgileri
            </p>

            <div className="bg-white rounded-[35px] shadow-2xl p-10">

              <div className="flex items-center gap-8">

                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
                  M
                </div>

                <div>
                  <h2 className="text-4xl font-bold">
                    Dr. Mehmet Yılmaz
                  </h2>

                  <p className="text-slate-500 text-xl mt-2">
                    Yazılım Mühendisliği Bölümü
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default AcademicDashboard;