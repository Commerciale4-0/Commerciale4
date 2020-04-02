import React, { Component } from "react";
import "./index.css";

const LANGUAGES = [
    {
        id: 1,
        imgUrl: "/images/flag/it.png"
    },
    {
        id: 2,
        imgUrl: "/images/flag/en.png"
    }
];

export default class Lang extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLang: 2
        };
    }

    handClickLang = selectedLang => {
        const { onChange } = this.props;

        this.setState({ selectedLang });
        if (onChange) {
            onChange(selectedLang);
        }
    };

    render() {
        const { selectedLang } = this.state;
        return (
            <div className="lang d-flex">
                {LANGUAGES.map(lang => (
                    <img
                        key={lang.id}
                        className={selectedLang === lang.id ? "active" : ""}
                        src={lang.imgUrl}
                        alt=""
                        onClick={() => this.handClickLang(lang.id)}
                    />
                ))}
            </div>
        );
    }
}
