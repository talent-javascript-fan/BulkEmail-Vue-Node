import { createWebHistory, createRouter } from "vue-router";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
// lazy-loaded
const Emails = () => import("./components/Emails.vue")
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/emails",
    name: "emails",
    // lazy-loaded
    component: Emails
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;