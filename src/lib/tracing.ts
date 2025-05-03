import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

// Create a tracer for our application
const tracer = trace.getTracer('grimoire-api');

/**
 * Wraps an API route handler with OpenTelemetry tracing
 * 
 * @param handler The API route handler function
 * @param routeName The name of the route for the span
 * @returns A wrapped handler function with tracing
 */
export function withTracing<T>(
  handler: (req: NextRequest, params?: any) => Promise<NextResponse<T>>,
  routeName: string
) {
  return async function tracedHandler(req: NextRequest, params?: any): Promise<NextResponse<T>> {
    // Extract useful information from the request
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Create a span for this request
    return tracer.startActiveSpan(`${method} ${routeName}`, async (span) => {
      try {
        // Add attributes to the span
        span.setAttributes({
          'http.method': method,
          'http.url': req.url,
          'http.path': path,
          'http.route': routeName,
          'http.query': Object.fromEntries(url.searchParams.entries()),
        });

        // If there are route params, add them to the span
        if (params) {
          span.setAttributes({
            'http.params': JSON.stringify(params),
          });
        }

        // Execute the original handler
        const response = await handler(req, params);
        
        // Add response information to the span
        span.setAttributes({
          'http.status_code': response.status,
        });

        // If the response is JSON, try to extract success status
        try {
          const responseData = await response.clone().json() as ApiResponse;
          span.setAttributes({
            'response.success': responseData.success,
          });

          if (!responseData.success && responseData.error) {
            span.setAttributes({
              'response.error': responseData.error,
            });
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }

        // End the span with success
        span.setStatus({ code: SpanStatusCode.OK });
        return response;
      } catch (error) {
        // Record the error and end the span with failure
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        span.setAttributes({
          'error.message': errorMessage,
        });
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: errorMessage,
        });
        
        // Re-throw the error to be handled by the API route
        throw error;
      } finally {
        span.end();
      }
    });
  };
}

/**
 * Wraps a Prisma database operation with OpenTelemetry tracing
 * 
 * @param operation The database operation function
 * @param operationName The name of the operation for the span
 * @returns The result of the operation
 */
export async function traceDbOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  return tracer.startActiveSpan(`db.${operationName}`, async (span) => {
    try {
      const result = await operation();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      span.setAttributes({
        'error.message': errorMessage,
      });
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: errorMessage,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
