import { XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    port: 9715,
  },
  server: {
    name: "komodo-mcp-server",
    version: "2.0.0",
  },
  tools: {
    path: "./src/tools",
  },
  resources: false,
  prompts: false,
};

export default config;
