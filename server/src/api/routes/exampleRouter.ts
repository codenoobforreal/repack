import express from "express";

const exampleRouter = express.Router();

// exampleRouter.use()
exampleRouter.get("/", (_, res) => {
  res.status(200).json({
    success: true,
  });
});
// exampleRouter.post();

export { exampleRouter };
