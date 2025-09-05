# Database Optimization Functions

This directory contains SQL functions that optimize the performance of statistics queries in the Construction CRM application.

## Functions

### 1. Client Statistics Function
File: `client_statistics_function.sql`

This function provides efficient client statistics calculation in a single database query instead of multiple separate queries.

### 2. Project Statistics Function
File: `project_statistics_function.sql`

This function provides efficient project statistics calculation in a single database query instead of multiple separate queries.

## Installation

To install these functions in your Supabase database:

1. Copy the contents of each SQL file
2. Execute the SQL in your Supabase SQL editor or through your preferred database client

## Benefits

- **Performance**: Reduces multiple database round trips to a single query
- **Timeout Prevention**: Helps prevent Vercel function timeouts by reducing query execution time
- **Scalability**: More efficient as the dataset grows

## Fallback Mechanism

The application includes fallback mechanisms that will work even if these functions are not installed, but performance will be degraded.