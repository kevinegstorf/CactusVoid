# CactusVoid

![CI](https://github.com/kevinegstorf/CactusVoid/actions/workflows/ci.yml/badge.svg)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd cactusvoid
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following environment variables:

   ```sh
   KRAKEN_API_KEY=your_api_key
   KRAKEN_API_SECRET=your_api_secret
   DB_CONNECTION_STRING=your_database_connection_string
   ```

   You can use the [.env-example](http://_vscodecontentref_/2) file as a reference.

### Running the Project

- To start the project:

  ```sh
  npm start
  ```

- To start the project in development mode with hot-reloading:

  ```sh
  npm run dev
  ```

- To build the project:

  ```sh
  npm run build
  ```

- To run tests:
  ```sh
  npm test
  ```

### Project Structure

- [src](http://_vscodecontentref_/3): Contains the source code
  - `database/`: Database-related code
  - `services/`: Service layer code
  - `tasks/`: Scheduled tasks
  - `tests/`: Test files
  - `utils/`: Utility functions

### Configuration

- [tsconfig.json](http://_vscodecontentref_/4): TypeScript configuration
- [jest.config.js](http://_vscodecontentref_/5): Jest configuration
- [.env](http://_vscodecontentref_/6): Environment variables (not included in the repository)
- [.env-example](http://_vscodecontentref_/7): Example environment variables file

### License

This project is licensed under the ISC License.# CactusVoid
