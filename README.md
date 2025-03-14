# rest-to-mcp

A bridge that enables any LLM to access and interact with documented REST APIs through the Model Context Protocol (MCP).

## Overview

`rest-to-mcp` provides a seamless adapter layer that allows language models to:

1. Discover available endpoints from REST APIs that publish OpenAPI/Swagger documentation
2. Make direct HTTP requests to these endpoints

This enables LLMs to interact with external REST services without requiring custom integration code for each API.

## How It Works

This project implements an MCP server with two primary tools:

### 1. discover-endpoints

Automatically locates API documentation by probing common paths where OpenAPI/Swagger specs are typically published:

- `/openapi.json`
- `/swagger.json`
- `/swagger/v1/swagger.json`
- `/api-docs`
- `/api-docs.json`

### 2. make-request

Allows direct HTTP interactions with any REST endpoint:

- Supports GET, POST, PUT, DELETE methods
- Handles JSON request and response bodies
- Returns formatted JSON responses to the LLM

## Developing

```bash
deno install
```

Start the MCP server:

```bash
deno run dev
```

This launches the server using the MCP Inspector for testing and debugging.

## Integration

LLMs can connect to this server through the Model Context Protocol, enabling them to:

1. First discover what endpoints are available on a REST API
2. Make appropriate requests to those endpoints
3. Process the JSON responses


## License

Project licensed under the MIT License.

More information on the LICENSE file.