import { createWebHistory, createRouter } from "vue-router";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import AddEmail from "./components/AddEmail.vue";
import Emails from "./components/EmailsList.vue";
import Email from "./components/Email.vue";

const routes = [
	{
		path: "/",
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
		path: "/addEmail",
		component: AddEmail,
	},
	{
		path: "/emails",
		name: "emails",
		component: Emails,
	},
	{
		path: "/emails/:id",
		component: Email
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
