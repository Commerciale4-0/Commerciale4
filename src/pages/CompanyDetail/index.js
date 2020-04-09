import React, { Component } from "react";
import DetailHeader from "../../components/Detail/Header";
import DetailBody from "../../components/Detail/Body";
import "./index.css";
import { requestAPI } from "../../utils/api";
import SpinnerView from "../../components/SpinnerView";
import { orderTags } from "../../utils";
import { LangConsumer } from "../../utils/LanguageContext";
let stateContext = null;
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
                    let profile = res.data;
                    if (profile.user) {
                        let filter = JSON.parse(sessionStorage.getItem("filter"));
                        if (filter) {
                            if (stateContext === 2) {
                                profile.user.tags = orderTags(profile.user.tags, filter.tags);
                            } else {
                                profile.user.tagsIt = orderTags(profile.user.tagsIt, filter.tags);
                            }
                        }
                    }
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
                <LangConsumer>
                    {(value) => {
                        stateContext = value.lang;
                    }}
                </LangConsumer>
                <div className="company-detail container">
                    <DetailHeader profile={profile && profile.user} />
                    <DetailBody profile={profile} />
                </div>
                {isProcessing && <SpinnerView />}
            </div>
        );
    }
}
