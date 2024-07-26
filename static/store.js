console.log("vuex")

const store = new Vuex.Store({
    state: {
        currentUser: "",
        currentUserRole: "",
        isLoggedIn: false,
        access_token: localStorage.getItem("access_token") || "",
        searchResults: {
            book_searched: [],
            section_searched: [],
            author_searched: []
          },
    },
    mutations: {
        setLogin(state) {
            state.isLoggedIn = true;
            state.access_token = localStorage.getItem("access_token");
        },
        logout(state) {
            state.isLoggedIn = false;
            localStorage.removeItem('access_token');
        },
        setUser(state, user) {
            state.currentUser = user;
        },
        setRole(state, role) {
            state.currentUserRole = role;
        },
        setSearchResults(state, results) {
            state.searchResults = results;
        },
    },
    actions: {
        async fetchUser({ commit }) {
            const token = localStorage.getItem("access_token");
            if (token) {
                const url = "http://localhost:5000/api/login";
                try {
                    const res = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer" + " " + token,
                        },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        commit("setUser", data.name);
                        commit("setLogin");
                        commit("setRole", data.role);
                    } else {
                        commit("logout");
                    }
                } catch (e) {
                    console.error("error while fetching", e)
                }
            }
        }
    },
})

store.dispatch("fetchUser");

export default store;
