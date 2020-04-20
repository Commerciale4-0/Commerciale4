import React, { Component } from "react";
import "./index.css";
import ProfileCompany from "../../components/Profile/Company";
import ProfileNews from "../../components/Profile/News";
import ProfileAccount from "../../components/Profile/Account";
import { SESSION_LOGGED_USER } from "../../utils";
import { STRINGS } from "../../utils/strings";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: null,
            selectedMenu: { root: 0, sub: 0 },
        };
    }

    componentDidMount = async () => {
        let loggedUser = JSON.parse(sessionStorage.getItem(SESSION_LOGGED_USER));
        if (!loggedUser) {
            window.location.href = "/";
            return;
        }

        this.setState({ userData: loggedUser });
    };

    render() {
        const { userData, selectedMenu } = this.state;
        const MENUS = [
            {
                id: 0,
                title: STRINGS.profileInfo,
                icon: "fa-building-o",
                subs: [
                    { id: 0, title: STRINGS.aboutUs },
                    { id: 1, title: STRINGS.productSearvice },
                    { id: 2, title: STRINGS.contacts },
                ],
            },
            {
                id: 1,
                title: STRINGS.news,
                icon: "fa-newspaper-o",
                subs: [{ id: 0, title: STRINGS.publish }],
            },
            {
                id: 2,
                title: STRINGS.account,
                icon: "fa-user-circle",
                subs: [
                    { id: 0, title: STRINGS.actions },
                    { id: 1, title: STRINGS.info },
                ],
            },
        ];
        return (
            <div>
                {userData && (
                    <div className="user-profile container">
                        <div className="left-panel">
                            {MENUS.map((menu) => (
                                <div key={menu.id}>
                                    <div className="menu">
                                        {menu.title} <i className={`fa ${menu.icon} pl-2`} />
                                    </div>
                                    <div>
                                        {menu.subs.map((subMenu) => (
                                            <div
                                                key={subMenu.id}
                                                className={`sub-menu ${selectedMenu.root === menu.id && selectedMenu.sub === subMenu.id ? "active" : ""}`}
                                                onClick={() =>
                                                    this.setState({
                                                        selectedMenu: {
                                                            root: menu.id,
                                                            sub: subMenu.id,
                                                        },
                                                    })
                                                }
                                            >
                                                {subMenu.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* {MENUS.map((menu, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        this.setState({
                                            selectedCategory: index,
                                        })
                                    }
                                    className={selectedCategory === index ? "active" : ""}
                                >
                                    {menu}
                                </button>
                            ))} */}
                        </div>
                        <div className="right-panel">
                            <div className={selectedMenu.root === 0 ? "d-block" : "d-none"}>
                                <ProfileCompany profile={userData.user} tab={selectedMenu.sub} />
                            </div>
                            <div className={selectedMenu.root === 1 ? "d-block" : "d-none"}>
                                <ProfileNews posts={userData.posts} userId={userData.user.id} />
                            </div>
                            <div className={selectedMenu.root === 2 ? "d-block" : "d-none"}>
                                <ProfileAccount userData={userData} tab={selectedMenu.sub} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
