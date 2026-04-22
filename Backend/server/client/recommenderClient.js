import axios from "axios";

function createUserEmbedgingsAndStore(userId, interest) {

    axios.post("http://localhost:8000/api/interest", {
        user_id: userId,
        interest: interest
    });
}

function deleteUserEmbeddings(userId) {

    axios.delete("http://localhost:8000/api/delete", {
        params: {
            user_id: userId
        }
    });
}

// async function recommendUser(userId) {

//     const res = await axios.get("http://localhost:8000/api/recommend", {
//         params: {
//             user_id: userId
//         }
//     });

//     return res.data
// }

function userConnect(userId) {

    axios.get("http://localhost:8000/api/newuser", {
        params: {
            user_id: userId
        }
    });
}

function userDisconnect(userId) {

    axios.delete("http://localhost:8000/api/disconnect", {
        params: {
            user_id: userId
        }
    });
}

export {
    userConnect,
    userDisconnect,
    deleteUserEmbeddings,
    createUserEmbedgingsAndStore
}
