import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  stockFilter: 'all' | 'low' | 'critical';
  onFilterChange: (filter: 'all' | 'low' | 'critical') => void;
}

export function SearchBar({ searchTerm, onSearchChange, stockFilter, onFilterChange }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar materiales..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-slate-600" />
        <select
          value={stockFilter}
          onChange={(e) => onFilterChange(e.target.value as 'all' | 'low' | 'critical')}
          className="px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
        >
          <option value="all">Todos los niveles</option>
          <option value="low">Stock bajo (≤4)</option>
          <option value="critical">Stock crítico (≤1)</option>
        </select>
      </div>
    </div>
  );
}