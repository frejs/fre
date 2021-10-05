import {renderToString, h} from "../../../src";
import App from './App';

const express = require('express');
const app = express();

app.get('*', (req, res) => {
    const string = renderToString(<App/>);
    res.send(`
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fre App</title>
    <style>
    </style>
  </head>
  <body>
    <div id="app">
      ${string}
    </div>
    <script type="module" src="/src/ssr/client.tsx"></script>
    <script>
    </script>
  </body>
</html>`)
})

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})
