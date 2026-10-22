import "dotenv/config";
import express from "express";
import { createApi } from "./backend/app";
import { connectDatabase } from "./backend/config/database";

async function startServer() {
  await connectDatabase();
  const server = express();
  server.use("/api", createApi());
  server.listen(Number(process.env.API_PORT ?? 3001), () =>
    console.log("API ready on http://localhost:3001"),
  );
}

startServer().catch((error: unknown) => {
  console.error("Unable to start the server", error);
  process.exit(1);
});
