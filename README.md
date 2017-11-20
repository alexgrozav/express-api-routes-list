# express-api-routes-list
Creates a pretty printed express routes table, suitable for printing to the command line or to be used in HTML.

~~~
const express = require('express');
const routesList = require('express-api-routes-list');

const app = express();

console.log(routesList(app).toString());  // Prints Command Line table
console.log(routesList(app).toHtml()); // Prints HTML table
~~~
