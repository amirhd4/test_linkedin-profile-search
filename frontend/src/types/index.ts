export interface ExperienceItem {
  company_name?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  summary?: string;
}

export interface EducationItem {
  school_name?: string;
  degrees: string[];
  majors: string[];
  start_date?: string;
  end_date?: string;
}

export interface Profile {
  _id: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  linkedin_url?: string;
  industry?: string;
  job_title?: string;
  job_company_name?: string;
  location_name?: string;
  location_country?: string;
  summary?: string;
  skills: string[];
  emails: string[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  raw_data?: Record<string, any>;
}

export interface ProfileSearchResult {
  id: string;
  full_name: string;
  job_title?: string;
  job_company_name?: string;
  industry?: string;
  location_name?: string;
  skills: string[];
  summary?: string;
  score?: number;
  highlights?: Record<string, string[]>;
}

export interface FacetCount {
  key: string;
  count: number;
}

export interface FacetsResponse {
  job_titles: FacetCount[];
  skills: FacetCount[];
  industries: FacetCount[];
  locations: FacetCount[];
}

export interface SearchResponse {
  total: number;
  page: number;
  size: number;
  pages: number;
  results: ProfileSearchResult[];
  facets?: FacetsResponse;
}

export interface SearchFilters {
  q?: string;
  job_title?: string[];
  skill?: string[];
  industry?: string[];
  location?: string[];
  page?: number;
  size?: number;
}
