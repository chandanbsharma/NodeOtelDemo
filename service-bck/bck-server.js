const axios = require('axios');
const {tracer,meter,sdk,traceMiddleware} = require('./tracer.js')
const { trace, context } = require('@opentelemetry/api');
const http = require('http')
const app = require('express')();
const randomNumber = (min, max) => Math.floor(Math.random() * max + min);
app.use(traceMiddleware);
async function start() {
    await initializeTelemetry();
}

app.get('/user', async (request, response) => {
    const randomIndex = randomNumber(0, 1000)
    const activeSpan =  trace.getSpan(context.active());
    activeSpan.setAttribute('RandomNumber', randomIndex);
    activeSpan.setAttribute('Source', 'Backend Service')
    activeSpan.addEvent('A number was randomizaed', {
        randomIndex
    })
    response.json(randomIndex);
   })

app.listen(8090);
console.log('users services is up and running on port 8090');
