import * as React from "react";
import "./Button.css"

interface Button{
    onClick:()=>void
}

export default function Button({onClick}:Button){
    return(
        <button className="button" onClick={onClick}>Check</button>
    )
}