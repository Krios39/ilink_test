import * as React from 'react';
import './App.css';
import DnDField from "./components/DnDField/DnDField";
import Title from "./components/Title/Title";
import TranslatedInformation from "./components/TranslatedInformation/TranslatedInformation";
import {useEffect, useState} from "react";
import axios from "axios";

export interface Data {
    english: string
    russian: string
}

function App() {

    const [data, setData] = useState({} as Data)

    useEffect(() => {
        axios.get("http://localhost:3000/translate/")
            .then((resp) => setData(resp.data))
    }, [])

    return (
        <div className="App">
            <Title size="big" text="Translate this sentence"/>
            <TranslatedInformation text={data.russian}/>
            <DnDField english={data.english}/>
        </div>
    );
}

export default App;
