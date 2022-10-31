import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LogoutComp(props) {
    
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("user_token")
        props.setTokenState(null)
        if (localStorage.getItem("user_token") !== null) {
            toast.error("Logout unsuccessful, please try again")
        } else {
            toast.success("Logout successful!");
            navigate("/login");
        }
    }    
    
    return(
        <div variant="danger" onClick={logout}>Logout</div>
    )
}

export default LogoutComp; 