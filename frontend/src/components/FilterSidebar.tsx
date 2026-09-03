import React from 'react';
import { FacetsResponse, FacetCount } from '../types';
import { Filter, Briefcase, Code, Building, MapPin, Check } from 'lucide-react';

interface Props {
  facets?: FacetsResponse;
  selectedJobTitles: string[];
  selectedSkills: string[];
  selectedIndustries: string[];
  selectedLocations: string[];
  onToggleFilter: (type: 'job_title' | 'skill' | 'industry' | 'location', value: string) => void;
  onClearAll: () => void;
}

export const FilterSidebar: React.FC<Props> = ({
  facets,
  selectedJobTitles,
  selectedSkills,
  selectedIndustries,
  selectedLocations,
  onToggleFilter,
  onClearAll,
}) => {
  const totalActive =
    selectedJobTitles.length +
    selectedSkills.length +
    selectedIndustries.length +
    selectedLocations.length;

  const renderFacetGroup = (
    title: string,
    icon: React.ReactNode,
    items: FacetCount[] = [],
    selectedList: string[],
    type: 'job_title' | 'skill' | 'industry' | 'location'
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-slate-300 font-semibold text-sm tracking-wide uppercase">
          {icon}
          <span>{title}</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {items.slice(0, 15).map((item) => {
            const isSelected = selectedList.includes(item.key);
            return (
              <button
                key={item.key}
                onClick={() => onToggleFilter(type, item.key)}
                className={`w-full flex items-center justify-between text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="truncate">{item.key}</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-72 bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-md h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <Filter className="w-5 h-5 text-indigo-400" />
          <span>Filters</span>
          {totalActive > 0 && (
            <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-mono ml-1">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {facets ? (
        <>
          {renderFacetGroup(
            'Job Titles',
            <Briefcase className="w-4 h-4 text-sky-400" />,
            facets.job_titles,
            selectedJobTitles,
            'job_title'
          )}
          {renderFacetGroup(
            'Skills',
            <Code className="w-4 h-4 text-emerald-400" />,
            facets.skills,
            selectedSkills,
            'skill'
          )}
          {renderFacetGroup(
            'Industries',
            <Building className="w-4 h-4 text-purple-400" />,
            facets.industries,
            selectedIndustries,
            'industry'
          )}
          {renderFacetGroup(
            'Locations',
            <MapPin className="w-4 h-4 text-amber-400" />,
            facets.locations,
            selectedLocations,
            'location'
          )}
        </>
      ) : (
        <div className="text-slate-500 text-sm py-4 text-center">Loading filters...</div>
      )}
    </aside>
  );
};
