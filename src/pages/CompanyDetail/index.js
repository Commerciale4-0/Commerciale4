import React, { Component } from "react";
import DetailHeader from "../../components/Detail/Header";
import DetailBody from "../../components/Detail/Body";
import "./index.css";
import { requestAPI } from "../../utils/api";
import SpinnerView from "../../components/SpinnerView";
import { orderTags, SESSION_SELECTED_COMPANY } from "../../utils";
import { LangConsumer } from "../../utils/LanguageContext";
import { STRINGS } from "../../utils/strings";

let lang = null;

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

        if (id === "unknown") {
            let selectedCompany = JSON.parse(sessionStorage.getItem(SESSION_SELECTED_COMPANY));
            this.setState({ profile: { user: selectedCompany, posts: [] } });
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
                            if (lang === "en") {
                                profile.user.tags = orderTags(profile.user.tags, filter.tags);
                            } else {
                                profile.user.tagsIt = orderTags(profile.user.tagsIt, filter.tags);
                            }
                        }
                    }
                    this.setState({ profile: res.data });
                } else {
                    console.log(STRINGS.connectionFailed);
                }
                this.setState({ isProcessing: false });
            })
            .catch((e) => {
                console.log(STRINGS.connectionFailed);
                this.setState({ isProcessing: false });
            });
    };

    render() {
        const { profile, isProcessing } = this.state;
        console.log(profile);
        return (
            <div>
                <LangConsumer>
                    {(value) => {
                        lang = value.lang;
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
