import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileModal } from './components/ProfileModal';
import { SearchResponse, FacetsResponse } from './types';
import { fetchProfiles, fetchFacets, triggerSeed } from './api/client';
import { Sparkles, Users, Database, ChevronLeft, ChevronRight, RefreshCw, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const pageSize = 9;

  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [globalFacets, setGlobalFacets] = useState<FacetsResponse | undefined>(undefined);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  const loadFacets = useCallback(() => {
    fetchFacets().then(setGlobalFacets).catch(console.error);
  }, []);

  const handleSearch = useCallback(() => {
    setLoading(true);
    fetchProfiles({
      q: query,
      job_title: selectedJobTitles,
      skill: selectedSkills,
      industry: selectedIndustries,
      location: selectedLocations,
      page,
      size: pageSize,
    })
      .then((data) => {
        setSearchData(data);
        if (!globalFacets && data.facets) {
          setGlobalFacets(data.facets);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, selectedJobTitles, selectedSkills, selectedIndustries, selectedLocations, page, globalFacets]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    loadFacets();
  }, [loadFacets]);

  const handleToggleFilter = (type: 'job_title' | 'skill' | 'industry' | 'location', value: string) => {
    setPage(1);
    if (type === 'job_title') {
      setSelectedJobTitles((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else if (type === 'skill') {
      setSelectedSkills((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else if (type === 'industry') {
      setSelectedIndustries((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else if (type === 'location') {
      setSelectedLocations((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };

  const handleClearAllFilters = () => {
    setSelectedJobTitles([]);
    setSelectedSkills([]);
    setSelectedIndustries([]);
    setSelectedLocations([]);
    setPage(1);
  };

  const handleResetSearch = () => {
    setQuery('');
    handleClearAllFilters();
  };

  const handleSeed = () => {
    setSeeding(true);
    setSeedMsg(null);
    triggerSeed()
      .then((res) => {
        setSeedMsg(res.message);
        loadFacets();
        handleSearch();
      })
      .catch(() => setSeedMsg('Seeding failed.'))
      .finally(() => setSeeding(false));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                LP Search Engine
              </h1>
              <p className="text-xs text-slate-400 font-medium">FastAPI + Elasticsearch 8 + MongoDB</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Indexing...' : 'Re-Seed Dataset'}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="py-10 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Search Senior Talent & Experts
          </h2>
          <p className="text-slate-400 text-sm">
            Full-text search, fuzzy matching, and multi-criteria filters powered by Elasticsearch.
          </p>
        </div>

        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={() => { setPage(1); handleSearch(); }}
          onReset={handleResetSearch}
        />

        {seedMsg && (
          <div className="mt-4 max-w-xl mx-auto text-center text-xs bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 py-2.5 px-4 rounded-xl">
            {seedMsg}
          </div>
        )}
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-20 flex-1 w-full">
        <div className="flex gap-8 items-start">
          <FilterSidebar
            facets={globalFacets || searchData?.facets}
            selectedJobTitles={selectedJobTitles}
            selectedSkills={selectedSkills}
            selectedIndustries={selectedIndustries}
            selectedLocations={selectedLocations}
            onToggleFilter={handleToggleFilter}
            onClearAll={handleClearAllFilters}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>
                  Found <strong className="text-white font-mono">{searchData?.total || 0}</strong> candidates
                </span>
              </div>
              {searchData && searchData.pages > 1 && (
                <div className="text-xs text-slate-400 font-mono">
                  Page {searchData.page} of {searchData.pages}
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-900/60 border border-slate-800/80 rounded-2xl animate-pulse p-6" />
                ))}
              </div>
            ) : searchData && searchData.results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {searchData.results.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onSelect={(id) => setSelectedProfileId(id)}
                    />
                  ))}
                </div>

                {searchData.pages > 1 && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/80 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-slate-300 px-4 font-mono">
                      {page} / {searchData.pages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, searchData.pages))}
                      disabled={page === searchData.pages}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/80 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8">
                <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-300 mb-1">No candidates found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  Try adjusting your keywords or clearing active filters to see more profiles.
                </p>
                <button
                  onClick={handleResetSearch}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg transition-colors"
                >
                  Clear Search & Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <ProfileModal
        profileId={selectedProfileId}
        onClose={() => setSelectedProfileId(null)}
      />

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Full Stack Architecture Project</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
