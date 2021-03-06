/* eslint-disable @typescript-eslint/no-unused-vars */
import https from "https";
import api from "./api";
import fs from "fs";
import path from "path";
import cluster from "cluster";
import os from "os";
import { isMainThread, workerData, Worker } from "worker_threads";

const PORT = process.env.PORT || 8000;

// 使用selfsign证书
const server = https.createServer(
  {
    key: fs.readFileSync(path.resolve(__dirname, "..", "key.pem")),
    cert: fs.readFileSync(path.resolve(__dirname, "..", "cert.pem")),
  },
  api
);

// 使用cluster，最终会用pm2代替
// if (cluster.isPrimary) {
//   console.log("primary process");
//   const WORKERS_NUM = os.cpus().length;
//   for (let i = 0; i < WORKERS_NUM; i++) {
//     cluster.fork();
//   }
// } else {
//   console.log("worker process");
//   server.listen(PORT);
// }

// 使用worker
// if (isMainThread) {
//   console.log("main thread");
//   new Worker(__filename, {
//     workerData: "data",
//   });
// } else {
//   console.log("worker thread");
//   // 执行复杂的数据处理工作 ...
// }

// 在test环境实际上是jest测试中，不需要进行app的启动
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`server start at port ${PORT}`);
  });
}

export default server;
