export const requestAPI = async (path, method, data) => {
    return await fetch(`/.netlify/functions/api${path}`, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
            return { status: 0, message: "Connection failed!" };
        })
        .catch(err => {
            return { status: 0, message: "Connection failed" };
        });
};
