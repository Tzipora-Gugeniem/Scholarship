import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001', // הכתובת של שרת ה-Node.js שלך
    withCredentials: true,             // חובה! כדי שהעוגיות (Token) יעברו בין השרת ללקוח
});

export default api;