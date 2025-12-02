# Setup dev environment
This project uses `docker-compose` to setup the development environment.

## Prerequisites
- Docker
- Docker Compose

## Steps to setup the environment
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Build and start the containers:
   ```bash
    docker-compose up -d --build
    ```
3. Build dependencies inside the nodejs container:
   ```bash
   docker-compose run --rm nodejs npm install
   ```
4. Run migrations inside the nodejs container:
   ```bash
   docker-compose run --rm nodejs npm run migration:run -- -d ./data-source.ts
   ```

## Running the services
- To start the Node.js service:
  ```bash
  docker-compose run nodejs npm run start:consumer
  ```
