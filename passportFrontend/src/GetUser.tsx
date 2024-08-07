import  { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  OauthId: string;
  userName: string;
  fullName: string;
}

const GetUser = () => {
  const { token,logout }: any = useAuth();
  const [user, setUser] = useState<User | null>();
  const[error,setError] = useState<string|null>()
  const navigate = useNavigate()
  const fetchData = async () => {
    const response = await axios.get("http://localhost:3000/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("Response: ", response.data);
    setUser(response.data.data);
  };

  const handleLogout = async() => {

    const response = await axios.get('http://localhost:3000/auth/logout',{
      headers:{
        "Authorization":`Bearer ${token}`
      },
      withCredentials:true
    })

    if(!(response.status === 200)){
        setError('You cannot logout!')
    }

      logout()

    navigate('/')

  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>
        {user?.OauthId}
        <br />
        {user?.fullName}
        <br />
        {user?.userName}
      </h1>
      <button onClick={() => handleLogout()}>
        Logout
      </button>
      <h1>{error? error : <></>}</h1>
    </>
  );
};

export default GetUser;
