import React, { Component } from "react";
import Select from "react-select";

export default class MySelect extends Component {
    render() {
        const {
            value,
            onChange,
            options,
            placeholder,
            checkValid
        } = this.props;

        const styles = {
            control: (provided, state) => ({
                ...provided,
                borderRadius: 4,
                background: "#eee",
                borderColor: state.isFocused
                    ? "var(--colorPrimary)"
                    : checkValid !== true || value
                    ? "transparent"
                    : "red",
                "&:hover": {
                    borderColor: state.isFocused
                        ? "var(--colorPrimary)"
                        : checkValid !== true || value
                        ? "transparent"
                        : "red"
                }
            }),
            indicatorSeparator: () => ({
                display: "none"
            })
        };

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
