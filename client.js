import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { loadMcpTools } from "@langchain/mcp-adapters";
import { AzureChatOpenAI } from "@langchain/openai";
import readline from "readline";


const model = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OAI_KEY,
  azureOpenAIBasePath: process.env.AZURE_OAI_BASE_PATH,
  azureOpenAIApiDeploymentName: process.env.AZURE_OAI_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OAI_API_VERSION,
});
// Automatically starts and connects to a MCP reference server
const transport = new StdioClientTransport({
    "command": "npx",
    "args": [
      "-y",
      "mongodb-mcp-server",
      "--connectionString",
      "mongodb://localhost:27017/?directConnection=true"
    ],
});

// Initialize the client
const client = new Client({
  name: "math-client",
  version: "1.0.0",
});

try {
  // Connect to the transport
  await client.connect(transport);

  // Get tools with custom configuration
  const mongoTools = [
    "connect",
    "find",
    "aggregate",
    "count",
    "insert-one",
    "insert-many",
    "create-index",
    "update-one",
    "update-many",
    "rename-collection",
    "delete-one",
    "delete-many",
    "drop-collection",
    "drop-database",
    "list-databases",
    "list-collections",
    "collection-indexes",
    "collection-schema",
    "collection-storage-size",
    "db-stats"
  ];
  const tools = await loadMcpTools(mongoTools, client, {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
  });

  // Create the agent
  const agent = createReactAgent({ llm: model, tools });

  // Set up REPL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Ask MongoDB Agent > "
  });

  console.log("MongoDB Agent REPL. Type your questions. Press Ctrl+C to exit.");
  rl.prompt();

  rl.on("line", async (line) => {
    const question = line.trim();
    if (!question) {
      rl.prompt();
      return;
    }
    try {
      const agentResponse = await agent.invoke({
        messages: [{ role: "user", content: question }],
      });
      // Print the agent's response (just the content if available)
      if (agentResponse && agentResponse.content) {
        console.log(agentResponse.content);
      } else if (agentResponse && agentResponse.messages) {
        // Fallback: print the last AI message content if available
        const lastMsg = agentResponse.messages.reverse().find(m => m.content && typeof m.content === "string");
        if (lastMsg) {
          console.log(lastMsg.content);
        } else {
          console.log(agentResponse);
        }
      } else {
        console.log(agentResponse);
      }
    } catch (e) {
      console.error("Error from agent:", e);
    }
    rl.prompt();
  });

} catch (e) {
  console.error(e);
} finally {
  // Clean up connection on exit
  process.on('exit', async () => {
    await client.close();
  });
}