import {createContext, useState, useContext, useEffect} from 'react';
import {me} from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    // const [isPending, startTransition] = useState(true);
    
    const navigate = useNavigate();

    const isTokenExpired = (expireTime) => {
        if(!expireTime || expireTime < Date.now()/1000){
            return true;
        }

        return false;
    }

    const checkAuth = async () => {
        try{
            const userData = await me();


            if(!userData?.exp){
                throw new Error('User not logged in');
            }

            if(!userData?.exp || isTokenExpired(userData.exp)){
                throw new Error('Token expired');
            }

            setUser(userData);
            setIsSignedIn(true);
        } catch(error){
            console.log('Error fetching user data:', error);
            setIsSignedIn(false);  
            setUser(null);
            navigate('/');
        }
        finally{
            // setIsPending(false);
        }
    }

    
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user, isSignedIn, setIsSignedIn, setIsSignedIn}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);