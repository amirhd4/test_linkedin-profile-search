import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface Props {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const SearchBar: React.FC<Props> = ({ query, setQuery, onSearch, onReset }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder="Search by name, skill, job title, company or keyword (e.g., Python, Lead Engineer, King County)..."
          className="w-full pl-12 pr-28 py-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xl backdrop-blur-md"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {query && (
            <button
              onClick={onReset}
              className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
