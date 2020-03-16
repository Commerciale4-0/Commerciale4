import React, { Component } from "react";
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import "./index.css";
import Sidebar from "../Sidebar";

const menusInNotLoggedin = [
    { id: 1, title: "Log in", link: "/login" },
    { id: 2, title: "Register", link: "/register" }
];

const menusInLoggedin = [
    { id: 1, title: "Profile", link: "/profile" },
    { id: 2, title: "Log out", link: "/" }
];

export default class Header extends Component {
    state = {
        isExpanded: false
    };

    handleClickExpand = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };

    handleDidCollapse = () => {
        this.setState({
            isExpanded: false
        });
    };

    handleClickMenu = menu => {
        if (menu.link === "/") {
            sessionStorage.removeItem("userEmail");
        }
        window.location.href = menu.link;
    };

    handleClickLogout() {
        sessionStorage.removeItem("userEmail");
        window.location.href = "/";
    }

    handleClickLogin() {
        window.location.href = "/";
    }

    handleClickRegister() {
        window.location.href = "/register";
    }

    handleClickProfile() {}
    render() {
        const { isExpanded } = this.state;
        let userEmail = sessionStorage.getItem("userEmail");
        let menus = userEmail ? menusInLoggedin : menusInNotLoggedin;
        const sideBar = (
            <Sidebar
                isExpanded={isExpanded}
                handleCollapse={this.handleDidCollapse}
            >
                {menus.map(menu => (
                    <div
                        key={menu.id}
                        className="item"
                        onClick={this.handleClickMenu.bind(this, menu)}
                    >
                        {menu.title}
                    </div>
                ))}
            </Sidebar>
        );

        return (
            <div>
                <div className="header">
                    <Row>
                        <Col className="item title" sm={4}>
                            <a href="/">Commerciale 4.0</a>
                        </Col>
                        <Col className="item search" sm={userEmail ? 3 : 4}>
                            <span>
                                <i className="fa fa-search"></i>
                            </span>
                            <input type="text" placeholder="Company search" />
                        </Col>
                        {userEmail ? (
                            <Col className="item user" sm={3}>
                                <DropdownButton
                                    id="dropdown-basic-button"
                                    title={
                                        userEmail
                                            ? userEmail
                                            : "User email address "
                                    }
                                >
                                    <Dropdown.Item
                                        onClick={() =>
                                            this.handleClickProfile()
                                        }
                                    >
                                        Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => this.handleClickLogout()}
                                    >
                                        Log Out
                                    </Dropdown.Item>
                                </DropdownButton>
                            </Col>
                        ) : (
                            <></>
                        )}

                        <Col
                            className="item lang"
                            sm={{ span: "2", offset: userEmail ? "0" : "2" }}
                        >
                            <a href="/">
                                <img src="images/flag/italy.png" alt="" />
                            </a>
                            <a href="/">
                                <img src="images/flag/uk.png" alt="" />
                            </a>
                        </Col>
                    </Row>
                </div>
                <div className="header-mobile">
                    <div className="lang">
                        <a href="/">
                            <img src="images/flag/italy.png" alt="" />
                        </a>
                        <a href="/">
                            <img src="images/flag/uk.png" alt="" />
                        </a>
                    </div>
                    <div className="title">
                        <a href="/">Commerciale 4.0</a>
                    </div>
                    <div>
                        <button
                            className="expand"
                            onClick={this.handleClickExpand}
                        >
                            <i
                                className={`fa ${
                                    isExpanded ? "fa-close" : "fa-bars"
                                }`}
                            />
                        </button>
                    </div>
                </div>
                {sideBar}
            </div>
        );
    }
}
