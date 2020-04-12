import React, { Component } from "react";
import "./index.css";
import { STRINGS } from "../../utils/strings";

export default class Footer extends Component {
    render() {
        return (
            <div className="footer row">
                <div className="col-md-3">
                    <a href="/terms">{STRINGS.terms}</a>
                </div>
                <div className="col-md-3">
                    <a href="policy">{STRINGS.policy}</a>
                </div>
            </div>
        );
    }
}
