import React from "react";
import "./Link.scss";
import { Link as ReactLink, LinkProps as ReactLinkProps } from "react-router-dom";

interface LinkProps extends ReactLinkProps, React.RefAttributes<HTMLAnchorElement> {
}

export const Link = (props: LinkProps) => {
    const { className: reactLinkClassName, ...otherProps} = props;

    const className = `app-link ${reactLinkClassName}`;

    return (
        <ReactLink className={className} {...otherProps}/>
    );
}