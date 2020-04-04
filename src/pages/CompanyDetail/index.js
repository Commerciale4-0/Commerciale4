import React, { Component } from "react";
import DetailHeader from "../../components/Detail/Header";
import DetailBody from "../../components/Detail/Body";
import "./index.css";
import { requestAPI } from "../../utils/api";
import SpinnerView from "../../components/SpinnerView";

export default class CompanyDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: null,
            isProcessing: false,
        };
    }

    componentDidMount = async () => {
        let id = this.props.match.params.id;
        if (!id) {
            return;
        }

        this.setState({ isProcessing: true });
        await requestAPI("/user", "POST", { id: id })
            .then((res) => {
                if (res.status === 1) {
                    this.setState({ profile: res.data });
                } else {
                    console.log("Connection failed!");
                }
                this.setState({ isProcessing: false });
            })
            .catch((e) => {
                console.log("Connection failed!!");
                this.setState({ isProcessing: false });
            });
    };

    render() {
        const { profile, isProcessing } = this.state;
        return (
            <div>
                <div className="company-detail container">
                    <DetailHeader profile={profile && profile.user} />
                    <DetailBody profile={profile} />
                </div>
                {isProcessing && <SpinnerView />}
            </div>
        );
    }
}
