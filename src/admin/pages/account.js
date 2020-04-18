import React, { useEffect, useState, useRef } from "react";
import { InputGroup, FormControl, Button, Alert } from "react-bootstrap";
import { requestAPI } from "../../utils/api";
import SpinnerView from "../../components/SpinnerView";
import * as Validate from "../../utils/Validate";

function Account() {
    const [isProcessing, setProcessing] = useState(false);
    const [alertData, setAlertData] = useState(null);
    const refName = useRef();
    const refOldPassword = useRef();
    const refNewPassword = useRef();
    const refConfirmPassword = useRef();

    const setAlert = (success, text) => {
        setAlertData({ variant: success ? "success" : "danger", text: text });
    };

    const validate = () => {
        let valid = Validate.checkEmpty(refName.current.value);
        Validate.applyToInput(refName.current, valid.code);
        // refName.current.style.border = "1px solid #ced4da";
        if (valid.code !== Validate.VALID) {
            setAlert(0, "Username " + valid.msg);
            return false;
        }

        valid = Validate.checkEmpty(refOldPassword.current.value);
        Validate.applyToInput(refOldPassword.current, valid.code);
        if (valid.code !== Validate.VALID) {
            setAlert(0, "Old password " + valid.msg);
            return false;
        }

        valid = Validate.checkEmpty(refNewPassword.current.value);
        Validate.applyToInput(refNewPassword.current, valid.code);
        if (valid.code !== Validate.VALID) {
            setAlert(0, "New password " + valid.msg);
            return false;
        }

        valid = Validate.checkEmpty(refConfirmPassword.current.value);
        Validate.applyToInput(refConfirmPassword.current, valid.code);
        if (valid.code !== Validate.VALID) {
            setAlert(0, "Confirm password " + valid.msg);
            return false;
        }

        return true;
    };

    const handleClickOk = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        let userName = refName.current.value;
        let oldPassword = refOldPassword.current.value;
        let newPassword = refNewPassword.current.value;
        let confirmPassword = refConfirmPassword.current.value;
        let getSession = JSON.parse(sessionStorage.getItem("admin"));

        if (oldPassword !== getSession.password) {
            setAlert(0, "Current password is not correct.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setAlert(0, "Confirm password does not match.");
            return;
        }

        setProcessing(true);
        await requestAPI("/admin/modify-account", "POST", {
            oldUserName: getSession.username,
            newUserName: userName,
            password: newPassword,
        })
            .then((res) => {
                if (res.status === 1) {
                    sessionStorage.removeItem("admin");
                    alert("Account has been updated. You should login again.");
                    window.location.href = "/admin";
                } else {
                    alert(res.data);
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setProcessing(false);
    };

    const handleClickCancel = (e) => {
        refName.current.value = null;
        refOldPassword.current.value = null;
        refNewPassword.current.value = null;
        refConfirmPassword.current.value = null;
    };

    return (
        <div>
            <div className="alert">{alertData && <Alert variant={alertData.variant}>{alertData.text}</Alert>}</div>
            <div className="container justify-content-center d-flex" style={{ height: "100vh" }}>
                <div className="admin-form">
                    <InputGroup className="mb-3 justify-content-center">
                        <FormControl placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" className="w-input" ref={refName} />
                    </InputGroup>
                    <InputGroup className="mb-3 justify-content-center">
                        <FormControl
                            placeholder="Old Password"
                            aria-label="OldPassword"
                            aria-describedby="basic-addon1"
                            type="password"
                            className="w-input"
                            ref={refOldPassword}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3 justify-content-center">
                        <FormControl
                            placeholder="New Password"
                            aria-label="NewPassword"
                            aria-describedby="basic-addon1"
                            className="w-input"
                            ref={refNewPassword}
                            type="password"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3 justify-content-center">
                        <FormControl
                            placeholder="Confirm Password"
                            aria-label="ConfirmPassword"
                            aria-describedby="basic-addon1"
                            className="w-input"
                            ref={refConfirmPassword}
                            type="password"
                        />
                    </InputGroup>
                    <div className="text-center pt-4">
                        <Button variant="warning" className="mr-3" onClick={handleClickCancel}>
                            Cancel
                        </Button>
                        <Button variant="success" className="ml-3" onClick={handleClickOk}>
                            Ok
                        </Button>
                    </div>
                </div>
            </div>
            {isProcessing && <SpinnerView />}
        </div>
    );
}

export default Account;
