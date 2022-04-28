downloaded modules: 
npm install express body-parser mysql
npm install nodemon

Backend project is running in 3001 as http://localhost:3000/ is running by the front end React.

to run the test: type command in the console: 

npm run devStart:
means running a development environment through nodemon automatically. will help us run the website by just refreshing:)"scripts": {
    "start": "node index.js",
    "devStart": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
this was written/instructed in the package.json
"scripts": {
    "start": "node index.js",
    "devStart": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },