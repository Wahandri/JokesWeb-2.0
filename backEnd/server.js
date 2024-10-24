const dotenv = require("dotenv"); 
dotenv.config();

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
//  app.use(cors());

app.use(cors({
    origin: "https://jokes-web.vercel.app/", // Cambia esto a la URL de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permite todos los métodos
    allowedHeaders: ["Content-Type", "Authorization"], // Permite encabezados específicos
    credentials: true // Si necesitas cookies o encabezados de autorización
}));

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

// Escuchando en el puerto
app.listen(3001, "0.0.0.0", () => {
  console.log('Conexion con el puerto:', port);
});
