# LinkedIn Profile Search Engine

A professional and modern talent search platform built with **Clean Architecture** for advanced search and filtering over LinkedIn-style professional profiles using **FastAPI**, **MongoDB (NoSQL)**, **Elasticsearch 9.x**, and **React + TypeScript + Tailwind CSS**.

---

## Key Features

### 1. **Smart Search Engine (Elasticsearch Integration)**

- **Full-Text Search & Fuzzy Matching**:
  - Search across profile fields including name, job title, companies, professional summary, and skills with typo tolerance using Elasticsearch fuzzy matching (`fuzziness: AUTO`).

- **N-gram Analyzer**:
  - Provides fast partial matching and improved search experience with keyword highlighting (`Highlighting`).

- **Multi-Field Boosting**:
  - Applies higher relevance weights to important fields such as name and job title compared to general text fields.

---

### 2. **Dynamic Filters & Faceted Search**

- Multi-dimensional filtering based on:
  - Job Title
  - Skills
  - Industry
  - Location

- Dynamic facet aggregation:
  - Provides real-time filter counts based on current search results.

- Supports advanced search workflows similar to modern recruitment platforms.

---

### 3. **MongoDB Document Database**

- Uses **PyMongo Client** for MongoDB integration.
- Stores and manages complete profile documents including:
  - Personal information
  - Professional experiences (`Experience`)
  - Educational background (`Education`)
  - Skills and additional profile metadata

---

### 4. **Modern Frontend (React + TypeScript + Tailwind CSS)**

- Responsive and modern user interface.
- Features include:
  - Dark Mode support
  - Search interface
  - Advanced filter sidebar
  - Profile result cards
  - Search term highlighting
  - Detailed profile modal (`ProfileModal`)
  - Pagination support

---

### 5. **Dockerized Deployment with Docker Compose**

- Complete local environment orchestration including:

  - MongoDB
  - Elasticsearch
  - FastAPI Backend
  - React + Nginx Frontend

- Entire system can be started with a single command.

---

# System Architecture

```text
               +----------------------------------+
               |   React + TypeScript Frontend    |
               |       (Port 3000 / Nginx)        |
               +----------------------------------+
                                |
                                v (HTTP REST API)
               +----------------------------------+
               |         FastAPI Backend          |
               |          (Port 8000)             |
               +----------------------------------+
                     /                      \
                    v                        v
        +-----------------------+  +-----------------------+
        |   Elasticsearch 9.4.6   |  |     MongoDB 8.0       |
        |   (Search & Facets)   |  | (Primary Document DB) |
        +-----------------------+  +-----------------------+
```

---

# Getting Started

## Method 1: Run with Docker Compose (Recommended)

From the project root directory, run:

```bash
docker compose up -d --build
```

This command will build and start all required services:

- MongoDB
- Elasticsearch
- FastAPI Backend
- React Frontend with Nginx

After successful startup, the services will be available at:

### Frontend Application

```text
http://localhost:3000
```

### FastAPI Swagger Documentation

```text
http://localhost:8000/docs
```

### Elasticsearch Service

```text
http://localhost:9200
```

---

# Method 2: Local Development Setup

## 1. Requirements

Install the following dependencies:

- Python 3.12+
- Node.js 22+
- MongoDB 7+
- Elasticsearch 9+

Make sure MongoDB and Elasticsearch services are running locally before starting the application.

---

# Backend Setup (FastAPI)

Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

Run FastAPI development server:

```bash
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```

Backend API will be available at:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

---

# Frontend Setup (React + TypeScript)

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:3000
```

---

# 🧪 Running Tests

Run backend tests:

```bash
PYTHONPATH=backend python3 -m pytest backend/tests
```

The test suite validates:

- Search functionality
- API endpoints
- Data models
- Backend services

---


# 📂 Project Structure

```text
├── backend/                         # FastAPI backend application
│   ├── app/
│   │   ├── api/                     # REST API endpoints
│   │   ├── core/                    # Application configuration and database connections
│   │   ├── models/                  # Pydantic schemas and DTOs
│   │   └── services/                # Business logic, Elasticsearch, indexing, and seed services
│   │
│   ├── tests/                       # Backend test suite
│   ├── Dockerfile                   # Backend Docker configuration
│   └── requirements.txt             # Python dependencies
│
├── frontend/                        # React + TypeScript frontend application
│   ├── src/
│   │   ├── api/                     # API client implementations
│   │   ├── components/              # Reusable UI components
│   │   │   ├── SearchBar            # Search input component
│   │   │   ├── FilterSidebar        # Dynamic filters component
│   │   │   ├── ProfileCard          # Profile result card component
│   │   │   └── ProfileModal         # Full profile details modal
│   │   │
│   │   └── types/                   # TypeScript interfaces and type definitions
│   │
│   └── Dockerfile                   # Frontend Docker configuration
│
├── data/                            # Dataset files
│   └── linkedin_300_profiles.csv    # LinkedIn profile dataset
│
├── docker-compose.yml               # Docker service orchestration
│
└── README.md                        # Project documentation
```

---

# Tech Stack

## Backend

- FastAPI `0.141.1`
- Python `3.12+`
- Pydantic v2
- PyMongo
- Elasticsearch Python Client
- Pytest

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Nginx

## Infrastructure

- Docker
- Docker Compose
- MongoDB `8.0`
- Elasticsearch `9.4.6`

---

# Repository Policy

- The project is developed and finalized locally.
- No GitHub remote interaction, pull requests, or external repository operations are required.
- The repository can be connected to any remote Git provider when needed.

---

# Project Status

✅ Backend implementation completed

✅ Elasticsearch search engine integrated

✅ MongoDB storage implemented

✅ React frontend completed

✅ Docker Compose environment configured

✅ Automated tests added

✅ Documentation completed

---

The project is ready for local deployment and future extensions.