# README.md

# Distributed Balance API

A NestJS application that demonstrates transaction handling for concurrent balance updates.

## Prerequisites

- Docker and Docker Compose
- Node.js (if running locally)

## Scripts

The project includes utility scripts in the `scripts/` directory:

### Start Script (scripts/start.sh)

A helper script that initializes and starts the entire application:

```bash
# Make it executable
chmod +x scripts/start.sh

# Run the script
./scripts/start.sh
```

This script:

- Creates `.env` file if it doesn't exist
- Starts all services with Docker Compose
- Waits for services to initialize
- Shows the logs of running containers

### Concurrency Test Script (scripts/test-concurrency.sh)

Tests the application's concurrency handling by sending 10,000 simultaneous requests:

```bash
# Make it executable
chmod +x scripts/test-concurrency.sh

# Run the script
./scripts/test-concurrency.sh
```

This script:

- Sends 10,000 concurrent requests to withdraw 2 units each
- Tracks successful and failed requests
- Verifies that exactly 5,000 requests succeed and 5,000 fail
- Displays test results

**Note**: The test script requires `curl` and `jq` to be installed.

## Getting Started

### Using Docker (Recommended)

1. Clone the repository
2. Navigate to the project directory
3. Run the application:

```bash
docker-compose up
```

This will start both the PostgreSQL database and the NestJS application.

### Local Development

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on the provided example
5. Run the database:

```bash
docker-compose up postgres
```

6. Run migrations:

```bash
npm run migrate
```

7. Start the application:

```bash
npm run start:dev
```

## API Endpoints

### Update Balance

Updates a user's balance.

- **URL**: `/api/balance/update`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userId": 1,
    "amount": 100
  }
  ```
- **Success Response**:
  ```json
  {
    "userId": 1,
    "newBalance": 10100
  }
  ```
- **Error Responses**:
  - 400 Bad Request: `{ "error": "Insufficient funds" }`
  - 404 Not Found: `{ "error": "User not found" }`
  - 500 Internal Server Error: `{ "error": "Internal server error" }`

## Testing Concurrency

The system is designed to handle concurrent requests that modify the same user's balance. When 10,000 requests try to withdraw 2 units each from a balance of 10,000, exactly 5,000 will succeed and 5,000 will fail with an "Insufficient funds" error.
