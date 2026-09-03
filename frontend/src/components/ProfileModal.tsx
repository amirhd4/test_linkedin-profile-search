import React, { useEffect, useState } from 'react';
import { Profile } from '../types';
import { fetchProfileById } from '../api/client';
import { X, Briefcase, GraduationCap, Mail, Globe, MapPin, Building, Calendar, User } from 'lucide-react';

interface Props {
  profileId: string | null;
  onClose: () => void;
}

export const ProfileModal: React.FC<Props> = ({ profileId, onClose }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    setError(null);
    fetchProfileById(profileId)
      .then((data) => setProfile(data))
      .catch(() => setError('Failed to load profile details'))
      .finally(() => setLoading(false));
  }, [profileId]);

  if (!profileId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading profile data...</div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400">{error}</div>
        ) : profile ? (
          <div className="p-8">
            <div className="border-b border-slate-800 pb-6 mb-6">
              <div className="flex items-center gap-3 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">
                <User className="w-4 h-4" />
                <span>Linkdin Profile</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-100 capitalize mb-2">
                {profile.full_name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
                {profile.job_title && (
                  <div className="flex items-center gap-1.5 font-medium text-indigo-300">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span>{profile.job_title}</span>
                  </div>
                )}
                {profile.job_company_name && (
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{profile.job_company_name}</span>
                  </div>
                )}
                {profile.location_name && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{profile.location_name}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                {profile.emails && profile.emails.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{profile.emails.join(', ')}</span>
                  </div>
                )}
                {profile.linkedin_url && (
                  <a
                    href={`https://${profile.linkedin_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-sky-950/50 hover:bg-sky-900/50 text-sky-400 px-3 py-1.5 rounded-lg border border-sky-800/50 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>

            {profile.summary && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Summary
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  {profile.summary}
                </p>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Skills & Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 text-xs px-3 py-1 rounded-xl font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.experiences && profile.experiences.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-lg mb-4">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <span>Work Experience</span>
                </div>
                <div className="space-y-4">
                  {profile.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl relative pl-6 border-l-2 border-l-indigo-500"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-slate-100 text-base">
                          {exp.title || 'Position'}
                        </h5>
                        {(exp.start_date || exp.end_date) && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full font-mono">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>
                              {exp.start_date || 'N/A'} - {exp.end_date || 'Present'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-indigo-400 font-medium text-sm mb-2">
                        {exp.company_name}
                      </div>
                      {exp.summary && (
                        <p className="text-slate-300 text-xs leading-relaxed mt-2">
                          {exp.summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.educations && profile.educations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-slate-200 font-bold text-lg mb-4">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <span>Education</span>
                </div>
                <div className="space-y-3">
                  {profile.educations.map((edu, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-slate-100 text-sm">
                          {edu.school_name || 'University / Institution'}
                        </h5>
                        {(edu.start_date || edu.end_date) && (
                          <span className="text-xs text-slate-500 font-mono">
                            {edu.start_date} - {edu.end_date}
                          </span>
                        )}
                      </div>
                      {edu.degrees && edu.degrees.length > 0 && (
                        <div className="text-emerald-400 text-xs font-medium mt-1">
                          {edu.degrees.join(', ')}
                        </div>
                      )}
                      {edu.majors && edu.majors.length > 0 && (
                        <div className="text-slate-400 text-xs mt-0.5">
                          Major: {edu.majors.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
