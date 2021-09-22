
import React, { memo, useEffect, useRef, useState } from 'react';
import { Button, ButtonProps, Form, FormControl, FormGroup, HelpBlock, Icon, Uploader } from 'rsuite';
import { FileType } from 'rsuite/lib/Uploader';
import 'rsuite/dist/styles/rsuite-default.css';
import styled from 'styled-components';

import { uploadFile } from './services/apiServices';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  
`;
const WrapperForm = styled.div`
  background-color: #d3d3d376 ;
  padding: 25px;
  width: 375px;
  height: 340px;
  border-radius: 10px;
  position: relative;
  left: 5%;
  top: 10%;
`;
const WrapperFile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  left: 10%;
  top: 10%;

 `;

interface dataType {
  oldDocument?: string
  document?: string
  error?: string
}

function App() {
  // * Data to send
  const [keywords, setKeywords] = useState<string>('');
  const [file, setFile] = useState<Array<FileType>>([]);

  // * requested data
  const [data, setData] = useState<dataType>({})
  const [dataFileName, setDataFileName] = useState<dataType>()
  const [oldDataFileName, setOldDataFileName] = useState<dataType>()

  //* validation message
  const [validationError, setValidationError] = useState<boolean>(false);

  //* to stop uploader component to send
  //? this feature could be extended substituting onSubmitCallback unction in this component
  const uploaderRef = useRef(null)

  const keywordsCallback = (formValue: any, e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setKeywords(e.currentTarget.value);
  }

  const fileCallback = (fileParam: any[]) => {
    console.log(fileParam)
    setFile([...file, ...fileParam])
  }

  const onSubmitCallback = async (e: React.FormEvent<ButtonProps>) => {
    e.preventDefault()

    let newData = await uploadFile(file[0].blobFile, keywords)

    if (await newData) {
      setOldDataFileName(newData.oldDocument.split('/').reverse()[0])
      setDataFileName(newData.document.split('/').reverse()[0])
    }
    setData(newData)

    setKeywords('')
    setFile([])
  }

  const referenceCallback = (ref: any) => {
    if (ref) {
      uploaderRef.current = ref;
    }
  }

  const removeFileCallback = (_file: FileType) => {
    file.splice(file.indexOf(_file), 1)
  }


  useEffect(() => {
    keywords.length > 0 && file.length > 0 ? setValidationError(false) : setValidationError(true)

    // ! FOR DEBUG PURPOSE ONLY
    console.log('file ', file)
    console.log('keywords', keywords)
    console.log('validationError', validationError)

  }, [validationError,
    // ! FOR DEBUG PURPOSE ONLY
    file,
    keywords,
  ])
  return <Wrapper>
    <WrapperForm className="App">
      <Form>
        <Uploader
          autoUpload={false}
          multiple={false}
          fileList={file}
          ref={referenceCallback}
          onChange={fileCallback}
          onRemove={removeFileCallback}
        />

        <FormGroup>
          <FormControl name="keywords" required placeholder="Name" onChange={keywordsCallback} />
          <HelpBlock>
            keywords and phrases separated by spaces or
            commas. Phrases will be enclosed in single or double-quotes.
            e.g.1: Hello world “Boston Red Sox”
            e.g.2: ‘Pepperoni Pizza’, ‘Cheese Pizza’, beer
          </HelpBlock>
        </FormGroup>

        <Button appearance="primary" onClick={(e) => !validationError && onSubmitCallback(e)}>
          Submit
        </Button>
      </Form><br />

      {
        validationError && <div style={{ display: 'flex', flexDirection: 'row', color: 'black', alignItems: 'center' }}>
          <Icon icon='exclamation-triangle' /><p style={{ marginLeft: '10px' }}>
            File field and keywords and required!</p></div>
      }
    </WrapperForm >

    {
      data && <WrapperFile>

        {data.document && <>
          <Icon icon='file-text' size="2x" />
          <a href={data.document} download={dataFileName} >
            <h6>new</h6>
          </a>
          <br />
          <Icon icon='file-text' size="2x" />
          <a href={data.oldDocument} download={oldDataFileName} >
            <h6>old</h6>
          </a>
        </>}
        {
          data.error && <>
            <Icon icon='warning' />
            <h5 style={{ color: 'red', margin: '3px' }}>{data.error}</h5>
          </>
        }
      </WrapperFile>
    }
  </Wrapper>
}

export default memo(App);

