export default function GradesTable({ grades, onPageChange }) {
  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'text-green-600';
    if (grade.includes('B')) return 'text-primary';
    if (grade.includes('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-border-subtle shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4.5 bg-[#F4F6F8]/60 border-b border-border-subtle">
        <h3 className="text-base sm:text-lg font-bold text-primary">Son Notlar</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-primary text-white">
              <th className="text-left py-3 px-5 sm:px-6 font-bold whitespace-nowrap">
                Ders Adı
              </th>
              <th className="text-center py-3 px-5 sm:px-6 font-bold whitespace-nowrap hidden sm:table-cell">
                Öğretmen
              </th>
              <th className="text-center py-3 px-5 sm:px-6 font-bold whitespace-nowrap">
                Not
              </th>
              <th className="text-center py-3 px-5 sm:px-6 font-bold whitespace-nowrap">
                Harf
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, idx) => (
              <tr
                key={idx}
                className="border-b border-border-subtle hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-5 sm:px-6">
                  <div>
                    <p className="font-bold text-slate-800 text-sm sm:text-base truncate">{grade.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{grade.semester}</p>
                  </div>
                </td>
                <td className="text-center py-4 px-5 sm:px-6 text-slate-600 hidden sm:table-cell truncate font-medium text-xs sm:text-sm">
                  {grade.instructor}
                </td>
                <td className="text-center py-4 px-5 sm:px-6 font-bold text-slate-800 text-sm sm:text-base">
                  {grade.average.toFixed(2)}
                </td>
                <td className="text-center py-4 px-5 sm:px-6">
                  <span className={`font-bold text-sm sm:text-base ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 bg-slate-50/60 border-t border-border-subtle flex justify-end">
        <button 
          onClick={() => onPageChange && onPageChange('notlar')}
          className="text-xs sm:text-sm text-tertiary hover:text-primary transition-colors font-bold flex items-center gap-1.5"
        >
          <span>Tüm Notları Gör</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
