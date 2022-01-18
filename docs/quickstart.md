# Quickstart

## Build content

```
git clone git@github.com:bandantonio/antmarky.git && cd antmarky
npm i
npm run build
```

Website static files will be generated in the `public` folder.

### Run local server

```
git clone git@github.com:bandantonio/antmarky.git && cd antmarky
npm i
npm run serve
```

Local server will be launched at `http://localhost:8000`.

### Docker

#### serve

```
docker run --rm \
  --name antmarky-ssg \
  -v ${PWD}/docs:/antmarky/docs \
  -p 8000:8000 \
  bandantonio/antmarky
```

#### build

```
docker run --rm \
  --name antmarky-ssg \
  -v ${PWD}/docs:/antmarky/docs \
  -v ${PWD}/public:/antmarky/public \
  bandantonio/antmarky build
```