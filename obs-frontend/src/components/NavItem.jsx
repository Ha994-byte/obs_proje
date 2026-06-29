export default function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-left text-xs sm:text-sm ${
        active 
          ? 'bg-[#5b7cd7] text-white font-medium' 
          : 'text-slate-600 hover:bg-slate-100 font-normal'
      }`}
    >
      <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0">{icon}</span>
      <span className="font-medium hidden sm:inline">{label}</span>
      <span className="font-medium sm:hidden">{label.charAt(0)}</span>
    </button>
  );
}
