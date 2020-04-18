import React, { useEffect, useState, useRef } from "react";
import { requestAPI } from "../../utils/api";
import SpinnerView from "../../components/SpinnerView";
function Login() {
    const refUserName = useRef();
    const refPassword = useRef();
    const [isProcessing, setProcessing] = useState(false);

    const handleClickLogin = async () => {
        let userName = refUserName.current.value;
        let password = refPassword.current.value;
        if (!userName || !password) {
            alert("Please enter username or password");
            return;
        }
        setProcessing(true);
        await requestAPI("/admin/login", "POST", { username: userName, password: password })
            .then((res) => {
                if (res.status === 1) {
                    sessionStorage.setItem("admin", JSON.stringify(res.data));
                    window.location.href = "/admin";
                } else {
                    alert(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setProcessing(false);
    };
    return (
        <div className="login_wrapper">
            <div className="login_content">
                <h2>
                    <span>Commerciale4.0</span>
                </h2>
                <div className="pt-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        ref={refUserName}
                    />
                </div>
                <div className="pt-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        ref={refPassword}
                    />
                </div>
                <div className="pt-3">
                    <button className="btn btn-default" onClick={handleClickLogin}>
                        Log in
                    </button>
                </div>
                <hr></hr>
            </div>
            {isProcessing && <SpinnerView />}
        </div>
    );
}

export default Login;
