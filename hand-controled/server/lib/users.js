const { getAllUsers } = require('./firebaseUtils');


const userExists = async (username) => {
    if (!username) {
        throw new Error('Username is required');
    }
    
    try {
        const users = await getAllUsers();

        if (!users) return false;
        
        // Check if any user in the Firebase database has the given username
        return Object.keys(users).some(user => user === username);
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}




module.exports = {
    userExists
};
