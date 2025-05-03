import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = ({setLogin}) => {
    const [usernameValidated, setUsernameValidated] = useState(true);
    const [passwordValidated, setPasswordValidated] = useState(true);
    const [usernameFeedback, setUsernameFeedback] = useState("");
    const [passwordFeedback, setPasswordFeedback] = useState("");
    const navigate = useNavigate();

    function checkInput() {
        const username = document.getElementById("authUsername");
        const password = document.getElementById("authPassword");
        if (!username.value) {
            setUsernameValidated(false);
            setUsernameFeedback("Please enter your username.");
        }
        if (!password.value) {
            setPasswordValidated(false);
            setPasswordFeedback("Please enter your password.");
        }
        return username.value && password.value;
    }

    async function handleLogin() {
        if (!checkInput()) return;
        const usernameInput = document.getElementById("authUsername").value;
        const passwordInput = document.getElementById("authPassword").value;

        const response = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        const data = await response.json();

        if (response.status === 200) {
            Cookies.set("username", usernameInput);
            alert("Login successful!");
            setLogin(true);
            //await fetch("http://localhost:3001/api/initial");
            navigate("/");
        } else {
            setUsernameValidated(false);
            setPasswordValidated(false);
            setUsernameFeedback("");
            setPasswordFeedback(data.message);
        }
    }

    async function handleRegister() {
        if (!checkInput()) return;
        const usernameInput = document.getElementById("authUsername").value;
        const passwordInput = document.getElementById("authPassword").value;
        const usernameRegex = /^[A-Za-z0-9]{4,16}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;

        if (!usernameRegex.test(usernameInput) || !passwordRegex.test(passwordInput)) {
            setUsernameValidated(usernameRegex.test(usernameInput));
            setPasswordValidated(passwordRegex.test(passwordInput));
            setUsernameFeedback(usernameRegex.test(usernameInput) ? "" : "Username must be 4-16 characters long and contain only letters and numbers.");
            setPasswordFeedback(passwordRegex.test(passwordInput) ? "" : "Password must be 8-16 characters long and contain at least one letter and one number.");
            return;
        }

        const response = await fetch("http://localhost:3001/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        const data = await response.json();

        if (response.status === 200) {
            setUsernameValidated(true);
            setPasswordValidated(true);
            Cookies.set("username", usernameInput);
            alert("Registration successful!");
            setLogin(true);
            //await fetch("http://localhost:3001/api/initial");
            navigate("/");
        } else {
            setUsernameValidated(response.status !== 409);
            setPasswordValidated(response.status === 409);
            setUsernameFeedback(response.status === 409 ? data.message : "");
            setPasswordFeedback(response.status !== 409 ? data.message : "");
        }
    }

    return (
        <div className="container my-4 d-flex align-items-center flex-column">
            <h1>Welcome!</h1>
            <div className="col-lg-6 col-9">
                <form noValidate="novalidate">
                    <div className="form-group d-flex flex-column gap-2 m-2 my-4 ">
                        <div>
                            <label htmlFor="authUsername">Username</label>
                            <input type="text" className={`form-control ${!usernameValidated ? "is-invalid" : null}`} id="authUsername" required onChange={() => { setUsernameValidated(true); setPasswordValidated(true); }} />
                            <div className="invalid-feedback">{usernameFeedback}</div>
                        </div>
                        <div>
                            <label htmlFor="authPassword">Password</label>
                            <input type="password" className={`form-control ${!passwordValidated ? "is-invalid" : null}`} id="authPassword" onChange={() => { setUsernameValidated(true); setPasswordValidated(true); }}
                                required />
                            <div className="invalid-feedback">{passwordFeedback}</div>
                        </div>
                    </div>
                    <div className="form-group m-2 my-4 d-flex gap-2">
                        <button type="button" className="btn btn-primary w-50" onClick={handleLogin}>Login</button>
                        <button type="button" className="btn btn-outline-primary w-50" onClick={() => navigate("/register")}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;