import React, { Component } from "react";
import "./index.css";
import DetailOverview from "../Overview";
import DetailProduct from "../Product";
import DetailContacts from "../Contacts";
import { stringWithUnitFromNumber, getCompanyTypeText } from "../../../utils";
import { LangConsumer } from "../../../utils/LanguageContext";
import { STRINGS } from "../../../utils/strings";

export default class DetailBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMenu: 0,
            isMobile: false,
            panelHeightMax: 0,
        };

        this.menuPanel = React.createRef();

        this.aboutUsPanel = React.createRef();
        this.productsPanel = React.createRef();
        this.contactsPanel = React.createRef();
    }

    componentDidMount = () => {
        this.handleWindowResize();
        window.addEventListener("resize", this.handleWindowResize);
        if (window.innerWidth <= 576) {
            window.addEventListener("scroll", this.handleWindowScroll);
        }
        this.aboutUsPanel.current.style.display = "block";
        this.productsPanel.current.style.display = "none";
        this.contactsPanel.current.style.display = "none";
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
        const currentScrollPos = window.pageYOffset;
        let topBarHeight = 0;
        topBarHeight = 46;

        let leftPanel = document.querySelector(".detail-body .left-panel");
        let offsetY = leftPanel.offsetHeight - 104;

        if (currentScrollPos > 334 + offsetY - topBarHeight) {
            this.menuPanel.current.style.top = 41 + topBarHeight + "px";
        } else {
            this.menuPanel.current.style.top = `${377 + offsetY - currentScrollPos}px`;
        }

        this.setState({ prevScrollpos: currentScrollPos });
    };

    handleChangeMenu = (selectedMenu) => {
        let panels = [this.aboutUsPanel.current, this.productsPanel.current, this.contactsPanel.current];
        let currentHeight = panels[this.state.selectedMenu].clientHeight;

        panels[selectedMenu].style.display = "block";
        if (window.innerWidth > 576) {
            let maxHeight = Math.max(this.state.panelHeightMax, currentHeight, panels[selectedMenu].clientHeight);
            panels.forEach((panel) => {
                panel.style.height = maxHeight + "px";
            });
        }
        panels.forEach((panel, index) => {
            if (index !== selectedMenu) {
                panel.style.display = "none";
            }
        });

        this.setState({ selectedMenu });
    };

    render() {
        const { profile } = this.props;
        const { selectedMenu, isMobile } = this.state;

        const MENUS = [
            { id: 0, title: STRINGS.aboutUs, icon: "fa-user" },
            { id: 1, title: STRINGS.productSearvice, icon: "fa-cogs" },
            { id: 2, title: STRINGS.contacts, icon: "fa-info-circle" },
        ];
        const menuPanel = (
            <div className="menu-panel" ref={this.menuPanel}>
                {MENUS.map((menu) => (
                    <div key={menu.id} className={`menu ${selectedMenu === menu.id ? "active" : ""}`} onClick={() => this.handleChangeMenu(menu.id)}>
                        {!isMobile && <i className={`fa ${menu.icon} pr-3`} />}
                        {menu.title}
                    </div>
                ))}
            </div>
        );

        const tagsPanel = !isMobile && (
            <div className="multi-values">
                <i className="fa fa-tags" />
                <div>
                    <LangConsumer>
                        {(value) =>
                            value.lang === "en"
                                ? profile && profile.user.tags && profile.user.tags.map((tag, index) => <label key={index}>{tag}</label>)
                                : profile && profile.user.tagsIt && profile.user.tagsIt.map((tagIt, index) => <label key={index}>{tagIt}</label>)
                        }
                    </LangConsumer>
                </div>
            </div>
        );

        const isoPanel = !isMobile && (
            <div className="multi-values">
                <span>{STRINGS.iso}</span>
                <div>
                    {profile &&
                        profile.user.iso &&
                        profile.user.iso.map((item, index) => (
                            <label key={index} className="no-bg" style={{ textDecoration: "underline" }}>
                                {item}
                            </label>
                        ))}
                </div>
            </div>
        );

        const infoPanel = (
            <div className="info-panel">
                <div className="row-on-mobile">
                    <p>
                        <i className="fa fa-users" />
                        {profile && stringWithUnitFromNumber(profile.user.employees)}
                    </p>
                    <p>
                        <i className="fa fa-line-chart" />
                        {profile && stringWithUnitFromNumber(profile.user.revenues)}
                    </p>
                    {isoPanel}
                    <p className="-ateco">
                        <span>{STRINGS.ateco}</span>
                        {profile && profile.user.ateco}
                    </p>
                </div>
                <p className="-type mb-0">
                    <span className="text-uppercase">{STRINGS.type}</span>
                    {profile && getCompanyTypeText(profile.user.typeOfCompany)}
                </p>
                {tagsPanel}
            </div>
        );

        return (
            <div className="detail-body">
                <div className="left-panel">
                    {isMobile ? infoPanel : menuPanel}
                    {isMobile ? menuPanel : infoPanel}
                </div>
                <div className="right-panel">
                    <div ref={this.aboutUsPanel}>
                        <DetailOverview profile={profile} />
                    </div>
                    <div ref={this.productsPanel}>
                        <DetailProduct profile={profile} />
                    </div>
                    <div ref={this.contactsPanel}>
                        <DetailContacts profile={profile} />
                    </div>
                    {/* <div className={selectedMenu === 0 ? "d-block" : "d-none"} ref={this.aboutUsPanel}>
						<DetailOverview profile={profile} />
					</div>
					<div className={selectedMenu === 1 ? "d-block" : "d-none"} ref={this.productsPanel}>
						<DetailProduct profile={profile} />
					</div>
					<div className={selectedMenu === 2 ? "d-block" : "d-none"} ref={this.contactsPanel}>
						<DetailContacts profile={profile} />
					</div> */}
                </div>
            </div>
        );
    }
}
