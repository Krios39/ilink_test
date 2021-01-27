import * as React from "react";
import "./TranslatedInformation.css"
import {useEffect, useState} from "react";


interface Text {
    text?: string
}

export default function TranslatedInformation({text}: Text) {
    const [words, setWords] = useState([] as string[])

    useEffect(() => {
        if (text) setWords(text.split(" "))
    }, [text])

    return (
        <div className="infoContainer">
            <div className="humanContainer">
                <div className="circle"/>
                <div className="halfCircle"/>
            </div>
            <div>
                <div className="dialog">
                    {words.map((item, index) => <div key={index} className="word">{item}</div>)}
                </div>
            </div>
        </div>
    )
}