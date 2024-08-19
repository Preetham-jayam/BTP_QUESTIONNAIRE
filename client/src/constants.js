let BASE_URL;

if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://btp-questionnaire.onrender.com';
} else {
    BASE_URL = 'http://localhost:5003';
}

export {BASE_URL}