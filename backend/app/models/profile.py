from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict

class CompanyLocation(BaseModel):
    name: Optional[str] = None
    locality: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None

class ExperienceItem(BaseModel):
    company_name: Optional[str] = None
    title: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    summary: Optional[str] = None

class EducationItem(BaseModel):
    school_name: Optional[str] = None
    degrees: List[str] = Field(default_factory=list)
    majors: List[str] = Field(default_factory=list)
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class Profile(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    full_name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    linkedin_url: Optional[str] = None
    industry: Optional[str] = None
    job_title: Optional[str] = None
    job_company_name: Optional[str] = None
    job_company_industry: Optional[str] = None
    location_name: Optional[str] = None
    location_country: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    emails: List[str] = Field(default_factory=list)
    experiences: List[ExperienceItem] = Field(default_factory=list)
    educations: List[EducationItem] = Field(default_factory=list)
    raw_data: Optional[Dict[str, Any]] = None

class ProfileSearchResult(BaseModel):
    id: str
    full_name: str
    job_title: Optional[str] = None
    job_company_name: Optional[str] = None
    industry: Optional[str] = None
    location_name: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    summary: Optional[str] = None
    score: Optional[float] = None
    highlights: Optional[Dict[str, List[str]]] = None

class FacetCount(BaseModel):
    key: str
    count: int

class FacetsResponse(BaseModel):
    job_titles: List[FacetCount]
    skills: List[FacetCount]
    industries: List[FacetCount]
    locations: List[FacetCount]

class SearchResponse(BaseModel):
    total: int
    page: int
    size: int
    pages: int
    results: List[ProfileSearchResult]
    facets: Optional[FacetsResponse] = None
