import express from "express";

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.static("dist-web"));

  app.get("/api", function (req, res) {
    res.send({ api: true, strength: "strong" });
  });

  app.listen(8135);
};
