import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { cn } from '../../utils/helpers';

export const DataTable = ({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys = [], // if empty, searches all string values in row
  filterComponent,
  pageSizeOptions = [10, 20, 50],
  initialPageSize = 10,
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records matching your criteria.',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lower = searchTerm.toLowerCase();

    return data.filter((row) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = row[k];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(lower);
        });
      }
      return Object.values(row).some((val) => {
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some((v) =>
            v !== undefined && v !== null && String(v).toLowerCase().includes(lower)
          );
        }
        return val !== undefined && val !== null && String(val).toLowerCase().includes(lower);
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return strA.localeCompare(strB);
      }
      return strB.localeCompare(strA);
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, validPage, pageSize]);

  const handleSort = (key, sortable = true) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return { key: null, direction: 'asc' }; // reset
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden', className)}>
      {/* Table Toolbar */}
      {(searchable || filterComponent) && (
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/40">
          {searchable ? (
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
              />
            </div>
          ) : <div />}

          {filterComponent && <div className="flex items-center gap-2">{filterComponent}</div>}
        </div>
      )}

      {/* Table body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={col.width ? { width: col.width } : {}}
                  onClick={() => handleSort(col.key, col.sortable !== false)}
                  className={cn(
                    'px-4 py-3 select-none',
                    col.sortable !== false && 'cursor-pointer hover:bg-slate-100/70 transition-colors',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                >
                  <div className={cn('inline-flex items-center gap-1.5', col.align === 'right' && 'justify-end')}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'transition-colors duration-100 hover:bg-slate-50/80',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={cn(
                        'px-4 py-3.5 align-middle',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center'
                      )}
                    >
                      {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalItems > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-slate-700">{totalItems === 0 ? 0 : (validPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-slate-700">{Math.min(validPage * pageSize, totalItems)}</span> of{' '}
              <span className="font-semibold text-slate-700">{totalItems}</span> records
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              Page {validPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

