import { createRouter, createWebHistory } from "vue-router";
import FriendList from "../views/FriendList.vue";

const routes = [
  { path: "/friendlist", component: FriendList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
