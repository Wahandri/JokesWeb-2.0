// configURL.js
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://54.38.184.19:3001'  // URL en producción
  : 'http://localhost:3001'; // URL en desarrollo

export default apiUrl;
