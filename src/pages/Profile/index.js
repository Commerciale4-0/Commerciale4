import React, { Component } from "react";
import "./index.css";
import { requestAPI } from "../../utils/api";
import ProfileCompany from "../../components/Profile/Company";
import ProfileNews from "../../components/Profile/News";
import ProfileAccount from "../../components/Profile/Account";

const MENUS = ["Profile info", "News", "Account"];

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCategory: 0,
            user: null
        };
    }

    componentDidMount = async () => {
        let id = this.props.match.params.id;
        if (!id) {
            return;
        }

        let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
        if (!loggedUser) {
            window.location.href = "/";
            return;
        }

        this.setState({ user: loggedUser });
    };

    render() {
        const { selectedCategory, user } = this.state;
        return (
            <div>
                {user && (
                    <div className="user-profile container">
                        <div className="left-panel">
                            {MENUS.map((menu, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        this.setState({
                                            selectedCategory: index
                                        })
                                    }
                                    className={
                                        selectedCategory === index
                                            ? "active"
                                            : ""
                                    }
                                >
                                    {menu}
                                </button>
                            ))}
                        </div>
                        <div className="right-panel">
                            <div
                                style={{
                                    display:
                                        selectedCategory === 0
                                            ? "block"
                                            : "none"
                                }}
                            >
                                <ProfileCompany />
                            </div>
                            <div
                                style={{
                                    display:
                                        selectedCategory === 1
                                            ? "block"
                                            : "none"
                                }}
                            >
                                <ProfileNews />
                            </div>
                            <div
                                style={{
                                    display:
                                        selectedCategory === 2
                                            ? "block"
                                            : "none"
                                }}
                            >
                                <ProfileAccount />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
