import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white rounded-[30px] shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#3572b0] text-white text-center py-6 text-3xl font-bold">
          İdari Girişi
        </div>

        {/* FORM */}
        <div className="p-10 flex flex-col gap-6">

          <input
            type="text"
            placeholder="Kullanıcı Adı"
            className="w-full border border-slate-300 rounded-xl px-5 py-4 text-xl outline-none"
          />

          <input
            type="password"
            placeholder="Şifre"
            className="w-full border border-slate-300 rounded-xl px-5 py-4 text-xl outline-none"
          />

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-xl text-2xl font-bold"
          >
            Giriş Yap
          </button>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;