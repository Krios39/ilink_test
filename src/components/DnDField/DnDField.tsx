import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap,
    move
} from "react-grid-dnd";
import React, {useEffect, useState} from "react";
import Title from "../Title/Title";
import "./DnDField.css"
import Button from "../Button/Button";
import Text from '../TranslatedInformation/TranslatedInformation'
import { useSpeechSynthesis } from 'react-speech-kit';

interface Word {
    id: number,
    title: string
}

interface Text {
    english: string
}

export default function DnNField({english}: Text) {
    const {speak} = useSpeechSynthesis()
    const [cloud, setCloud] = useState([] as Word[]);
    const [translate, setTranslate] = useState([] as Word[]);
    const [error, setError] = useState(false)

    useEffect(() => {
        function getWordArr(){
            let a: Word[] = []
            let b = arrShuffle(english.split(" "))
            for (let i = 0; i < english.split(" ").length; i++) {
                a.push({
                    id: i,
                    title: b[i]
                })
            }
            return a
        }
        if (english)  setCloud(getWordArr())
    }, [english])

    useEffect(() => {
        setError(false)
    }, [translate])

    useEffect(() => {
        function sortCloud() {
            const a = cloud.slice().sort((a, b) => a.id - b.id)
            for (let i = 0; i < cloud.length; i++) {
                if (cloud[i].id !== a[i].id) {
                    setCloud(a.sort((a, b) => a.id - b.id))
                }
            }
        }

        sortCloud()
    }, [cloud])

    const arrShuffle = (arr: string[]) => {
        let c = arr.slice()
        for (let i = 0; i < arr.length; i++) {
            c = swapNum(c, i, i + i + 1 < c.length ? i + i + 1 : i + i + 1 - c.length)
        }
        return c
    }

    const swapNum = (arr: string[], a: number, b: number) => {
        let ar = arr.slice()
        let c = ar[b]
        ar[b] = ar[a]
        ar[a] = c
        return ar
    }

    function onChange(sourceId: string, sourceIndex: number, targetIndex: number, targetId?: string) {
        const source = sourceId === "cloud" ? cloud : translate
        const setSource = sourceId === "cloud" ? setCloud : setTranslate
        if (targetId) {
            const target = targetId === "cloud" ? cloud : translate
            const setTarget = targetId === "cloud" ? setCloud : setTranslate
            const result = move(
                source,
                target,
                sourceIndex,
                targetIndex
            );
            setSource(result[0])
            setTarget(result[1])
            return;
        }

        const result = swap(source, sourceIndex, targetIndex);
        setSource(result)
    }

    const check = () => {
        let a: string[] = []
        for (let item of translate) {
            a.push(item.title)
        }
        if (a.join(" ") !== english) setError(true)
        else speak({text:english,voice:window.speechSynthesis.getVoices()[3]})
    }

    return (
        <GridContextProvider onChange={onChange}>
            <div className="container">
                <div>
                    <div className="lines">
                        <div className="line"/>
                        <div className="line"/>
                        <div className="line"/>
                    </div>
                    <GridDropZone
                        className="dropzone left"
                        id="translate"
                        boxesPerRow={6}
                        rowHeight={45}
                    >
                        {translate.map(item => (
                            <GridItem key={item.id}>
                                <div className="grid-item">
                                    <div className='grid-item-content'>
                                        <Title size="little" text={item.title}/>
                                    </div>
                                </div>
                            </GridItem>
                        ))}
                    </GridDropZone>
                </div>
                <div>
                    <GridDropZone
                        className="dropzone right"
                        id="cloud"
                        boxesPerRow={6}
                        rowHeight={45}
                    >
                        {cloud.map(item => (
                            <GridItem key={item.id}>
                                <div className="grid-item">
                                    <div className='grid-item-content'>
                                        <Title size="little" text={item.title}/>
                                    </div>
                                </div>
                            </GridItem>
                        ))}

                    </GridDropZone>
                </div>
            </div>
            {error && <Title error={error} text={"Something wrong!"} size="medium"/>}
            <Button onClick={() => check()}/>
        </GridContextProvider>
    );
}