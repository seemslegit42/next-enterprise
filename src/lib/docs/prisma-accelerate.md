--- src/lib/docs/prisma-accelerate.md
+++ src/lib/docs/prisma-accelerate.md
@@ -0,0 +1,107 @@
+# Using Prisma Accelerate in Grimoire
+
+This document explains how to use Prisma Accelerate's caching features in the Grimoire project.
+
+## What is Prisma Accelerate?
+
+Prisma Accelerate is a connection pooling and caching service for Prisma that:
+
+1. Provides connection pooling to prevent database connection limits
+2. Offers query caching to improve performance
+3. Allows for cache invalidation when data changes
+
+## Setup
+
+The project has been configured to use Prisma Accelerate. The setup includes:
+
+1. Installing the `@prisma/extension-accelerate` package
+2. Configuring the Prisma client to use the extension in `src/lib/prisma.ts`
+3. Setting up the correct DATABASE_URL in your environment variables
+
+### Environment Variables
+
+For production, use the Prisma Accelerate connection string in your `.env` file:
+
+```
+DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your-accelerate-api-key"
+```
+
+For local development, you can continue using your direct database connection:
+
+```
+DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grimoire?schema=public"
+```
+
+## Using Caching
+
+### Basic Caching
+
+To cache a query for a specific duration:
+
+```typescript
+const users = await prisma.user.findMany({
+  cacheStrategy: { 
+    swr: 60, // Cache for 60 seconds
+  }
+});
+```
+
+### Caching with Tags
+
+You can add tags to your cached queries for more granular control:
+
+```typescript
+const users = await prisma.user.findMany({
+  cacheStrategy: { 
+    swr: 60,
+    tags: ["allUsers"],
+  }
+});
+```
+
+### Invalidating Cache
+
+When data changes, you can invalidate specific caches using tags:
+
+```typescript
+// Invalidate all queries tagged with "allUsers"
+await prisma.$accelerate.invalidate({
+  tags: ["allUsers"],
+});
+```
+
+## Best Practices
+
+1. **Use meaningful tags**: Create a consistent tagging strategy (e.g., `collection:id` format)
+2. **Cache duration**: Choose appropriate cache durations based on how frequently data changes
+3. **Invalidate strategically**: Invalidate caches when data is modified
+4. **Combine with transactions**: For complex operations, use transactions to ensure data consistency
+
+## Example Patterns
+
+See `src/lib/examples/prisma-accelerate-example.ts` for practical examples of:
+
+- Caching queries with different strategies
+- Using tags for targeted invalidation
+- Updating data and invalidating related caches
+
+## Monitoring
+
+Prisma Accelerate provides a dashboard where you can monitor:
+
+- Query performance
+- Cache hit rates
+- Connection pool usage
+
+Access the dashboard through your Prisma Data Platform account.
+
+## Troubleshooting
+
+If you encounter issues with caching:
+
+1. Verify your Accelerate API key is correct
+2. Check that the Prisma client is properly configured with the extension
+3. Ensure your DATABASE_URL is using the correct format
+4. Verify that the `withAccelerate()` extension is applied to your Prisma client
+
+For more information, see the [Prisma Accelerate documentation](https://www.prisma.io/docs/accelerate).