import React, { Component } from "react";
import DetailHeader from "../../components/Detail/Header";
import DetailBody from "../../components/Detail/Body";
import "./index.css";
import { requestAPI } from "../../utils/api";

export default class CompanyDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            company: null
        };
    }

    componentDidMount = async () => {
        let id = this.props.match.params.id;
        if (!id) {
            return;
        }

        await requestAPI("/user/get-user", "POST", {
            id: id
        })
            .then(res => res.data)
            .then(data => {
                if (data && data.length) {
                    this.setState({ company: data[0] });
                } else {
                    console.log("Connection failed!");
                }
            })
            .catch(e => {
                console.log("Connection failed!");
            });
    };

    render() {
        const { company } = this.state;
        return (
            <div>
                {company ? (
                    <div className="company-detail container">
                        <DetailHeader company={company} />
                        <DetailBody company={company} />
                    </div>
                ) : (
                    <div />
                )}
            </div>
        );
    }
}
