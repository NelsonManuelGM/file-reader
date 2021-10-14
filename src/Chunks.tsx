import React, { useState } from "react";
import { Button } from "rsuite";
import { uploadChunks } from './services/apiServices';


const ChucksExample = () => {
    const [file, setFile] = useState<File>();
    const [percentage, setPercentage] = useState(0)

    function onChangeCallback(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.currentTarget.files) {
            let file = e.currentTarget.files[0]
            setFile(file)
        }
    }

    const updateProgressCB = (chunksNumber: number, currentNumber: number) => {
        let _percentage = Math.floor(currentNumber * 100 / chunksNumber)
        setPercentage(_percentage)
    }

    async function onClickCallback() {
        if (file) {
            uploadChunks(file, updateProgressCB)
        }
    }

    return <>
        <input type="file" onChange={onChangeCallback} />
        <Button appearance="primary" onClick={onClickCallback}>
            Submit chunks
        </Button>
        <>{percentage}%</>
    </>
}

export default ChucksExample