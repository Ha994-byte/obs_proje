export default function AnnouncementCard({ title, content, date, priority, category }) {
  const getPriorityIcon = (priority) => {
    if (priority === 'high') return '⚠️';
    if (priority === 'medium') return '⚡';
    return 'ℹ️';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return { bg: 'bg-red-50/60', border: 'border-red-100', text: 'text-red-700' };
    if (priority === 'medium') return { bg: 'bg-yellow-50/60', border: 'border-yellow-100', text: 'text-yellow-800' };
    return { bg: 'bg-green-50/60', border: 'border-green-100', text: 'text-green-700' };
  };

  const colors = getPriorityColor(priority);

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-md p-4 hover:shadow-sm hover:border-secondary/40 transition-all duration-300 cursor-pointer group`}>
      <div className="flex items-start gap-3">
        <div className="text-lg flex-shrink-0 mt-0.5">{getPriorityIcon(priority)}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-secondary transition-colors truncate mb-1">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-2 font-medium">
            {content}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            {category && (
              <span className="text-[10px] sm:text-xs bg-secondary/15 text-primary px-2 py-0.5 rounded font-bold">
                {category}
              </span>
            )}
            <span className={`text-[10px] sm:text-xs font-bold ${colors.text}`}>
              {date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
