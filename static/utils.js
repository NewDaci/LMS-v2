

async function fetchHTTP(method, endpoint) {
    const token = localStorage.getItem("access_token");
    if (token) {
        const url = "http://localhost:5000" + endpoint;
        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": "Bearer" + " " + token,
                },
            });
            if (res.ok) {
                const data = await res.json();
                return data;
            } else {
                return (res.error);
            }
        } catch (e) {
            return e
        }
    }
};

export default fetchHTTP;