import {createContext, useState, useContext, useEffect, useCallback} from 'react';
import { me } from '../api/auth';
import { useNavigate } from 'react-router-dom';
// import { useIsPending } from '../hooks/useIsPending';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [isPending, setIsPending] = useState(true);
    

    const startPending = useCallback(() => {
      setPendingCount(prev => {
        const newCount = prev + 1;
        setIsPending(newCount > 0);
        return newCount;
      });
    }, []);
  

    const endPending = useCallback(() => {
      setPendingCount(prev => {
        const newCount = Math.max(0, prev - 1);
        setIsPending(newCount > 0);
        return newCount;
      });
    }, []);

    const navigate = useNavigate();

    const isTokenExpired = (expireTime) => {
        if(!expireTime || expireTime < Date.now()/1000){
            return true;
        }

        return false;
    }

    const checkAuth = async () => {
        try{
            startPending();
            const userData = await me();

            if(!userData?.exp){
                console.log("No exp field in userData");
                throw new Error('User not logged in');
            }

            if(!userData?.exp || isTokenExpired(userData.exp)){
                console.log("Token expired or missing");
                throw new Error('Token expired');
            }

            setUser(userData);
            setIsSignedIn(true);
        } catch(error){
            console.log('Error in checkAuth:', error);
            setIsSignedIn(false);  
            setUser(null);
            navigate('/');
        }
        finally{
            endPending();
        }
    }

    
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user, isSignedIn, setIsSignedIn, isPending, startPending, endPending }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);