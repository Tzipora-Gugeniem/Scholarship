import axios from 'axios';

const api = axios.create({
    baseURL: '/api/', // הכתובת של שרת ה-Node.js
    withCredentials: true,             // חובה! כדי שהעוגיות (Token) יעברו בין השרת ללקוח
});

export default api;
