import * as React from "react";
import "./Title.css"

interface Text {
    text: string,
    size: string,
    error?: boolean
}

export default function Title({text, size, error}: Text) {

    const classname = error ? "error" : ""

    return (
        <div className={classname}>
            <div className={size}>{text}</div>
        </div>
    )
}