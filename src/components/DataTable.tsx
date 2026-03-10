import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MoreVertical
} from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'default' | 'danger';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  onFilterChange?: (value: string) => void;
  selectable?: boolean;
  onSelect?: (selected: T[]) => void;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  searchable = true,
  searchPlaceholder = 'Search...',
  filterable = false,
  filterOptions = [],
  onFilterChange,
  selectable = false,
  onSelect,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [filterValue, setFilterValue] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(term)
        )
      );
    }

    if (filterValue) {
      result = result.filter(row => 
        String(row[columns[0]?.key || '']) === filterValue
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, sortKey, sortDirection, filterValue, columns]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = pagination 
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelect?.([]);
    } else {
      const allIndices = new Set(paginatedData.map((_, i) => i));
      setSelectedRows(allIndices);
      onSelect?.(paginatedData);
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    onSelect?.(paginatedData.filter((_, i) => newSelected.has(i)));
  };

  const SkeletonRow = () => (
    <tr>
      {selectable && <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse" /></td>}
      {columns.map(col => (
        <td key={col.key} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }} />
        </td>
      ))}
      {actions && <td className="px-6 py-4"><div className="w-20 h-8 bg-gray-200 rounded animate-pulse" /></td>}
    </tr>
  );

  return (
    <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#1a1a1a]/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/20"
              />
            </div>
          )}
          {filterable && filterOptions.length > 0 && (
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
              <select
                value={filterValue}
                onChange={(e) => { setFilterValue(e.target.value); setCurrentPage(1); onFilterChange?.(e.target.value); }}
                className="pl-9 pr-8 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm focus:outline-none"
              >
                <option value="">All</option>
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
              {selectable && (
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#1a1a1a] focus:ring-[#1a1a1a]/20"
                  />
                </th>
              )}
              {columns.map(col => (
                <th 
                  key={col.key} 
                  className={`px-6 py-4 ${col.sortable ? 'cursor-pointer hover:text-[#1a1a1a]/60' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 w-20">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/5">
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-6 py-12 text-center text-[#1a1a1a]/40">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr 
                  key={index} 
                  className={`hover:bg-[#f8f9fa] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => handleSelectRow(index)}
                        className="w-4 h-4 rounded border-gray-300 text-[#1a1a1a] focus:ring-[#1a1a1a]/20"
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 text-sm">
                      {col.render ? col.render(row, index) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {actions.slice(0, 2).map((action, i) => (
                          <button
                            key={i}
                            onClick={() => action.onClick(row)}
                            className={`p-2 rounded-lg transition-colors ${
                              action.variant === 'danger' 
                                ? 'text-red-500 hover:bg-red-50' 
                                : 'text-[#1a1a1a]/60 hover:bg-[#f8f9fa]'
                            }`}
                            title={action.label}
                          >
                            {action.icon || (action.variant === 'danger' ? <Trash2 size={16} /> : <Edit2 size={16} />)}
                          </button>
                        ))}
                        {actions.length > 2 && (
                          <div className="relative">
                            <button
                              onClick={() => setActionMenuOpen(actionMenuOpen === index ? null : index)}
                              className="p-2 text-[#1a1a1a]/60 hover:bg-[#f8f9fa] rounded-lg"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {actionMenuOpen === index && (
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-[#1a1a1a]/10 py-1 z-10">
                                {actions.map((action, i) => (
                                  <button
                                    key={i}
                                    onClick={() => { action.onClick(row); setActionMenuOpen(null); }}
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                                      action.variant === 'danger' ? 'text-red-500' : 'text-[#1a1a1a]'
                                    } hover:bg-[#f8f9fa]`}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <div className="text-sm text-[#1a1a1a]/40">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-[#1a1a1a] text-white' 
                        : 'hover:bg-[#f8f9fa]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
