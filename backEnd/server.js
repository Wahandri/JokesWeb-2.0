const dotenv = require("dotenv"); 
dotenv.config();

const fs = require('fs');
const https = require('https');
const users = require("./routes/users");
const jokes = require("./routes/jokes");
const login = require("./routes/login");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const cors = require("cors");
const bodyParser = require("body-parser");

// Usando middlewares para leer JSON y habilitar CORS
app.use(bodyParser.json());

app.use(cors({
    origin: ["https://jokes-web.vercel.app", "https://jokes-web-2-0.vercel.app"], // Orígenes permitidos
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permite todos los métodos
    allowedHeaders: ["Content-Type", "Authorization"], // Permite encabezados específicos
    credentials: true // Si necesitas cookies o encabezados de autorización
}));

// Rutas
app.use("/users", users);
app.use("/jokes", jokes);
app.use("/login", login);

// --Conectamos a la DB
console.log("Conectarse a la DB...");
mongoose.connect(process.env.MONGO_URL, {
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

// Secreto para firmar y verificar tokens
const SEED =
  process.env.SEED ||
  "4b343153cf67b908b5b57cf85d2e06c33cd846efa04299ecb88a77fb6af652098651c83079ad8ec68657cb15a6e34f532fcee4b1e067993e55252660ffe60907";

// Leer certificados SSL
const privateKey = fs.readFileSync('/etc/ssl/private/private.key', 'utf8');
const certificate = fs.readFileSync('/etc/ssl/certs/certificate.crt', 'utf8');
const ca = certificate; // Los certificados autofirmados no necesitan CA


const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

// Crear el servidor HTTPS
const httpsServer = https.createServer(credentials, app);

// Iniciar el servidor HTTPS
httpsServer.listen(3001, () => {
    console.log('Servidor HTTPS corriendo en el puerto 3001');
});
