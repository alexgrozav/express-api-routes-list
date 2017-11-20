'use strict';


import { Application } from 'express';
import * as CLITable from 'cli-table';


const apiTable = new CLITable({
    head: [
        'Method',
        'Route',
    ],
});


/**
 * Generate HTML based on the rows and columns of the api table
 *
 * @param layerPath
 */
apiTable.toHtml = function() {
    let html = '<table class="table">';
    html += '<thead>';
    html += '<tr>';
    html += this.options.head.map((th) => `<th>${ th }</th>`).join('');
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    for (let i = 0; i < this.length; i++) {
        html += '<tr>';
        html += this[i].map((td) => `<td>${ td }</td>`).join('');
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';

    return html;
};


/**
 * Split the given Express Layer element based on its type.
 *
 * @param layerPath
 */
const split = (layerPath) => {
    if (typeof layerPath === 'string') {
        return layerPath.split('/');
    } else if (layerPath.fast_slash) {
        return '';
    } else {
        const match = layerPath.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);

        return match
            ? match[1].replace(/\\(.)/g, '$1').split('/')
            : '<complex:' + layerPath.toString() + '>';
    }
};


/**
 * Return a string containing routes for the given router stack
 *
 * @param path
 * @param layer
 */
const addToTable = (path, layer) => {
    if (layer.route) {
        layer.route.stack.forEach(addToTable.bind(null, path.concat(split(layer.route.path))));
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(addToTable.bind(null, path.concat(split(layer.regexp))));
    } else if (layer.method) {
        apiTable.push([
            layer.method.toUpperCase(),
            path.concat(split(layer.regexp)).filter(Boolean).join('/'),
        ]);
    }
};


/**
 * An extremely hacky way of listing all API routes. Should not be used in
 * production under any circumstances.
 */
export let listRoutes = (app) => {
    // Go through the router stack and add the entries to the API table
    app._router.stack.forEach(addToTable.bind(null, []));

    return {
        cli: apiTable.toString(),
        html: apiTable.toHtml(),
    };
};


export default listRoutes;
