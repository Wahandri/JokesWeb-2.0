// configURL.js
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://wahandri.es'  // URL en producción
  : 'http://localhost:3001'; // URL en desarrollo

export default apiUrl;
