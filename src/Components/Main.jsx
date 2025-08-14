import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from './JWT'

const Main = () => {

    const [FormData, setFormData ] = useState({
        Username:'',
        Password:''
    })

    const navigate = useNavigate();

    const FormHandler = async (e) => {
        e.preventDefault()
        let {Username , Password} = FormData

        if (!Username || !Password) {
            toast.error("Fill all Data");
            return;
        }

        try {
            const res = await api.post("/Login", { ...FormData }); // ✅ wait for the response
            const data = res.data;
            const Status = data.Status;
            const Token = data.access_token;
            const Message = data.Message;
            console.log("Login Response", data);
            
            if (Status === "Success" && Token) {
                localStorage.clear()
                localStorage.setItem("access_token", Token);
                navigate("/Dashboard", {replace:true});
                toast.success(Message || "Login Successful");
            } else if (Status === "Warning"){
                toast.warn(Message || "Warning Message");
            }else{
                 toast.error(Message || "Error Message");
            }
        
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.Message) ||
                error.message ||
                "Something went wrong";
            toast.error(message);
        }
    }

    const ChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(()=>{
        localStorage.clear()
    },[])

    return(
        <>
            <form onSubmit={FormHandler} className='container'>
                <div className="mb-3">
                    <label htmlFor="Username" className="form-label">Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="Username" 
                        name='Username'
                        value={FormData.Username}
                        onChange={ChangeHandler}  
                        required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="Password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="Password" 
                        name='Password'
                        value={FormData.Password}
                        onChange={ChangeHandler}  
                        required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </>
    )
}

export default Main;