import express from "express";
import path from "path";

export const startServer = () => {
  const app = express();
  app.use(express.json());

  app.get("/", function (req, res) {
    res.sendFile(path.resolve("web/index.html"));
  });

  app.get("/favicon.png", function (req, res) {
    res.sendFile(path.resolve("web/favicon.png"));
  });

  app.get("/styles.css", (req, res) => {
    res.sendFile(path.resolve("web/styles.css"));
  });

  app.get("/scripts.js", (req, res) => {
    res.sendFile(path.resolve("web/scripts.js"));
  });

  app.listen(8134);
};
