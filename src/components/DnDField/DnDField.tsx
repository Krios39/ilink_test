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
import {useSpeechSynthesis} from 'react-speech-kit';

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
        function getWordArr() {
            let a: Word[] = []
            let b = arrShuffle(english.split(" "))
            b.map((word, index) => {
                return a.push({
                    id: index,
                    title: word
                })
            })

            return a
        }

        if (english) setCloud(getWordArr())
    }, [english])

    useEffect(() => {
        setError(false)
    }, [translate])

    useEffect(() => {
        function sortCloud() {
            const sortedCloud = cloud.slice().sort((a, b) => a.id - b.id)
            let isCloudNotSorted = false
            for (let i = 0; i < cloud.length; i++) {
                if (cloud[i].id !== sortedCloud[i].id) {
                    isCloudNotSorted = true
                }
            }
            if (isCloudNotSorted) setCloud(sortedCloud)
        }

        sortCloud()
    }, [cloud])

    const arrShuffle = (arr: string[]) => {
        let shuffledArr = arr.slice()
        for (let i = 0; i < arr.length; i++) {
            let secondElement: number
            if (2 * i + 1 < shuffledArr.length) secondElement = 2 * i + 1
            else secondElement = 2 * i + 1 - shuffledArr.length

            shuffledArr = swapNum(shuffledArr, i, secondElement)
        }
        return shuffledArr
    }

    const swapNum = (arr: string[], a: number, b: number) => {
        let ar = arr.slice()
        let tmp = ar[b]
        ar[b] = ar[a]
        ar[a] = tmp
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
        translate.map((word) => a.push(word.title))

        const isSentencesEqual = a.join(" ") === english
        if (isSentencesEqual) speak({text: english, voice: window.speechSynthesis.getVoices()[3]})
        else setError(true)
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