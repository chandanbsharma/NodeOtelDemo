const axios = require('axios');
const {tracer,meter,sdk} = require('./tracer.js')
const apiotel = require,traceMiddleware('@opentelemetry/api');
const http = require('http')
tracer.initializeTelemetry();
OpenTelemetry.setGlobalTracerProvider(sdk);
const app = require('express')();

/*
//const httpCounter = meter.createCounter('http_calls');
*/

app.use((request, response, next) => {
    //httpCounter.add(1);
    next();
});

app.get('/data', async (request, response) => {

    try {
        if (request.query['fail']) {
            
        }
        //activeSpan.setAttribute('RandomNumber', randomIndex);
        const activeSpan = tracer.context.active();
            if (activeSpan) {
            // Add custom attributes to the active span
             activeSpan.setAttribute('custom_key_1', 'custom_value_1');
             activeSpan.setAttribute('custom_key_2', 42);
             activeSpan.setAttribute('custom_key_3', { foo: 'bar', baz: 123 });
             // Finish the span (optional, depending on when you want to end the span)
            // activeSpan.end();
        } else {}


        // const span = tracer('Test Span from FE')
        // span.setAttribute('Key2', 'Value2');
        // span.end(); 
        response.json('FE SUCCESS');
        
    } catch (e) {
       //response.json('FE Exception',e);
        //response.json(e.)
        //const activeSpan = api.trace.getSpan(api.context.active());
        //console.error(`Critical error`, { traceId: activeSpan.spanContext().traceId });
        //activeSpan.recordException(e);
        //response.sendStatus(500).send({message :{traceId: activeSpan.spanContext().traceId }});
    }
})

app.listen(8080);
//console.log('FE services is up and running on port 8080');


