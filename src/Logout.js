import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = ({setLoggedIn}) => {
    const username = Cookies.get("username");
    const navigate = useNavigate();
    
    function logout() {
        alert("Logged out!");
        navigate("/login");
        Cookies.remove("username");
        setLoggedIn(false);
        
    }
    
    // Welcome username text + logout button
    return (
        <div style={{userSelect:"none"}} className="d-flex align-items-center form-inline navbar-text justify-content-end">
            <span className="text-nowrap">Welcome, {username}!</span>
            <button className="btn btn-link p-0 mx-2" onClick={() => logout()}>Logout</button>
        </div>

    )
};

export default Logout;