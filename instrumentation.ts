import { registerOTel } from "@vercel/otel"
import { NodeSDK } from '@opentelemetry/sdk-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'

export function register() {
  // Register Vercel's built-in OpenTelemetry
  registerOTel("grimoire")

  // For local development or custom configuration, we can set up our own SDK
  if (process.env.OTEL_ENABLED === 'true') {
    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'grimoire',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      }),
      spanProcessors: [
        // Use OTLP exporter if endpoint is configured
        ...(process.env.OTEL_EXPORTER_OTLP_ENDPOINT
          ? [new BatchSpanProcessor(new OTLPTraceExporter())]
          : []),
        // Always include console exporter in development
        ...(process.env.NODE_ENV !== 'production'
          ? [new BatchSpanProcessor(new ConsoleSpanExporter())]
          : []),
      ],
    })

    sdk.start()
  }
}
