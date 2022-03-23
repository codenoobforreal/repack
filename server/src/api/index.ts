import express from "express";
import path from "path";
import { apiRouter } from "./routes";
import cors from "cors";
import morgan from "morgan";

const api = express();

// 简单的日志中间件
// api.use((req, res, next) => {
//   const startTime = Date.now();
//   next();
//   const delta = Date.now() - startTime;
//   console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
// });

const clientDistPath = path.join(__dirname, "../..", "public");

api.use(cors());

// morgan日志中间件
api.use(morgan("tiny"));

api.use(express.json());

api.use(express.static(clientDistPath));

api.use("/v1", apiRouter);

// serve 前端
api.get("/*", (_, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

export default api;
