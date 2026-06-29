function Login() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
      
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-8">
          Kullanıcı Girişi
        </h1>

        <div className="space-y-5">
          
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Şifre"
            className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg outline-none focus:border-blue-500"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-xl text-xl font-semibold">
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;