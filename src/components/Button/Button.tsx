import * as React from "react";
import "./Button.css"

export default function Button({onClick}) {
    return (
        <button className="button" onClick={onClick}>Check</button>
    )
}