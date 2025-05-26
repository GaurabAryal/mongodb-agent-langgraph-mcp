# MongoDB Agent LangGraph MCP

This project is a fork of [Gaurab MCP project](git@github.com:GaurabAryal/mongodb-agent-langgraph-mcp.git)

This project provides a REPL to interact with a MongoDB instance using natural language, powered by [LangChain.js MCP Adapter](https://github.com/langchain-ai/langchainjs-mcp-adapters?tab=readme-ov-file), LangGraph agent and OpenAI.

## Features
- Ask open-ended questions about your MongoDB instance
- Uses a suite of MongoDB tools (find, aggregate, insert, update, etc.)

---

## Prerequisites
- Node.js (v18+ recommended)
- npm
- Access to an OpenAI resource (API key, deployment, etc.)
- Access to a running MongoDB instance

---

## Environment Variables
Ensure you have the following environment variables set:

```sh
export OPENAI_API_KEY=
export OPENAI_MODEL_NAME=gpt-3.5-turbo
export TEMPERATURE=0
export MONGO_CONNECTION_STRING=
```
---

## Installation
1. **Clone the repository:**
   ```sh
   git clone git@github.com:josmanperez/mongodb-agent-langgraph-mcp.git
   cd mongodb-agent-langgraph-mcp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

---

## Usage
1. **Ensure your MongoDB instance is running and accessible.**
   - For MongoDB MCP, the default connection string is set to `mongodb://localhost:27017/?directConnection=true` in `client.js`. Change it if needed.
2. **Start the REPL:**
   ```sh
   node client.js
   ```
3. **Interact with the agent:**
   - Type natural language questions or commands, e.g.:
     - `list all my databases`
     - `count documents in collection users in database mydb`
     - `insert a document into collection test in database mydb`
   - Press `Ctrl+C` to exit.

---

## Customization
- To change the MongoDB connection string, edit the `connectionString` in `client.js`.
- To use a different Azure OpenAI deployment/model, update the environment variables accordingly.

---

## License
MIT 
