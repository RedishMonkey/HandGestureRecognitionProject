import api from "./api";


export const signIn = async (payload) => {
  try {
    const response = await api.post("/sign-in", payload);

    // axios automatically checks if the status code is an error status code and throws an error
    return { success: true };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "An error occurred during sign up";
    console.log(errorMessage);
    return { success: false, message: errorMessage };
  }
};

export const signUp = async (username, password) => {
  try {

    const response = await api.post("/auth/signup", { username, password });

    // axios automatically checks if the status code is an error status code and throws an error    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred during sign up";
    console.log(errorMessage);
    return { success: false, message: errorMessage };
  }
};

export const signOut = async () => {
  try {
    const { data } = await api.post("/sign-out");

    window.location.href = "/";

    return data;
  } catch (error) {
    console.error(error);

    const message =
      error.response?.data?.message ||
      "An error occurred while signing out. Please try again.";
    throw new Error(message);
  }
};

export const me = async () => {
  try {
    const { data } = await api.get("/me");
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred during sign up";
    console.log("Error in me call:", errorMessage);
    return null;
  }
};
