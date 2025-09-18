import axios from 'axios';

// Avoid dotenv side-effects; let consumers set BASE_URL if needed.
const baseURL = process.env.BASE_URL || 'https://mangapark.to';

export const client = axios.create({
  baseURL,
  headers: {
    Origin: 'https://mangapark.to',
    Referer: 'https://mangapark.to/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  },
});
