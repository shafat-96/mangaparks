import cors from "cors";

const PORT = process.env.PORT
const MY_API_URL = process.env.MY_API_URL
console.log({ PORT, MY_API_URL })

export const corsConfig = cors({ origin: MY_API_URL ? [MY_API_URL, `http://localhost:${PORT}`] : "*" })