"use strict";
const  opentelemetry  = require("@opentelemetry/sdk-node");
const { NodeTracerProvider } = require( '@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter, } = require( '@opentelemetry/sdk-trace-base');
const { Resource } = require( '@opentelemetry/resources');
const { SemanticResourceAttributes } = require( '@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations     } = require( '@opentelemetry/auto-instrumentations-node');
const { AlwaysOnSampler, AlwaysOffSampler, ParentBasedSampler, TraceIdRatioBasedSampler } = require( '@opentelemetry/core');
const { OTLPTraceExporter   } = require( '@opentelemetry/exporter-trace-otlp-grpc');
const { CollectorMetricExporterHttp } = require( '@opentelemetry/exporter-metrics-otlp-http');
const { HttpInstrumentation } = require( '@opentelemetry/instrumentation-http');
const { ExpressInstrumentation, ExpressRequestHookInformation } = require( 'opentelemetry-instrumentation-express');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { OpenTelemetry } = require('@opentelemetry/api');
//Provider
    const serviceName = "frontend-service";
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            'my-vfresource':'Backend',
        })
    });
    //Trace Exporter Google Cloud
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
                  }),
                new ExpressInstrumentation(),
                new HttpInstrumentation({
                    requestHook: (span, request) => {
                      span.setAttribute("Key1", "Value1");
                    },
                }),
                ]
              }
              
            ]
          });
    function traceMiddleware(req, res, next) {
        const traceHeader = req.header('traceparent');
            if (traceHeader) {
              // Set the trace context in the active context
              OpenTelemetry.propagation.extract(OpenTelemetry.context.active(), traceHeader);
            }
            next();
    }
    async function initializeTelemetry() {
        await sdk.start()
    }
    // Export the provider instance and the traceMiddleware
    module.exports = {
        provider,
        traceMiddleware,
        sdk
      };  