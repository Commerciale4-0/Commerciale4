import React, { Component } from "react";
import "./index.css";
import DetailOverview from "../Overview";
import DetailProduct from "../Product";
import DetailContacts from "../Contacts";

const MENUS = [
    { id: 1, title: "About us" },
    { id: 2, title: "Product & Service" },
    { id: 3, title: "Contacts" }
];

export default class DetailBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMenu: 1,
            isMobile: false,
            prevScrollpos: window.pageYOffset
        };

        this.leftPanel = React.createRef();
        this.rightPanel = React.createRef();
        this.menuPanel = React.createRef();
    }

    componentDidMount = () => {
        this.handleWindowResize();
        window.addEventListener("resize", this.handleWindowResize);
        if (window.innerWidth <= 576) {
            window.addEventListener("scroll", this.handleWindowScroll);
        }
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
        if (window.innerWidth <= 576) {
            window.removeEventListener("scroll", this.handleWindowScroll);
        }
    }

    handleWindowResize = () => {
        this.setState({ isMobile: window.innerWidth <= 576 });
    };

    handleWindowScroll = () => {
        const { prevScrollpos } = this.state;

        const currentScrollPos = window.pageYOffset;
        let topBarHeight = 0;
        // if (prevScrollpos > currentScrollPos) {
        topBarHeight = 46;
        // }
        if (currentScrollPos > 331 - topBarHeight) {
            this.menuPanel.current.style.top = 41 + topBarHeight + "px";
        } else {
            this.menuPanel.current.style.top = `${374 - currentScrollPos}px`;
        }

        this.setState({ prevScrollpos: currentScrollPos });
    };

    render() {
        const { company } = this.props;
        const { selectedMenu, isMobile } = this.state;

        const menuPanel = (
            <div className="menu-panel" ref={this.menuPanel}>
                {MENUS.map(menu => (
                    <div
                        key={menu.id}
                        className={`menu ${
                            selectedMenu === menu.id ? "active" : ""
                        }`}
                        onClick={() => this.setState({ selectedMenu: menu.id })}
                    >
                        {menu.title}
                    </div>
                ))}
            </div>
        );

        const infoPanel = (
            <div className="info-panel">
                <div>
                    <p className="-employees">
                        <i className="fa fa-users" />
                        {company.employees}
                    </p>
                    <p className="-revenues">
                        <i className="fa fa-line-chart" />
                        {company.revenues}
                    </p>
                    <p className="-iso">
                        <span>ISO</span>
                        9001
                    </p>
                </div>
                <div>
                    <p className="-ateco">
                        <span>NACE</span>
                        {company.atecoCode}
                    </p>
                    <p className="-type">
                        <span>TYPE</span>
                        Products & Service
                    </p>
                </div>
                <div className="-tags">
                    <i className="fa fa-tags" />
                    <div>
                        <label>Lasercut</label>
                        <label>Welding</label>
                        <label>CNC</label>
                        <label>bend</label>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="detail-body">
                <div className="left-panel" ref={this.leftPanel}>
                    {isMobile ? infoPanel : menuPanel}
                    {isMobile ? menuPanel : infoPanel}
                </div>
                <div className="right-panel" ref={this.rightPanel}>
                    {selectedMenu === 1 ? (
                        <DetailOverview company={company} />
                    ) : selectedMenu === 2 ? (
                        <DetailProduct company={company} />
                    ) : selectedMenu === 3 ? (
                        <DetailContacts company={company} />
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        );
    }
}
