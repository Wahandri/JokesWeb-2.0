const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const https = require("https");
const users = require("./routes/users");
const jokes = require("./routes/jokes");
const login = require("./routes/login");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

if (!process.env.SEED) {
  throw new Error("Missing JWT seed");
}

// Usando middlewares para leer JSON y habilitar CORS
app.use(bodyParser.json());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["https://tu-dominio.com"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Rutas
app.use("/users", users);
app.use("/jokes", jokes);
app.use("/login", login);

// --Conectamos a la DB
console.log("Conectarse a la DB...");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// --Verificacion de conexion
db.on("error", (err) => {
  console.log("[ERROR] Connection to DB failed: ", err);
});
db.once("open", () => {
  console.log("[OK] Connected to DB successfully");
});

// Configuración del servidor (HTTP/HTTPS)
const keyPath = process.env.SSL_KEY_PATH;
const certPath = process.env.SSL_CERT_PATH;

if (keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const privateKey = fs.readFileSync(keyPath, "utf8");
  const certificate = fs.readFileSync(certPath, "utf8");
  const credentials = { key: privateKey, cert: certificate };
  https.createServer(credentials, app).listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`HTTP server running on port ${port}`);
  });
}
