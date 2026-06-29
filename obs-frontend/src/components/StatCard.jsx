export default function StatCard({ icon, label, value, color, trend }) {
  return (
    <div className="bg-white border border-border-subtle rounded-lg p-5 hover:border-secondary/40 hover:shadow-md transition-all duration-300 group shadow-sm">
      <div className="flex items-start justify-between mb-3.5">
        <div
          className="w-11 h-11 rounded-md flex items-center justify-center text-xl shadow-sm"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <div className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md ${trend.type === 'up' ? 'bg-green-50 text-green-700 border border-green-200/30' : 'bg-red-50 text-red-700 border border-red-200/30'}`}>
            {trend.type === 'up' ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-primary group-hover:text-secondary transition-colors leading-tight">
        {value}
      </p>
    </div>
  );
}
