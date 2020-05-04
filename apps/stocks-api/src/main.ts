'use strict';
export {};

const Hapi = require('@hapi/hapi');
const fetch = require('node-fetch');

const init = async () => {

    const server = Hapi.server({
        port: 3333,
        host: 'localhost'
    });

    const GetDataFunc = function (symbol) {      
        const promise = new Promise((resolve, reject) => {
            return fetch('https://sandbox.iexapis.com/beta/stock/'+ symbol +'/chart/5d?token=Tsk_f0daf2171bab4a6ebf7b2ae104e8ee1c')
                .then(res => res.json())
                .then(body => resolve(body))
                .catch(err => {
                    console.log(err);
                    reject(err)
                });
        });
        return promise;
    }

    const sumCache = server.cache({
      cache: '',
      expiresIn: 100 * 1000,
      segment: 'customSegment',
      generateFunc: async (symbol) => {
          return await GetDataFunc(symbol);
      },
      generateTimeout: 2000
    });

    server.route({
        method: 'GET',
        path: '/stock',
        options: {
          cors: true,
          handler: async function (request, h) {          
          return await sumCache.get(request.query.symbol);
      }
    }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();