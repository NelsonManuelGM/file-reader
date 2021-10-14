
const BASE_URL = process.env.REACT_APP_BACKEND_HOST
const classifyPath = BASE_URL + '/api/classify'
const requestUploadPath = BASE_URL + '/api/request_upload'
const uploadPath = BASE_URL + '/api/upload'


/**
 * 
 * @returns {String} document path static url
 */
export async function uploadFile(file: any, keywords: string) {

    const formData = new FormData()
    formData.append('document', file)
    formData.append('keywords', keywords)

    const options: RequestInit = {
        method: 'POST',
        headers: {},
        body: formData,

    }

    try {
        let data = await fetch(classifyPath, options)
        return await data.json()
    } catch (e) {
        console.log(e)
        return;
    }

}

export async function uploadChunks(file: File, callback: any) {
    const { size, name } = file;
    const chunkSize = 1024 * 1024 * 5; //byte * 5 == 5Kb
    let initialSize = 0

    let chunksNumber = size % chunkSize === 0 ? size / chunkSize : Math.floor(size / chunkSize) + 1;
    let currentNumber = 0;

    const { id: fileID, fileName } = await requestUpload(name)

    while (currentNumber <= chunksNumber) {
        const chuck = file.slice(initialSize, initialSize + chunkSize)

        try {
            const response = await sendChunks(chuck, fileName, fileID, chunksNumber, currentNumber)
            if (response.status === 200) {
                callback(chunksNumber, currentNumber)
            }
        } catch (e) {
            console.log(e)
        }
        initialSize += chunkSize;
        currentNumber += 1;
    }
}

/**
 * 
 * @param chunk {Blob}
 * @param name {String}
 * @param id {String}
 * @param chunksNumber {Number}
 * @param currentNumber {Number}
 * @returns {Promise<void>}
 */
export async function sendChunks(chunk: Blob, name: string, id: string,
    chunksNumber: number, currentNumber: number) {
    let formData = new FormData();

    formData.append('file', chunk, name)

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'x-file-id': id,
            'chunks-number': chunksNumber.toString(),
            'current-number': currentNumber.toString(),
        },
        body: formData,
    }

    return await fetch(uploadPath, options);
}

/**
 * 
 * @param name {String}
 * @returns {Promise<void>}
 */
export async function requestUpload(name: string) {

    const body = {
        'fileName': name
    }

    const options: RequestInit = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    const data = await fetch(requestUploadPath, options)

    return await data.json()
}