import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

async function initEcho() {
    const token = await getAuthToken(); // Ambil token JWT yang valid
    console.log(token);

    if (!token) {
        console.error("❌ Token not found. Echo initialization aborted.");
        return;
    }

    window.Echo = new Echo({
        broadcaster: "pusher",
        key: "ecfd0fba473e11d60d3a",
        cluster: "ap1",
        forceTLS: true,
        authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
        auth: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });

    console.log("✅ Echo initialized successfully!");
    window.dispatchEvent(new Event("echo-ready"));
}

initEcho();

const app = createApp(App);
app.use(router);
app.mount("#app");

async function getAuthToken() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/playersLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email_or_username: "behkm66",
                password: "password",
            }),
        });

        const data = await response.json();
        console.log(data.data.token);

        return data.data.token; // Pastikan API mengembalikan token yang benar
    } catch (error) {
        console.error("❌ Error fetching auth token:", error);
        return null;
    }
}