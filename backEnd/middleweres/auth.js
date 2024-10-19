const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.get("authorization");
  
  // Manejar caso sin token
  if (!token) {
    return res.status(401).json({ ok: false, message: "Token no proporcionado" });
  }

  token = token.split(" ")[1]; // Extraer el token después de "Bearer"

  jwt.verify(token, process.env.SEED, (error, payload) => {
    if (error) {
      return res.status(401).json({ ok: false, error: "Token inválido" });
    }

    req.user = payload; // Opcional: guardar el payload en el objeto de solicitud
    next();
  });
};

module.exports = verifyToken;
