import { createContext, useContext, useState } from "react";

interface AuthContextType {
    token: string | null;
    login:(token:string) => void,
    logout:()=>void
}

const AuthContext = createContext<AuthContextType|undefined>(undefined)

export const useAuth = ()=>{
    const context = useContext(AuthContext)

    if(context === undefined){
        return
    }

    return context
}



export const AuthProvider = ({children}:any)=>{
    const [token,setToken] = useState<string|null>(null)

    const login = (token:string) => {
        setToken(token)
    }
    
    const logout = () => {
        setToken(null)
    }
    
    return(
        <AuthContext.Provider value={{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}