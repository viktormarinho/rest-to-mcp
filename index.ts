import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "rest-to-mcp",
  version: "0.0.2",
});

server.tool("make-request", {
  url: z.string(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  reqBody: z.string().optional(),
}, async ({ url, method, reqBody }) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method !== "GET" ? reqBody : undefined,
  });
  const data = await response.json();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
});

// Resource for listing the endpoints using OpenAPI JSON
server.tool(
  "discover-endpoints",
  {
    url: z.string(),
    path: z.string().optional().describe("If the user provides a path, it will be used instead of the default paths."),
  },
  async ({ url, path }) => {
    // Try multiple possible API specification paths
    const possiblePaths = path ? [path] : [
      "/openapi.json",
      "/swagger.json",
      "/swagger/v1/swagger.json",
      "/api-docs",
      "/api-docs.json",
    ];
    
    let openApiSpec;
    let response;
    
    for (const path of possiblePaths) {
      try {
        response = await fetch(`${url}${path}`);
        if (response.ok) {
          openApiSpec = await response.json();
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch from ${url}${path}: ${error}`);
      }
    }
    
    if (!openApiSpec) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "Could not find API specification" }, null, 2),
          },
        ]
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(openApiSpec, null, 2),
        },
      ]
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
