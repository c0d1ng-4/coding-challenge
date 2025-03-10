# Backend

This folder contains the backend application built with FastAPI. The application exposes a RESTful API for the frontend to interact with.

## Features
- RESTful API endpoints
- Dependency management with Poetry
- Docker support for containerization

## Database

The backend uses PostgreSQL as its database, managed through SQLAlchemy and Alembic for migrations. The database schema is designed to support a healthcare facility management system, focusing on the following entities:

### Entities

1. **Facility**
   - **Attributes**:
     - `id`: Unique identifier for the facility (UUID).
     - `name`: Name of the facility.
     - `zip_code`: Zip code where the facility is located.
     - `capacity`: Maximum capacity of the facility.
     - `care_types`: Types of care provided by the facility (e.g., emergency, outpatient).
   - **Relationships**: 
     - Can be linked to patients and services offered.

2. **Patient**
   - **Attributes**:
     - `id`: Unique identifier for the patient (UUID).
     - `name`: Full name of the patient.
     - `date_of_birth`: Patient's date of birth.
     - `facility_id`: Foreign key linking to the facility where the patient is registered.
   - **Relationships**:
     - Each patient can be associated with one facility.

3. **Zip Code Range**
   - **Attributes**:
     - `id`: Unique identifier for the zip code range (UUID).
     - `facility_id`: Foreign key linking to the associated facility.
     - `min_zip_code`: Minimum zip code in the range.
     - `max_zip_code`: Maximum zip code in the range.
   - **Advantages**:
     - **Normalization**: Reduces data redundancy and improves integrity by allowing multiple facilities to share the same zip code range.
     - **Flexibility**: Supports dynamic management of zip code ranges, allowing easy updates and associations with facilities.
     - **Query Efficiency**: Optimizes queries related to service areas and allows for better indexing.

### Design Choices

- **Relational Database**: PostgreSQL is chosen for its robustness, support for complex queries, and ability to handle relationships between entities effectively.
- **ORM (SQLAlchemy)**: SQLAlchemy is used to abstract database interactions, allowing for easier management of database operations and migrations.
- **Migrations (Alembic)**: Alembic is utilized for managing database schema changes over time, ensuring that the database structure can evolve alongside the application.
- **Asynchronous Support**: The application is designed to handle asynchronous requests, improving performance and responsiveness, especially under load.

## Setup
1. Install dependencies: `poetry install`
2. Run the application: `uvicorn app.main:app --host 0.0.0.0 --port 8000`