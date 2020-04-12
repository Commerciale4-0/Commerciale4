import React, { Component } from "react";
import "./index.css";
import { STRINGS } from "../../utils/strings";

export default class PostItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: false,
            // preview: false
        };
    }

    componentDidMount = () => {
        this.handleWindowResize();
        window.addEventListener("resize", this.handleWindowResize);
    };

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.handleWindowResize);
    };

    handleWindowResize = () => {
        this.setState({ isMobile: window.innerWidth <= 576 });
    };

    getPublished(date) {
        let date_ob = new Date(date);
        let day = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();

        return day + "/" + month + "/" + year;
    }

    render() {
        const { isMobile } = this.state;
        const { data, handleDelete, bg } = this.props;

        const imagePanel = data.photo && (
            // <div className="image-panel">
            <img src={process.env.REACT_APP_AWS_PREFIX + data.photo} alt="" />
            // </div>
        );
        const btnDelete = handleDelete && (
            <button onClick={handleDelete}>
                <i className="fa fa-close" />
            </button>
        );

        const contentPanel = isMobile ? (
            <div>
                {btnDelete}

                <div className="d-flex align-items-center">
                    {imagePanel}

                    <p className="text-uppercase text-bold text-dark-light">{data.title}</p>
                </div>
                <p className="mt-2 text-gray">{data.description}</p>
                <p className="publish-date">
                    {STRINGS.publishedOn} {this.getPublished(data.published)}
                </p>
            </div>
        ) : (
            <div className="content-panel">
                {btnDelete}
                <p className="text-uppercase text-bold text-dark-light">{data.title}</p>
                <p className="text-gray">{data.description}</p>
                <p className="publish-date">
                    {STRINGS.publishedOn} {this.getPublished(data.published)}
                </p>
            </div>
        );
        return (
            <div>
                <div className="post-item" style={{ background: bg ? bg : "white" }}>
                    {!isMobile && imagePanel}
                    {contentPanel}
                </div>
            </div>
        );
    }
}
