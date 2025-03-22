# DummyJSON API - Department Data Transformation

A NestJS application that fetches user data from the DummyJSON API and transforms it by department.

## Features

- Fetches user data from the [DummyJSON API](https://dummyjson.com/users)
- Transforms data and groups by department
- Provides performance optimizations:
  - Caching with TTL (Time To Live)
  - Efficient data transformation with Map data structures
  - Single-pass data processing
- Comprehensive test suite
- TypeScript with strong typing

## API Endpoints

- `GET /api/users` - Get all users from the API
- `GET /api/users/by-department` - Get users transformed and grouped by department

## Sample Response

```json
{
  "Engineering": {
    "male": 2,
    "female": 0,
    "ageRange": "30-35",
    "hair": {
      "Black": 1,
      "Blond": 1
    },
    "addressUser": {
      "JohnDoe": "12345",
      "AlexJohnson": "54321"
    }
  },
  "Marketing": {
    "male": 0,
    "female": 1,
    "ageRange": "28-28",
    "hair": {
      "Brown": 1
    },
    "addressUser": {
      "JaneSmith": "67890"
    }
  }
}
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Performance Considerations

This application implements several optimizations for performance:

1. **Caching** - API responses are cached for 10 minutes to reduce API calls
2. **Efficient Data Structures** - Uses JavaScript Map for better performance with large datasets
3. **Single-Pass Data Processing** - Processes all the data in a single loop
4. **Memory Efficiency** - Uses appropriate data structures to minimize memory usage

## Tech Stack

- NestJS - TypeScript-based framework
- Axios - HTTP client
- Node-Cache - In-memory caching
- Jest - Testing framework 