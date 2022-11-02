import {Navigate} from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { DateTime } from "luxon";

function Auth(props) {
    // write our auth checking logic here in a single place

    // retrieve token from local storage 
    const token = localStorage.getItem('user_token')
    
    // if it does not exist, redirect to login page 
    if (!token) {
        return (
            <Navigate to={'/login'} />
        )
    }

    // if it exists, check if token expired
    // if expired, purge local storage, redir to login page 
    // if token exp ok, render props.component 
    const user = jwt_decode(token)

    const now = DateTime.now().toUnixInteger()

    if (user.exp < now) {
        localStorage.removeItem('user_token')
        return (
            <Navigate to={'/login'} />
        )
    }

    return (
        // props.component refers to components that is put in on app.jsx
        <props.component socket={props.socket}>
            
        </props.component>
    )
}

export default Auth