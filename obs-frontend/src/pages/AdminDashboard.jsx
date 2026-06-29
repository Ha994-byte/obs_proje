import { useState } from "react";

function AdminDashboard() {

  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">

      {/* SIDEBAR */}
      <aside className="w-[320px] bg-[#07122b] text-white p-8 flex flex-col">

        <div className="mb-14">
          <h1 className="text-4xl font-black">
            Admin Panel
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Üniversite Yönetim Sistemi
          </p>
        </div>

        <div className="space-y-4">

          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full text-left px-6 py-4 rounded-2xl transition ${
              activePage === "dashboard"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActivePage("students")}
            className={`w-full text-left px-6 py-4 rounded-2xl transition ${
              activePage === "students"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Öğrenci Yönetimi
          </button>

          <button
            onClick={() => setActivePage("academics")}
            className={`w-full text-left px-6 py-4 rounded-2xl transition ${
              activePage === "academics"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Akademisyen Yönetimi
          </button>

          <button
            onClick={() => setActivePage("courses")}
            className={`w-full text-left px-6 py-4 rounded-2xl transition ${
              activePage === "courses"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Ders Yönetimi
          </button>

          <button
            onClick={() => setActivePage("departments")}
            className={`w-full text-left px-6 py-4 rounded-2xl transition ${
              activePage === "departments"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10"
            }`}
          >
            Bölüm Yönetimi
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[35px] p-10 text-white shadow-2xl mb-10 flex items-center justify-between">

          <div>
            <h1 className="text-5xl font-black">
              Admin Yönetim Paneli
            </h1>

            <p className="text-2xl text-blue-100 mt-4">
              Üniversite otomasyon sistemi yönetimi
            </p>
          </div>

          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
            A
          </div>

        </div>

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <div>

            <h1 className="text-5xl font-bold text-slate-900 mb-10">
              Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-8">

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <p className="text-slate-500 text-xl">
                  Toplam Öğrenci
                </p>

                <h1 className="text-6xl font-black mt-4">
                  12.540
                </h1>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <p className="text-slate-500 text-xl">
                  Akademisyen
                </p>

                <h1 className="text-6xl font-black mt-4">
                  420
                </h1>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <p className="text-slate-500 text-xl">
                  Bölüm
                </p>

                <h1 className="text-6xl font-black mt-4">
                  18
                </h1>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <p className="text-slate-500 text-xl">
                  Aktif Ders
                </p>

                <h1 className="text-6xl font-black mt-4">
                  248
                </h1>
              </div>

            </div>

          </div>
        )}

        {/* ÖĞRENCİ YÖNETİMİ */}
        {activePage === "students" && (
          <div>

            <h1 className="text-5xl font-bold text-slate-900 mb-3">
              Öğrenci Yönetimi
            </h1>

            <p className="text-slate-500 text-xl mb-10">
              Sistemde kayıtlı öğrenciler
            </p>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

              <table className="w-full">

                <thead className="bg-slate-100">
                  <tr>

                    <th className="text-left py-6 px-8 text-xl">
                      Öğrenci No
                    </th>

                    <th className="text-left py-6 px-8 text-xl">
                      Ad Soyad
                    </th>

                    <th className="text-left py-6 px-8 text-xl">
                      Bölüm
                    </th>

                    <th className="text-left py-6 px-8 text-xl">
                      İşlem
                    </th>

                  </tr>
                </thead>

                <tbody>

                  <tr className="border-b">

                    <td className="py-6 px-8">
                      202312345
                    </td>

                    <td className="py-6 px-8 font-semibold">
                      Havva Kelekli
                    </td>

                    <td className="py-6 px-8">
                      Yazılım Mühendisliği
                    </td>

                    <td className="py-6 px-8">

                      <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl">
                        Sil
                      </button>

                    </td>

                  </tr>

                  <tr>

                    <td className="py-6 px-8">
                      202312346
                    </td>

                    <td className="py-6 px-8 font-semibold">
                      Ahmet Yılmaz
                    </td>

                    <td className="py-6 px-8">
                      Bilgisayar Mühendisliği
                    </td>

                    <td className="py-6 px-8">

                      <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl">
                        Sil
                      </button>

                    </td>

                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* AKADEMİSYEN YÖNETİMİ */}
{activePage === "academics" && (
  <div>

    <h1 className="text-5xl font-bold text-slate-900 mb-3">
      Akademisyen Yönetimi
    </h1>

    <p className="text-slate-500 text-xl mb-10">
      Sistemde kayıtlı akademisyenler
    </p>

    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>

            <th className="text-left py-6 px-8 text-xl">
              Akademisyen
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Bölüm
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Ünvan
            </th>

            <th className="text-left py-6 px-8 text-xl">
              İşlem
            </th>

          </tr>
        </thead>

        <tbody>

          <tr className="border-b">

            <td className="py-6 px-8 font-semibold">
              Dr. Mehmet Yılmaz
            </td>

            <td className="py-6 px-8">
              Yazılım Mühendisliği
            </td>

            <td className="py-6 px-8">
              Doç. Dr.
            </td>

            <td className="py-6 px-8">

              <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl">
                Sil
              </button>

            </td>

          </tr>

          <tr>

            <td className="py-6 px-8 font-semibold">
              Dr. Ayşe Demir
            </td>

            <td className="py-6 px-8">
              Bilgisayar Mühendisliği
            </td>

            <td className="py-6 px-8">
              Prof. Dr.
            </td>

            <td className="py-6 px-8">

              <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl">
                Sil
              </button>

            </td>

          </tr>

        </tbody>
      </table>
    </div>
  </div>
)}

{/* DERS YÖNETİMİ */}
{activePage === "courses" && (
  <div>

    <h1 className="text-5xl font-bold text-slate-900 mb-3">
      Ders Yönetimi
    </h1>

    <p className="text-slate-500 text-xl mb-10">
      Sistemde bulunan dersler
    </p>

    <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

      <h2 className="text-3xl font-bold mb-6">
        Yeni Ders Oluştur
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Ders Adı"
          className="border border-slate-300 rounded-2xl px-5 py-4 text-xl outline-none"
        />

        <input
          type="text"
          placeholder="Ders Kodu"
          className="border border-slate-300 rounded-2xl px-5 py-4 text-xl outline-none"
        />

        <input
          type="text"
          placeholder="AKTS"
          className="border border-slate-300 rounded-2xl px-5 py-4 text-xl outline-none"
        />

        <input
          type="text"
          placeholder="Bölüm"
          className="border border-slate-300 rounded-2xl px-5 py-4 text-xl outline-none"
        />

      </div>

      <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xl font-semibold">
        Ders Oluştur
      </button>

    </div>

    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>

            <th className="text-left py-6 px-8 text-xl">
              Ders
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Kod
            </th>

            <th className="text-left py-6 px-8 text-xl">
              AKTS
            </th>

            <th className="text-left py-6 px-8 text-xl">
              Bölüm
            </th>

          </tr>
        </thead>

        <tbody>

          <tr className="border-b">

            <td className="py-6 px-8 font-semibold">
              Web Programlama
            </td>

            <td className="py-6 px-8">
              BLM305
            </td>

            <td className="py-6 px-8">
              5
            </td>

            <td className="py-6 px-8">
              Yazılım Mühendisliği
            </td>

          </tr>

          <tr>

            <td className="py-6 px-8 font-semibold">
              Veritabanı Yönetimi
            </td>

            <td className="py-6 px-8">
              BLM301
            </td>

            <td className="py-6 px-8">
              6
            </td>

            <td className="py-6 px-8">
              Bilgisayar Mühendisliği
            </td>

          </tr>

        </tbody>
      </table>
    </div>

  </div>
)}

{/* BÖLÜM YÖNETİMİ */}
{activePage === "departments" && (
  <div>

    <h1 className="text-5xl font-bold text-slate-900 mb-3">
      Bölüm Yönetimi
    </h1>

    <p className="text-slate-500 text-xl mb-10">
      Üniversite bölümleri ve kontenjan bilgileri
    </p>

    <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

      <h2 className="text-3xl font-bold mb-6">
        Yeni Bölüm Oluştur
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Bölüm Adı"
          className="border border-slate-300 rounded-2xl px-5 py-4 text-xl outline-none"
        />

        <input
          type="text"
          placeholder="Kontenjan"
          className="border border-slate-300 rounded-2xl px-5 py-4 text-xl outline-none"
        />

      </div>

      <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xl font-semibold">
        Bölüm Oluştur
      </button>

    </div>

    <div className="grid grid-cols-2 gap-8">

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold">
              Yazılım Mühendisliği
            </h2>

            <p className="text-slate-500 text-xl mt-3">
              Kontenjan: 120
            </p>
          </div>

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-xl font-semibold">
            Aktif
          </span>

        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold">
              Bilgisayar Mühendisliği
            </h2>

            <p className="text-slate-500 text-xl mt-3">
              Kontenjan: 150
            </p>
          </div>

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-xl font-semibold">
            Aktif
          </span>

        </div>

      </div>

    </div>

  </div>
)}

      </main>
    </div>
  );
}

export default AdminDashboard;