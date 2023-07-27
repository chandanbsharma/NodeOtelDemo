"use strict";
const  opentelemetry  = require("@opentelemetry/sdk-node");
const { NodeTracerProvider } = require( '@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter, } = require( '@opentelemetry/sdk-trace-base');
const { Resource } = require( '@opentelemetry/resources');
const { SemanticResourceAttributes } = require( '@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations     } = require( '@opentelemetry/auto-instrumentations-node');
const { AlwaysOnSampler, AlwaysOffSampler, ParentBasedSampler, TraceIdRatioBasedSampler } = require( '@opentelemetry/core');
//const { CollectorTraceExporter, CollectorMetricExporter, } = require( '@opentelemetry/exporter-collector');
const { OTLPTraceExporter  } = require( '@opentelemetry/exporter-trace-otlp-http');
const { CollectorMetricExporter } = require( '@opentelemetry/exporter-metrics-otlp-http');
const { HttpInstrumentation } = require( '@opentelemetry/instrumentation-http');
const { ExpressInstrumentation, ExpressRequestHookInformation } = require( 'opentelemetry-instrumentation-express');

//Provider
    const serviceName = "backend-service";
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            'my-vfresource':'CCS',
        })
    });
//trace

// const collectorOptions = {
//     url: 'http://10.16.13.115:4318/v1/traces',
//     headers: {
//        'Test': 'T1',
//     },
// };

    const traceExporter = new OTLPTraceExporter({
         url: 'http://10.16.4.254:55681/v1/traces',
    });
        provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
        provider.register();
    const sdk = new opentelemetry.NodeSDK({
            traceExporter: traceExporter,
            instrumentations: [getNodeAutoInstrumentations(),
                new HttpInstrumentation(),
                new ExpressInstrumentation({
                    requestHook: (span, reqInfo) => {
                        span.setAttribute('request-headers',JSON.stringify(reqInfo.req.headers))
                    }
                }),
            
            ]
             
        });
       
        sdk.start()
            
       module.exports = sdk; 

        process.on("SIGTERM", () => {
            sdk.shutdown()
        });
