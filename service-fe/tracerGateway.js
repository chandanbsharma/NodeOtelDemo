"use strict";
const  opentelemetry  = require("@opentelemetry/sdk-node");
const { NodeTracerProvider } = require( '@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter, } = require( '@opentelemetry/sdk-trace-base');
const { Resource } = require( '@opentelemetry/resources');
const { SemanticResourceAttributes } = require( '@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations     } = require( '@opentelemetry/auto-instrumentations-node');
const { AlwaysOnSampler, AlwaysOffSampler, ParentBasedSampler, TraceIdRatioBasedSampler } = require( '@opentelemetry/core');
//const { CollectorTraceExporter, CollectorMetricExporter, } = require( '@opentelemetry/exporter-collector');
//onst { OTLPTraceExporterHttp  } = require( '@opentelemetry/exporter-trace-otlp-http');
const { OTLPTraceExporter   } = require( '@opentelemetry/exporter-trace-otlp-grpc');
const { CollectorMetricExporterHttp } = require( '@opentelemetry/exporter-metrics-otlp-http');
const { HttpInstrumentation } = require( '@opentelemetry/instrumentation-http');
const { ExpressInstrumentation, ExpressRequestHookInformation } = require( 'opentelemetry-instrumentation-express');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
//Provider
    const serviceName = "frontend-service";
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            'my-vfresource':'CCS',
        })
    });
//trace
// url: 'http://10.16.13.115:4317/',
// url: 'http://10.16.13.115:4318/v1/traces',
// url: 'http://10.16.2.40:4318/v1/traces',

const collectorOptions = {
    url: 'http://10.16.4.254:4318/v1/traces',
    headers: {
       'Test': 'T1',
    },
};

const collectorgRPC = {
    url: 'http://10.16.4.254:4317'
};

    const traceExportergRPC = new OTLPTraceExporter(collectorgRPC);
    //const traceExporter = new OTLPTraceExporterHttp(collectorOptions);
    const traceExporterG = new TraceExporter();
        provider.addSpanProcessor(new SimpleSpanProcessor(traceExporterG));
        provider.register();
    const sdk = new opentelemetry.NodeSDK({
            traceExporter: [traceExporterG],
            registerInstrumentations: [
              {
                instrumentations: [
                  getNodeAutoInstrumentations({
                    '@opentelemetry/instrumentation-fs': { enabled: false }
                  })
                ]
              }
            ]
          });
          
          async function initializeTelemetry() {

        await sdk.start()
            
       module.exports = sdk; 
          }
