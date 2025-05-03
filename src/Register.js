import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Register = ({ setLogin }) => {
    const [usernameValidated, setUsernameValidated] = useState(true);
    const [passwordValidated, setPasswordValidated] = useState(true);
    const [licenseKeyValidated, setLicenseKeyValidated] = useState(true);
    const [usernameFeedback, setUsernameFeedback] = useState("");
    const [passwordFeedback, setPasswordFeedback] = useState("");
    const [licenseKeyFeedback, setLicenseKeyFeedback] = useState("");
    const navigate = useNavigate();

    function checkInput() {
        const username = document.getElementById("authUsername");
        const password = document.getElementById("authPassword");
        const licenseKey = document.getElementById("authLicenseKey");
        if (!username.value) {
            setUsernameValidated(false);
            setUsernameFeedback("Please enter your username.");
        }
        if (!password.value) {
            setPasswordValidated(false);
            setPasswordFeedback("Please enter your password.");
        }
        if (!licenseKey.value) {
            setLicenseKeyValidated(false);
            setLicenseKeyFeedback("Please enter your license key.");
        }
        return username.value && password.value && licenseKey.value;
    }

    async function handleRegister() {
        if (!checkInput()) return;
        const usernameInput = document.getElementById("authUsername").value;
        const passwordInput = document.getElementById("authPassword").value;
        const licenseKeyInput = document.getElementById("authLicenseKey").value;
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
            body: JSON.stringify({ username: usernameInput, password: passwordInput, licenseKey: licenseKeyInput })
        });
        const data = await response.json();

        if (response.status === 200) {
            setUsernameValidated(true);
            setPasswordValidated(true);
            setLicenseKeyValidated(true);
            Cookies.set("username", usernameInput);
            alert("Registration successful!");
            setLogin(true);
            navigate("/");
        } else if (response.status === 400 && data.message === "Invalid license key.") {
            setLicenseKeyValidated(false);
            setLicenseKeyFeedback("Invalid license key.");
        } else {
            setUsernameValidated(response.status !== 409);
            setPasswordValidated(response.status === 409);
            setLicenseKeyValidated(true);
            setUsernameFeedback(response.status === 409 ? data.message : "");
            setPasswordFeedback(response.status !== 409 ? data.message : "");
        }
    }

    return (
        <div className="container my-4 d-flex align-items-center flex-column">
            <h1>Register</h1>
            <div className="col-lg-6 col-9">
                <form noValidate="novalidate">
                    <div className="form-group d-flex flex-column gap-2 m-2 my-4">
                        <div>
                            <label htmlFor="authUsername">Username</label>
                            <input
                                type="text"
                                className={`form-control ${!usernameValidated ? "is-invalid" : null}`}
                                id="authUsername"
                                required
                                onChange={() => {
                                    setUsernameValidated(true);
                                    setPasswordValidated(true);
                                    setLicenseKeyValidated(true);
                                }}
                            />
                            <div className="invalid-feedback">{usernameFeedback}</div>
                        </div>
                        <div>
                            <label htmlFor="authPassword">Password</label>
                            <input
                                type="password"
                                className={`form-control ${!passwordValidated ? "is-invalid" : null}`}
                                id="authPassword"
                                onChange={() => {
                                    setUsernameValidated(true);
                                    setPasswordValidated(true);
                                    setLicenseKeyValidated(true);
                                }}
                                required
                            />
                            <div className="invalid-feedback">{passwordFeedback}</div>
                        </div>
                        <div>
                            <label htmlFor="authLicenseKey">License Key</label>
                            <input
                                type="text"
                                className={`form-control ${!licenseKeyValidated ? "is-invalid" : null}`}
                                id="authLicenseKey"
                                onChange={() => {
                                    setUsernameValidated(true);
                                    setPasswordValidated(true);
                                    setLicenseKeyValidated(true);
                                }}
                                required
                            />
                            <div className="invalid-feedback">{licenseKeyFeedback}</div>
                        </div>
                    </div>
                    <div className="form-group m-2 my-4 d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-primary w-50"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-primary w-50"
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;