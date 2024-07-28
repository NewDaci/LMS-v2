console.log("vue-router3")

import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Dashboard from "./pages/Dashboard.js";
import Explore from "./pages/Explore.js";
import Mybooks from "./pages/Mybooks.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import Requests from "./pages/admin/Requests.js";
import Enrolls from "./pages/admin/Enrolls.js";
import AllBooks from "./pages/admin/AllBooks.js";
import AllUsers from "./pages/admin/AllUsers.js";
import Section from "./pages/admin/Section.js";
import Category from "./pages/Category.js";
import Profile from "./pages/Profile.js";
import Search from "./pages/Search.js";
import NotFound from "./components/NotFound.js";

import store from "./store.js";


const routes = [
    { path: "*", component: NotFound },
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/dashboard", component: Dashboard},
    { path: "/explore", component: Explore, meta: { role: "user" } },
    { path: "/mybooks", component: Mybooks, meta: { role: "user" } },
    { path: "/admin_dashboard", component: AdminDashboard, meta: { role: "librarian" } },
    { path: "/requests", component: Requests, meta: { role: "librarian" } },
    { path: "/enrolls", component: Enrolls, meta: { role: "librarian" } },
    { path: "/allbooks", component: AllBooks, meta: { role: "librarian" } },
    { path: "/allusers", component: AllUsers, meta: { role: "librarian" } },
    { path: "/adminsection", component: Section, meta: { role: "librarian" } },
    { path: "/category", component: Category, meta: { role: "user" } },
    { path: "/profile", component: Profile, meta: { role: "user" } },
    { path: "/search", component: Search, meta: { role: "user" } },
];


const router = new VueRouter({
    routes,
});

// navigation guards
router.beforeEach(async (to, from, next) => {

    let userRole = store.state.currentUserRole;

    if (!userRole) {
        await store.dispatch('fetchUser');
        userRole = store.state.currentUserRole;
    }

    if (userRole === 'librarian') {
        next();
    }else if (to.meta.role && userRole !== to.meta.role) {
        alert("You do not have permission to access this page.");
        next(from.fullPath);
    }else {
        next();
    }
});

export default router;