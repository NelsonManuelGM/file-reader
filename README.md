# File reader app

This is a demo for a file reader app that send a .txt document to REST service with a string of keywords in order to cross out words on the document.

Will receive two paths, for the original and the already modified document the to download.

## Pull the project from GitHub

```bash
> git init
> git pull https://github.com/NelsonManuelGM/file-reader.git

```

## Install dependencies and start

### if using npm

```bash
> npm install
> npm start
```

### if using yarn

```bash
> yarn install
> yarn start
```

## Considerations

There is an .env file that **_should not be there_**. But it's there for demoing purpose.

The demo was developed to send **only .txt files** in order to make it simpler.
