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


const routes = [
    {path : "/", component: Home},
    {path : "/login", component: Login},
    {path : "/signup", component: Signup},
    {path : "/dashboard", component: Dashboard},
    {path : "/explore", component: Explore},
    {path : "/mybooks", component: Mybooks},
    {path : "/admin_dashboard", component: AdminDashboard},
    {path: "/requests", component: Requests},
    {path: "/enrolls", component: Enrolls},
    {path: "/allbooks", component: AllBooks},
    {path: "/allusers", component: AllUsers},
    {path: "/adminsection", component: Section},
    {path: "/category", component: Category},
    {path: "/profile", component: Profile},
    {path: "/search", component: Search},
    
];


const router = new VueRouter({
    routes,
})

export default router;