import React, { Component } from "react";

export default class MyTagSearch extends Component {
    state = {
        tags: []
    };

    handleKeyPress = e => {
        if (e.key === "Enter") {
            let tags = this.state.tags;
            tags.push(e.target.value);
            e.target.value = "";
            this.setState({ tags: tags });
        }
    };

    render() {
        const { tags } = this.state;
        console.log(tags);
        return (
            <div>
                {tags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                ))}
                <input onKeyPress={this.handleKeyPress} />
            </div>
        );
    }
}
