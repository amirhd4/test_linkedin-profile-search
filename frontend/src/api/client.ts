import axios from 'axios';
import { SearchFilters, SearchResponse, Profile, FacetsResponse } from '../types';

const API_BASE = '/api/v1/profiles';

export const fetchProfiles = async (filters: SearchFilters): Promise<SearchResponse> => {
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.size) params.append('size', filters.size.toString());

  filters.job_title?.forEach(title => params.append('job_title', title));
  filters.skill?.forEach(sk => params.append('skill', sk));
  filters.industry?.forEach(ind => params.append('industry', ind));
  filters.location?.forEach(loc => params.append('location', loc));

  const response = await axios.get<SearchResponse>(`${API_BASE}/search?${params.toString()}`);
  return response.data;
};

export const fetchProfileById = async (id: string): Promise<Profile> => {
  const response = await axios.get<Profile>(`${API_BASE}/${id}`);
  return response.data;
};

export const fetchFacets = async (): Promise<FacetsResponse> => {
  const response = await axios.get<FacetsResponse>(`${API_BASE}/facets`);
  return response.data;
};

export const triggerSeed = async (): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(`${API_BASE}/seed`);
  return response.data;
};
