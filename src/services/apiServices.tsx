
const BASE_URL = process.env.REACT_APP_BACKEND_HOST
const classifyPath = BASE_URL + '/api/classify'


/**
 * 
 * @returns {String} document path static url
 */
export async function uploadFile(file: any, keywords: string) {

    const formData = new FormData()
    formData.append('document',file)
    formData.append('keywords', keywords)

    const options:RequestInit = {
        method:'POST',
        headers: {},      
        body: formData,
        
    }

    try{
        let data = await fetch(classifyPath, options)
        return await data.json()
    }catch(e){
        console.log(e)
        return;
    }
    
}