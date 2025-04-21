import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ResetPassword.css";

function ResetPassword() {
    const [createPassword, setCreatePassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (createPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,  // The user's email
                    newPassword: createPassword,  // The new password entered by the user
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                console.log("Password reset successful");
                navigate("/interests");  // Redirect to the interests page
            } else {
                setErrorMessage(data.message || "Failed to reset password");
            }
        } catch (error) {
            setErrorMessage("An error occurred while resetting the password.");
            console.error(error);
        }
    };

    return (
        <div className="resetpassword">
            <h1>Reset Password</h1>
            <form onSubmit={handleResetPassword}>
                <label>Create Password:</label>
                <input
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                />
                <label>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ResetPassword;
