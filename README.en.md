# Komodo MCP Server

A complete MCP (Model Context Protocol) server for the Komodo API. Provides access to all Komodo functionalities through a modular and well-structured architecture.

## 🚀 Features

- **Modular Architecture**: Organized into resource modules for better maintainability
- **Complete API Coverage**: Integrates all available Komodo endpoints
- **TypeScript**: Fully typed for better development experience
- **Error Handling**: Centralized error handling system
- **Flexible Configuration**: Support for multiple environments

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/oculairmedia/komodo-mcp.git
   cd komodo-mcp
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your credentials:
   ```env
   KOMODO_KEY="your_api_key"
   KOMODO_SECRET="your_secret"
   KOMODO_URL="https://your-instance.komo.do"
   ```

4. **Build the project**:
   ```bash
   pnpm build
   ```

## 🏃‍♂️ Usage

### Method 1: Local Development

#### Development Mode
```bash
pnpm dev
```

#### Production Mode
```bash
pnpm build
pnpm start
```

#### With Supergateway (HTTP/SSE)
```bash
npx -y supergateway \
  --stdio "node dist/index.js" \
  --port 9715 \
  --baseUrl http://0.0.0.0:9715 \
  --ssePath /mcp \
  --messagePath /mcp \
  --cors
```

Or use the npm script:
```bash
pnpm start:http
```

### Method 2: Docker 🐳

#### Quick Build and Run
```bash
# Build the image
docker build -t komodo-mcp .

# Run the container
docker run -d \
  --name komodo-mcp-server \
  -p 9715:9715 \
  --env-file .env \
  komodo-mcp
```

#### Using Docker Compose (Recommended)
```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

#### Verify it's working
```bash
# Check if the server is running
curl http://localhost:9715/mcp

# View container logs
docker logs komodo-mcp-server
```

### Environment Variables Configuration

Make sure you have the `.env` file configured:
```env
KOMODO_KEY="your_api_key"
KOMODO_SECRET="your_secret"
KOMODO_URL="https://your-instance.komo.do"
```

## 🛠️ Available Tools

The MCP server provides **40+ tools** organized in the following modules:

### 🖥️ Servers
- `list_servers` - List all servers
- `get_server_info` - Get detailed server information
- `create_server` - Create a new server
- `update_server` - Update server configuration
- `delete_server` - Delete a server
- `get_server_stats` - Get server statistics

### 📚 Stacks
- `list_stacks` - List all stacks
- `get_stack_info` - Get detailed stack information
- `deploy_stack` - Deploy a stack
- `create_stack` - Create a new stack
- `update_stack` - Update stack configuration
- `delete_stack` - Delete a stack
- `start_stack` - Start a stack
- `stop_stack` - Stop a stack
- `restart_stack` - Restart a stack

### 🚀 Deployments
- `list_deployments` - List all deployments
- `get_deployment_info` - Get detailed deployment information
- `deploy_deployment` - Deploy a deployment
- `create_deployment` - Create a new deployment
- `update_deployment` - Update deployment configuration
- `delete_deployment` - Delete a deployment
- `start_deployment` - Start a deployment
- `stop_deployment` - Stop a deployment
- `restart_deployment` - Restart a deployment
- `get_deployment_logs` - Get deployment logs

### 🔨 Builds
- `list_builds` - List all builds
- `get_build_info` - Get detailed build information
- `run_build` - Execute a build
- `create_build` - Create a new build
- `update_build` - Update build configuration
- `delete_build` - Delete a build
- `cancel_build` - Cancel a running build

### 📁 Repositories
- `list_repos` - List all repositories
- `get_repo_info` - Get detailed repository information
- `create_repo` - Create a new repository
- `update_repo` - Update repository configuration
- `delete_repo` - Delete a repository
- `pull_repo` - Pull repository from origin
- `clone_repo` - Clone a repository

### ⚙️ Procedures
- `list_procedures` - List all procedures
- `get_procedure_info` - Get detailed procedure information
- `run_procedure` - Execute a procedure
- `create_procedure` - Create a new procedure
- `update_procedure` - Update procedure configuration
- `delete_procedure` - Delete a procedure

### 🔧 System
- `list_updates` - List system updates
- `get_system_info` - Get system information
- `get_version` - Get Komodo version
- `list_alerters` - List configured alerters
- `get_alerter_info` - Get detailed alerter information
- `create_alerter` - Create a new alerter
- `update_alerter` - Update alerter configuration
- `delete_alerter` - Delete an alerter

## 🏗️ Architecture

```
src/
├── index.ts              # Main entry point
├── types.ts              # TypeScript type definitions
├── client.ts             # Komodo client and utilities
└── resources/            # Resource modules
    ├── servers.ts        # Server management
    ├── stacks.ts         # Stack management
    ├── deployments.ts    # Deployment management
    ├── builds.ts         # Build management
    ├── repos.ts          # Repository management
    ├── procedures.ts     # Procedure management
    └── system.ts         # System functions
```

### Design Principles

- **Separation of Concerns**: Each module handles a specific type of resource
- **Code Reusability**: Shared client and utilities
- **Strong Typing**: TypeScript interfaces for better type safety
- **Consistent Error Handling**: Uniform responses throughout the application

## 🔧 MCP Configuration

To use this MCP server, configure it in your MCP-compatible client:

```json
{
  "mcpServers": {
    "komodo": {
      "command": "node",
      "args": ["/path/to/komodo-mcp-server/dist/index.js"],
      "cwd": "/path/to/komodo-mcp-server",
      "env": {
        "KOMODO_KEY": "your-key-here",
        "KOMODO_SECRET": "your-secret-here",
        "KOMODO_URL": "your-url-here"
      }
    }
  }
}
```

### HTTP/SSE Transport (via Supergateway)

```json
{
  "mcpServers": {
    "komodo": {
      "url": "http://localhost:9715/mcp",
      "transport": "sse"
    }
  }
}
```

## 🐛 Troubleshooting

### Connection Error
1. Verify environment variables
2. Confirm the Komodo URL is accessible
3. Validate API credentials

### "Method not found" Error
1. Ensure the server is built (`pnpm build`)
2. Verify configuration in your MCP client
3. Restart the MCP client after configuration changes

### Permission Issues
1. Verify credentials have the necessary permissions
2. Confirm the user has access to requested resources

## 📋 Requirements

- Node.js v18 or higher
- pnpm (recommended) or npm
- Access to a Komodo instance
- Valid API credentials

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 🔗 Links

- [Komodo Documentation](https://docs.komo.do)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [GitHub Repository](https://github.com/oculairmedia/komodo-mcp)

---

**Note**: This is a fork maintained by [OculairMedia](https://github.com/oculairmedia). For the original project, see the upstream repository.
