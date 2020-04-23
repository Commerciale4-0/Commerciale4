import React, { Component } from "react";
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import "./index.css";
import Sidebar from "../Sidebar";
// import SearchInput from "../SearchInput";
import { requestAPI } from "../../utils/api";
import { SESSION_LOGGED_USER, getTotalCompanies } from "../../utils";
import Lang from "../Lang";
import { STRINGS } from "../../utils/strings";
import CompanyReadMore from "../CompanyReadMore";

class Header extends Component {
    constructor(props) {
        super(props);

        this.refKey = React.createRef();
        this.searchBar = React.createRef();
        this.popup = React.createRef();

        this.state = {
            totalCompanies: null,
            cursor: 0,
            isMobile: false,
            isExpanded: false,
            prevScrollpos: window.pageYOffset,
            visible: true,
            companyToPreview: null,
        };
    }

    componentDidMount = () => {
        let filter = JSON.parse(sessionStorage.getItem("filter"));
        if (filter && filter.key) {
            this.refKey.current.value = filter.key;
        }

        this.handleWindowResize();
        window.addEventListener("resize", this.handleWindowResize);
        if (this.props.autoHide) {
            window.addEventListener("scroll", this.handleWindowScroll);
        }
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
        if (this.props.autoHide) {
            window.removeEventListener("scroll", this.handleWindowScroll);
        }
    }

    handleWindowResize = () => {
        this.setState({ isMobile: window.innerWidth <= 576 });

        if (this.popup.current) {
            this.popup.current.style.width = this.searchBar.current.offsetWidth + "px";
        }
    };

    handleWindowScroll = () => {
        const { prevScrollpos } = this.state;

        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollpos > currentScrollPos;

        this.setState({
            prevScrollpos: currentScrollPos,
            visible,
        });
    };

    handleClickExpand = () => {
        this.setState({
            isExpanded: !this.state.isExpanded,
        });
    };

    handleDidCollapse = () => {
        this.setState({
            isExpanded: false,
        });
    };

    handleClickMenu = (menu) => {
        if (menu.link === "/") {
            sessionStorage.removeItem(SESSION_LOGGED_USER);
        }
        window.location.href = menu.link;
        this.setState({
            isExpanded: false,
        });
    };

    handleClickLogout = () => {
        sessionStorage.removeItem(SESSION_LOGGED_USER);
        window.location.href = "/";
    };

    handleClickLogin = () => {
        window.location.href = "/";
    };

    handleClickRegister = () => {
        window.location.href = "/register";
    };

    handleClickProfile = () => {
        window.location.href = "/user-edit";
    };

    handleCloseCompanyPreview = () => {
        this.setState({ companyToPreview: null });
    };

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            const { searchedCompanies, cursor } = this.state;
            if (searchedCompanies && searchedCompanies.length) {
                e.target.value = searchedCompanies[cursor].officialName;
                if (searchedCompanies[cursor].id) {
                    window.location.href = `/company/${searchedCompanies[cursor].id}`;
                } else {
                    this.setState({ companyToPreview: searchedCompanies[cursor], searchedCompanies: null, cursor: 0 });
                    this.refKey.current.value = "";
                }
            }
            // this.setState({ searchedCompanies: null, cursor: 0 });
        }
    };

    handleKeyDown = (e) => {
        const { cursor, searchedCompanies } = this.state;
        if (e.keyCode === 38) {
            e.preventDefault();
            if (searchedCompanies && cursor > 0) {
                this.setState((prevState) => ({
                    cursor: prevState.cursor - 1,
                }));
            }
        } else if (e.keyCode === 40) {
            e.preventDefault();
            if (searchedCompanies && cursor < searchedCompanies.length - 1) {
                this.setState((prevState) => ({
                    cursor: prevState.cursor + 1,
                }));
            }
        }
    };

    handleKeyChange = async (e) => {
        const { totalCompanies } = this.state;
        let keyword = e.target.value.toLowerCase();
        if (keyword.length < 2) {
            this.setState({
                searchedCompanies: null,
            });
            return;
        }

        let companies = totalCompanies;

        if (!companies || !companies.length) {
            let result = await requestAPI("/user/all", "POST");
            if (result.status !== 1) {
                this.setState({ isProcessing: false });
                alert(STRINGS.connectionFailed);
                return;
            }
            result = await getTotalCompanies(result.data);
            if (result.status !== 1) {
                this.setState({ isProcessing: false });
                alert(STRINGS.connectionFailed);
                return;
            }

            this.setState({ totalCompanies: result.data });
        }

        if (companies) {
            companies = companies.filter((elem) => {
                return elem.officialName.toLowerCase().search(keyword) !== -1;
            });
            companies = companies.slice(0, 10);
            this.setState({
                searchedCompanies: companies,
            });
            this.handleWindowResize();
        }
    };

    handleClickCompany = (company) => {
        this.refKey.current.value = company.officialName;
        if (company.id) {
            window.location.href = `/company/${company.id}`;
        } else {
            this.setState({ companyToPreview: company, searchedCompanies: null, cursor: 0 });
            this.refKey.current.value = "";
        }
    };

    highlightMatchedWords = (text) => {
        let key = this.refKey.current.value;
        if (!key || !key.length || !text || !text.length) {
            return text;
        }
        let index = text.toLowerCase().search(key.toLowerCase());
        return `${text.substr(0, index)}<b>${text.substr(index, key.length)}</b>${text.substr(index + key.length)}`;
    };

    handleChangeLang = (lang) => {
        this.props.onSelectedLang(lang);
    };
    handleClickLogo = () => {
        if (window.location.pathname.search("/company/") !== -1) {
            window.location.href = "/dashboard";
        } else {
            window.location.href = "/";
        }
    };

    render() {
        const { isExpanded, searchedCompanies, cursor, isMobile, visible, companyToPreview } = this.state;
        const { needSearchBar, isTransparent } = this.props;
        // console.log(isTransparent);

        const menusInNotLoggedin = [
            { id: 1, title: STRINGS.login, link: "/login" },
            { id: 2, title: STRINGS.register, link: "/register" },
        ];

        const menusInLoggedin = [
            { id: 1, title: STRINGS.profile, link: "/user-edit" },
            { id: 2, title: STRINGS.logout, link: "/" },
        ];

        let loggedUser = JSON.parse(sessionStorage.getItem(SESSION_LOGGED_USER));
        let menus = loggedUser ? menusInLoggedin : menusInNotLoggedin;
        const sideBar = (
            <Sidebar isExpanded={isExpanded} handleCollapse={this.handleDidCollapse}>
                {menus.map((menu) => (
                    <div key={menu.id} className="item" onClick={this.handleClickMenu.bind(this, menu)}>
                        {menu.title}
                    </div>
                ))}
            </Sidebar>
        );

        const searchBar = (
            <div>
                <div className="search-bar" ref={this.searchBar}>
                    <i className="fa fa-search"></i>
                    <input
                        placeholder={STRINGS.companySearch}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleKeyChange}
                        ref={this.refKey}
                        onKeyPress={this.handleKeyPress}
                    />
                </div>
                <div
                    className="popup"
                    ref={this.popup}
                    style={{
                        display: searchedCompanies && searchedCompanies.length ? "block" : "none",
                    }}
                >
                    {searchedCompanies ? (
                        searchedCompanies.map((company, index) => (
                            <div
                                className={`company-item ${cursor === index ? "active" : ""}`}
                                key={index}
                                onClick={() => this.handleClickCompany(company)}
                                dangerouslySetInnerHTML={{
                                    __html: this.highlightMatchedWords(company.officialName),
                                }}
                            ></div>
                        ))
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        );

        return (
            <div>
                <div className={`header ${isTransparent ? "" : "bg-fill"}`}>
                    <Row>
                        <Col className="item title" sm={4}>
                            <img src="/images/logo.svg" className="cursor-pointer" alt="" onClick={this.handleClickLogo} />
                        </Col>
                        <Col className="item" sm={loggedUser ? 3 : 4}>
                            {!isMobile ? searchBar : <div />}
                        </Col>
                        {loggedUser ? (
                            <Col className="item user" sm={3}>
                                <DropdownButton id="dropdown-basic-button" title={loggedUser ? loggedUser.user.email : "User email address "}>
                                    <Dropdown.Item onClick={() => this.handleClickProfile()}>{STRINGS.profile}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.handleClickLogout()}>{STRINGS.logout}</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                        ) : (
                            <></>
                        )}

                        <Col className="item lang d-flex align-items-center" sm={{ span: "2", offset: loggedUser ? "0" : "2" }}>
                            <Lang onChange={this.handleChangeLang} />
                        </Col>
                    </Row>
                </div>
                <div className={`header-mobile ${!visible ? "hidden" : ""} ${isTransparent ? "" : "bg-fill"}`}>
                    <div className="menu-bar">
                        <div className="lang d-flex align-items-center">
                            <Lang onChange={this.handleChangeLang} />
                        </div>
                        <div className="title">
                            <img src="/images/logo.svg" alt="" onClick={this.handleClickLogo} />
                        </div>
                        <div>
                            <button className="expand" onClick={this.handleClickExpand}>
                                <i className={`fa ${isExpanded ? "fa-close" : "fa-bars"}`} />
                            </button>
                        </div>
                    </div>
                    {isMobile && needSearchBar === true ? searchBar : <div />}
                </div>
                {sideBar}
                {companyToPreview && <CompanyReadMore company={companyToPreview} onClose={this.handleCloseCompanyPreview} />}
            </div>
        );
    }
}
export default Header;
