import React from 'react';
import { ProfileSearchResult } from '../types';
import { Briefcase, Building, MapPin, Eye, Star } from 'lucide-react';

interface Props {
  profile: ProfileSearchResult;
  onSelect: (id: string) => void;
}

export const ProfileCard: React.FC<Props> = ({ profile, onSelect }) => {
  const renderHighlighted = (field: string, fallback?: string) => {
    if (profile.highlights && profile.highlights[field] && profile.highlights[field].length > 0) {
      return <span dangerouslySetInnerHTML={{ __html: profile.highlights[field][0] }} />;
    }
    return fallback || '';
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/90 transition-all duration-200 group shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors capitalize truncate">
              {renderHighlighted('full_name', profile.full_name)}
            </h3>
            <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mt-1">
              <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{renderHighlighted('job_title', profile.job_title || 'N/A')}</span>
            </div>
          </div>
          {profile.score && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-mono shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{profile.score.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm text-slate-400 mb-4">
          {profile.job_company_name && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate">{renderHighlighted('job_company_name', profile.job_company_name)}</span>
            </div>
          )}
          {profile.location_name && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate">{profile.location_name}</span>
            </div>
          )}
        </div>

        {profile.summary && (
          <div className="mb-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            <p className="text-slate-300 text-sm line-clamp-3 italic break-words leading-relaxed">
              "{renderHighlighted('summary', profile.summary)}"
            </p>
          </div>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {profile.skills.slice(0, 8).map((skill, idx) => (
              <span
                key={idx}
                title={skill}
                className="bg-slate-700/60 text-slate-300 border border-slate-600/50 text-xs px-2.5 py-1 rounded-lg font-medium truncate max-w-[140px]"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 8 && (
              <span className="text-xs text-slate-500 self-center pl-1 font-mono shrink-0">
                +{profile.skills.length - 8} more
              </span>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => onSelect(profile.id)}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-slate-700/50 hover:bg-indigo-600 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-600/50 hover:border-indigo-500 transition-all duration-150"
      >
        <Eye className="w-4 h-4" />
        <span>View Full Profile</span>
      </button>
    </div>
  );
};
