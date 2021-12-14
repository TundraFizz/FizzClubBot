# Fizz Club Bot

Project setup
```
yarn install
yarn i -g purgecss
yarn i -g vue-asset-generate
```

Serve frontend/backend for local development
```
yarn run api_local
yarn run vue_local
./ngrok.exe http --hostname=tundra.ngrok.io 80
./ngrok.exe http --hostname=fizz.ngrok.io   9001
```

Compile and minify for production, then serve frontend/backend for the dev environment
```
yarn run api_dev
yarn run vue_dev
```

??????????
```
yarn run build_backend
yarn run build_frontend
purgecss --css .\dist\bootstrap-4.5.3.min.css --content .\dist\**\*.js --output .\dist\bootstrap-4.5.3.min.css
```

Test the production build  (port 3000)
```
node ./server.js
```

Generate new PWA icons
```
vue-asset-generate -a icon.png -o img
```

Run on the production server
```
yarn install -g serve # First make sure that "serve" is installed globally
serve -s dist --listen 8001
serve -s dist --listen 8002
serve -s dist --listen 8003
serve -s dist --listen 8004
serve -s dist --listen 8005
serve -s dist --listen 8006
serve -s dist --listen 8007
serve -s dist --listen 8008
```
