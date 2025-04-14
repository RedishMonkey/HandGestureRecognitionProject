import axios from "axios";

const baseURL = "http://localhost:3000";

export default axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    maxBodyLength: 50 * 1024 * 1024 * 1024,
    maxContentLength: 50 * 1024 * 1024 * 1024,
});
