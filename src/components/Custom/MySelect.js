import React, { Component } from "react";
import Select from "react-select";

const styles = {
    control: provided => ({
        ...provided,
        borderRadius: 2,
        border: 0,
        background: "#eee"
    }),
    indicatorSeparator: () => ({
        display: "none"
    })
};

export default class MySelect extends Component {
    render() {
        const { value, onChange, options, placeholder } = this.props;
        return (
            <Select
                styles={styles}
                value={value}
                onChange={onChange}
                options={options}
                placeholder={placeholder}
                theme={theme => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: "var(--colorPrimary)"
                    }
                })}
            />
        );
    }
}
