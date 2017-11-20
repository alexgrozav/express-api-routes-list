# express-routes-list
Generates a pretty printed express API routes table, suitable for either the command line or to be used in HTML.

~~~
const express = require('express');
const routesList = require('express-api-routes-list');

const app = express();

console.log(routesList(app).cli);  // Prints Command Line table
console.log(routesList(app).html); // Prints HTML table
~~~
