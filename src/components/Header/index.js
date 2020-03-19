import React, { Component } from "react";
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import "./index.css";
import Sidebar from "../Sidebar";
import SearchInput from "../SearchInput";
import { requestAPI } from "../../utils/api";
import { ReactHtmlParser } from "react-html-parser";

const menusInNotLoggedin = [
    { id: 1, title: "Log in", link: "/login" },
    { id: 2, title: "Register", link: "/register" }
];

const menusInLoggedin = [
    { id: 1, title: "Profile", link: "/profile" },
    { id: 2, title: "Log out", link: "/" }
];

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.inputKey = React.createRef();
        this.searchBar = React.createRef();
        this.popup = React.createRef();

        this.state = {
            totalCompanies: null,
            cursor: 0
        };
    }
    state = {
        isExpanded: false
    };

    updateDimensions = () => {
        if (this.popup.current) {
            this.popup.current.style.width =
                this.searchBar.current.offsetWidth + "px";
        }
    };

    componentDidMount = () => {
        let filter = JSON.parse(sessionStorage.getItem("filter"));
        if (filter && filter.key) {
            this.inputKey.current.value = filter.key;
        }
        window.addEventListener("resize", this.updateDimensions.bind(this));
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
            sessionStorage.removeItem("userData");
        }
        window.location.href = menu.link;
    };

    handleClickLogout() {
        sessionStorage.removeItem("userData");
        window.location.href = "/";
    }

    handleClickLogin() {
        window.location.href = "/";
    }

    handleClickRegister() {
        window.location.href = "/register";
    }

    handleClickProfile() {}

    handleKeyPress = e => {
        if (e.key === "Enter") {
            const { searchedCompanies, cursor } = this.state;
            if (searchedCompanies && searchedCompanies.length) {
                e.target.value = searchedCompanies[cursor].officialName;
            }
            this.setState({ searchedCompanies: null, cursor: 0 });
        }
    };

    handleKeyDown = e => {
        // if (e.key === "Enter") {
        //     sessionStorage.setItem(
        //         "filter",
        //         JSON.stringify({ key: e.target.value })
        //     );
        //     // window.location.href = "/dashboard";
        // }
        const { cursor, searchedCompanies } = this.state;
        if (e.keyCode === 38) {
            e.preventDefault();
            if (searchedCompanies && cursor > 0) {
                this.setState(prevState => ({
                    cursor: prevState.cursor - 1
                }));
            }
        } else if (e.keyCode === 40) {
            e.preventDefault();
            if (searchedCompanies && cursor < searchedCompanies.length - 1) {
                this.setState(prevState => ({
                    cursor: prevState.cursor + 1
                }));
            }
        }
    };

    handleKeyChange = async e => {
        const { totalCompanies } = this.state;
        let keyword = e.target.value.toLowerCase();
        if (keyword.length < 2) {
            this.setState({
                searchedCompanies: null
            });
            return;
        }

        let companies = totalCompanies;
        if (!companies || !companies.length) {
            await requestAPI("/user/all-users", "GET").then(res => {
                if (res.status === 1) {
                    companies = res.data;
                }
                this.setState({
                    totalCompanies: companies
                });
            });
        }

        if (companies) {
            companies = companies.filter(elem => {
                return elem.officialName.toLowerCase().search(keyword) !== -1;
            });
            companies = companies.slice(0, 10);
            this.setState({
                searchedCompanies: companies
            });
            this.updateDimensions();
        }
    };

    handleClickCompany = company => {
        this.inputKey.current.value = company.officialName;
        this.setState({ searchedCompanies: null, cursor: 0 });
    };

    highlightMatchedWords = text => {
        let key = this.inputKey.current.value;
        if (!key || !key.length || !text || !text.length) {
            return text;
        }
        let index = text.toLowerCase().search(key.toLowerCase());
        return `${text.substr(0, index)}<b>${text.substr(
            index,
            key.length
        )}</b>${text.substr(index + key.length)}`;
    };

    render() {
        const { isExpanded, searchedCompanies, cursor } = this.state;
        let userData = JSON.parse(sessionStorage.getItem("userData"));
        let menus = userData ? menusInLoggedin : menusInNotLoggedin;
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
                        <Col className="item" sm={userData ? 3 : 4}>
                            <div className="w-100">
                                <div
                                    className="search-bar"
                                    ref={this.searchBar}
                                >
                                    <i className="fa fa-search"></i>
                                    <input
                                        placeholder="Company search"
                                        onKeyDown={this.handleKeyDown}
                                        onChange={this.handleKeyChange}
                                        ref={this.inputKey}
                                        onKeyPress={this.handleKeyPress}
                                    />
                                </div>
                                <div
                                    className="popup"
                                    ref={this.popup}
                                    style={{
                                        display:
                                            searchedCompanies &&
                                            searchedCompanies.length
                                                ? "block"
                                                : "none"
                                    }}
                                >
                                    {searchedCompanies ? (
                                        searchedCompanies.map(
                                            (company, index) => (
                                                <div
                                                    className={`company-item ${
                                                        cursor === index
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    key={index}
                                                    onClick={() =>
                                                        this.handleClickCompany(
                                                            company
                                                        )
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html: this.highlightMatchedWords(
                                                            company.officialName
                                                        )
                                                    }}
                                                ></div>
                                            )
                                        )
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            </div>
                        </Col>
                        {userData ? (
                            <Col className="item user" sm={3}>
                                <DropdownButton
                                    id="dropdown-basic-button"
                                    title={
                                        userData
                                            ? userData.email
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
                            sm={{ span: "2", offset: userData ? "0" : "2" }}
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
