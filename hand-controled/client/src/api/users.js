import api from "./api";

export const setProfileImg = async (profileImg) => {
    try {
        const response = await api.post("/set-profile-img", { profileImg })
        ;
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            console.log(error.response.data.message);
            return;
        }
        if (error.message) {
            console.log(error.message);
            return;
        }

        console.log("an error occurred: ",error);
    }
}

export const getProfileImg = async () => {
    try {
        const response = await api.get("/get-profile-img");
        const profileImgURL = response.data.profileImg;

        return profileImgURL;

    } catch (error) {
        if (error.response?.data?.message) {
            console.log(error.response.data.message);
            return;
        }
        if (error.message) {
            console.log(error.message);
            return;
        }
        
        console.log("an error occurred: ",error);
    }
}

export const removeRobot = async (macAddress) => {
    try {
        const response = await api.post("/remove-robot", { macAddress });
        
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            console.log(error.response.data.message);
            return;
        }
        if (error.message) {
            console.log(error.message);
            return;
        }
        
        console.log("an error occurred: ",error);
    }
}

export const setRobotNickname = async (macAddress, nickname) => {
    try {
        const response = await api.post("/set-robot-nickname", { macAddress, nickname });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            console.log(error.response.data.message);
            return;
        }
        if (error.message) {
            console.log(error.message);
            return;
        }
        
        console.log("an error occurred: ",error);
    }
}

export const setRobotState = async (macAddress, state) => {
    try {
        await api.post("/set-robot-state", { macAddress, state });
    } catch (error) {
        if (error.response?.data?.message) {
            console.log(error.response.data.message);
            return;
        }
        if (error.message) {
            console.log(error.message);
            return;
        }
        
        console.log("an error occurred: ",error);
    }
}

