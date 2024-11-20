// configURL.js
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'http://217.160.2.20'  // URL en producción
  : 'http://localhost:3001'; // URL en desarrollo

export default apiUrl;
