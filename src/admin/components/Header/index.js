import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import "./index.css";
function Header() {
    let getSession = JSON.parse(sessionStorage.getItem("admin"));
    const handleLogout = () => {
        sessionStorage.removeItem("admin");
        window.location.href = "/admin";
    };
    return (
        <div>
            <div className="header">
                <DropdownButton id="dropdown-basic-button" title={getSession.username} className="float-right mr-3" style={{ border: "1px solid #eee", borderRadius: 4 }}>
                    <Dropdown.Item onClick={handleLogout}> Log out </Dropdown.Item>
                </DropdownButton>
            </div>
        </div>
    );
}

export default Header;
