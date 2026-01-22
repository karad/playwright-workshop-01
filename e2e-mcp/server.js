const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/echo", (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message : "";
  res.json({ message, receivedAt: new Date().toISOString() });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
