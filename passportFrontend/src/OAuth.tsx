import React, { useEffect } from 'react'
import axios from 'axios'
import { json } from 'react-router-dom'
const OAuth = () => {

const fetchData= async() => {
    const response = await axios.get("http://localhost:3000/auth/set-accessToken",{responseType:'json'})

    console.log("Response: ",response.data);
    
}

    useEffect(()=>{
        fetchData()
    },[])
  return null
}

export default OAuth