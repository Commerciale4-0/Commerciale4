import React, { Component } from "react";
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import "./index.css";
import Sidebar from "../Sidebar";
// import SearchInput from "../SearchInput";
import { requestAPI } from "../../utils/api";
import { LOGGED_USER } from "../../utils";
import Lang from "../Lang";

const menusInNotLoggedin = [
  { id: 1, title: "Log in", link: "/login" },
  { id: 2, title: "Register", link: "/register" }
];

const menusInLoggedin = [
  { id: 1, title: "Profile", link: "/user-edit" },
  { id: 2, title: "Log out", link: "/" }
];

export default class Header extends Component {
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
      visible: true
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
      this.popup.current.style.width =
        this.searchBar.current.offsetWidth + "px";
    }
  };

  handleWindowScroll = () => {
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;

    this.setState({
      prevScrollpos: currentScrollPos,
      visible
    });
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
      sessionStorage.removeItem(LOGGED_USER);
    }
    window.location.href = menu.link;
  };

  handleClickLogout = () => {
    sessionStorage.removeItem(LOGGED_USER);
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

  handleKeyPress = e => {
    if (e.key === "Enter") {
      const { searchedCompanies, cursor } = this.state;
      if (searchedCompanies && searchedCompanies.length) {
        e.target.value = searchedCompanies[cursor].officialName;
        window.location.href = `/company/${searchedCompanies[cursor].id}`;
      }
      // this.setState({ searchedCompanies: null, cursor: 0 });
    }
  };

  handleKeyDown = e => {
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
      await requestAPI("/user/all", "GET").then(res => {
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
      this.handleWindowResize();
    }
  };

  handleClickCompany = company => {
    this.refKey.current.value = company.officialName;
    window.location.href = `/company/${company.id}`;
    // this.setState({ searchedCompanies: null, cursor: 0 });
  };

  highlightMatchedWords = text => {
    let key = this.refKey.current.value;
    if (!key || !key.length || !text || !text.length) {
      return text;
    }
    let index = text.toLowerCase().search(key.toLowerCase());
    return `${text.substr(0, index)}<b>${text.substr(
      index,
      key.length
    )}</b>${text.substr(index + key.length)}`;
  };

  handleChangeLang = lang => {
    sessionStorage.setItem("lang", lang);
  };

  render() {
    const {
      isExpanded,
      searchedCompanies,
      cursor,
      isMobile,
      visible
    } = this.state;
    const { needSearchBar, isTransparent } = this.props;

    let loggedUser = JSON.parse(sessionStorage.getItem(LOGGED_USER));
    let menus = loggedUser ? menusInLoggedin : menusInNotLoggedin;
    const sideBar = (
      <Sidebar isExpanded={isExpanded} handleCollapse={this.handleDidCollapse}>
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

    const searchBar = (
      <div>
        <div className="search-bar" ref={this.searchBar}>
          <i className="fa fa-search"></i>
          <input
            placeholder="Company search"
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
            display:
              searchedCompanies && searchedCompanies.length ? "block" : "none"
          }}
        >
          {searchedCompanies ? (
            searchedCompanies.map((company, index) => (
              <div
                className={`company-item ${cursor === index ? "active" : ""}`}
                key={index}
                onClick={() => this.handleClickCompany(company)}
                dangerouslySetInnerHTML={{
                  __html: this.highlightMatchedWords(company.officialName)
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
              <a href="/">
                <img src="/images/logo.svg" alt="" />
              </a>
            </Col>
            <Col className="item" sm={loggedUser ? 3 : 4}>
              {!isMobile ? searchBar : <div />}
            </Col>
            {loggedUser ? (
              <Col className="item user" sm={3}>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={
                    loggedUser ? loggedUser.user.email : "User email address "
                  }
                >
                  <Dropdown.Item onClick={() => this.handleClickProfile()}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.handleClickLogout()}>
                    Log Out
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            ) : (
              <></>
            )}

            <Col
              className="item lang d-flex align-items-center"
              sm={{ span: "2", offset: loggedUser ? "0" : "2" }}
            >
              <Lang onChange={this.handleChangeLang} />
            </Col>
          </Row>
        </div>
        <div
          className={`header-mobile ${!visible ? "hidden" : ""} ${
            isTransparent ? "" : "bg-fill"
          }`}
        >
          <div className="menu-bar">
            <div className="lang d-flex align-items-center">
              <Lang onChange={this.handleChangeLang} />
            </div>
            <div className="title">
              <a href="/">
                <img src="/images/logo.svg" alt="" />
              </a>
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
      </div>
    );
  }
}
