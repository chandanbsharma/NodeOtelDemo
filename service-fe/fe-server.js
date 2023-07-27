const axios = require('axios');
const {tracer,meter,sdk,traceMiddleware} = require('./tracerCollector.js');
const { trace, context } = require('@opentelemetry/api');
const http = require('http');
const app = require('express')();
app.use(traceMiddleware);

async function start() {
    await initializeTelemetry();
  }
app.get('/data', async (request, response) => {

    try {
        if (request.query['fail']) {
            //addition for backend service
            //const user = await axios.get('http://34.70.56.47/user');
            }
            const activeSpan = trace.getSpan(context.active());
            if (activeSpan) {
             activeSpan.setAttribute('custom_key_1', 'Frontend Call');
             activeSpan.setAttribute('custom_key_2', 42);
            // activeSpan.end();
            } else {}
        response.json('FE SUCCESS');
    } catch (e) {
    }
})

app.listen(8080);


