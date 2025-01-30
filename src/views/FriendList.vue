<template>
    <div>
      <h1>Friend List</h1>
      <ul>
        <li v-for="invite in invites" :key="invite.id">
          <p>{{ invite.lobby_code }} (ID: {{ invite.player_id }})</p>
          <p>Status: {{ invite.invited ? 'Invited' : 'Not Invited' }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
//   import Echo from 'laravel-echo';
//   import Pusher from 'pusher-js';
  
  export default {
    data() {
      return {
        invites: [], // Menyimpan daftar undangan
        userId: 24, // Gantilah dengan ID user yang sedang login
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3BsYXllcnNMb2dpbiIsImlhdCI6MTczODE2ODkzNCwiZXhwIjoyMjY2NTEzNjYxMzU0LCJuYmYiOjE3MzgxNjg5MzQsImp0aSI6IlZBTnJDZFlUY25MVmM3ODgiLCJzdWIiOiIyNCIsInBydiI6IjM3YjdjNTBiMjUwNDFhNGMyMGZlNDdjMjQyZTFiZmQwZjYzMDkyYzUifQ.6EtkIL3T4Vg2AjYmM_rYAzg80ToOU56zDDeEph1BWpY", // Token yang diberikan
      };
    },
    mounted() {
    console.log("🟢 Mounting FriendList.vue...");

    setTimeout(() => {
        if (!window.Echo) {
            console.error("❌ Echo is not initialized yet.");
            return;
        }
        console.log("✅ Echo is initialized, listening for updates...");
        this.listenForFriendUpdates();
    }, 2000); // Delay 2 detik untuk memastikan Echo sudah siap

    // Cek apakah WebSocket bisa konek
    let socket = new WebSocket("ws://localhost:6001");
    socket.onopen = function() {
        console.log("✅ WebSocket Connected!");
    };
    socket.onerror = function(error) {
        console.error("❌ WebSocket Error:", error);
    };
},
    methods: {
      // Mendapatkan daftar teman dari API dengan Bearer Token
      async getFriendList() {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/friendlist-invites", {
            headers: {
              Authorization: `Bearer ${this.token}`, // Gunakan Bearer token
            },
          });
  
          const data = await response.json();
          console.log(data);
          this.invites = data.data; // Menyimpan data teman yang diterima dari API
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      },
  
      // Mendengarkan update friendlist dengan Pusher
      listenForFriendUpdates() {
    if (!window.Echo) {
        console.error("❌ Echo is not initialized yet.");
        return;
    }

    window.Echo.private('friend-invites-updates.' + this.userId)
        .listen('FriendInvitesUpdated', (event) => {
            console.log('✅ Friend invite updates:', event.invites);
            this.invites = event.invites;
        });
}
    },
  };
  </script>
  
  <style scoped>
  /* CSS jika diperlukan */
  </style>