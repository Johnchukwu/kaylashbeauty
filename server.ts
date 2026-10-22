import "dotenv/config";
import express from "express";
import { createApi } from "./api/app";
import { connectDatabase } from "./api/config/database";

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
