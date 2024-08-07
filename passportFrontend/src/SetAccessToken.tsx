import {useEffect} from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext/AuthContext'
import { useNavigate } from 'react-router-dom'

const SetAccessToken = () => {
   const {login}:any = useAuth()
   const navigate = useNavigate()
    const fetchData = async()=>{
        const response = await axios.get("http://localhost:3000/set-accessToken",{withCredentials:true,})
        console.log("Response: ",response.status);
        if(response.status === 200){
            login(response.data.data)
            navigate('/get-user')
        }else{
            console.log("ERROR");
            
            navigate('/')
        }
    }
    useEffect(()=>{
        
        fetchData()
        
    },[])
    
    
  return (<> Loading ...</>)
}

export default SetAccessToken