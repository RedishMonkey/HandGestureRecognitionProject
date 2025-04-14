import api from "./api";

export const getUsersLinkReqs = async (username) => {
    try {
        const response = await api.post('/get-users-link-reqs',{ username });

        return response.data;
    } catch (error) {
        console.log(error.response.data);
    }
};

export const getUsersRobots = async (username) => {
    try {
        const response = await api.post('/get-users-robots',{ username });

        return response.data.robots;
    } catch (error) {
        if (error.response?.data?.message) {
            console.log(error.response.data.message);
            return;
        }
        if (error.message) {
            console.log(error.message);
            return;
        }
    }
}


export const acceptLinkReq = async (username, macAddress) => {
    try {
        await api.post('/accept-link-req', { username, macAddress });

    } catch (error) {
        if (error.response?.data?.message) {
            console.log(error.response.data.message);
        }
        else {
            console.log("error: ", error);
        }
    }
}


export const denyLinkReq = async (username, macAddress) => {
    try {
        const response = await api.post('/deny-link-req', { username, macAddress });
        
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}