import express from "express";
import pino from "pino";

console.log("tete");

const app = express();

const logger = pino();

// Add request logging middleware
app.use((req, res, next) => {
  logger.info(
    {
      method: req.method,
      url: req.url,
      host: req.hostname,
    },
    "incoming request"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res) => {
  res.send(
    [
      "version: 1",
      `method: ${req.method}`,
      `url: ${req.url}`,
      `hostname: ${req.hostname}`,
    ].join("<br />")
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`server running at http://localhost:${PORT}`);
});
