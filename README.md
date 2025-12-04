# AceMyOPPE

A platform designed specifically for DBMS OPPE preparation, allowing students to practice both SQL queries and Python-Postgres connectivity directly in the browser.

## Technology Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express and tRPC
- Database: PostgreSQL with Drizzle ORM
- Runtime: Bun
- Containerization: Docker

## Development Setup

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Bun](https://bun.sh/)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ace-my-oppe.git
   cd ace-my-oppe
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file with the necessary configuration (database URL, etc.)

4. Start the development servers:

   For the frontend:
   ```
   pnpm run dev
   ```

   For the backend:
   ```
   bun run --watch server/index.ts
   ```

## Project Structure

- `/src`: Frontend React code
  - `/components`: Reusable UI components
  - `/pages`: Main application pages
- `/server`: Backend server code
  - `/db`: Database schema and migrations
- `/public`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

Favicon from <a href="https://www.flaticon.com/free-icons/database" title="database icons">Database icons created by srip - Flaticon</a>
