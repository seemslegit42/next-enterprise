/**
 * This file demonstrates how to use Prisma Accelerate's caching features
 */
import prisma from '../prisma';

/**
 * Example function showing how to use Prisma Accelerate's caching
 */
export async function getUsersWithCache() {
  // This query will be cached for 60 seconds
  const users = await prisma.user.findMany({
    cacheStrategy: { 
      swr: 60, // Cache for 60 seconds
      tags: ["allUsers"], // Optional tag for cache invalidation
    }
  });
  
  return users;
}

/**
 * Example function showing how to invalidate a specific cache
 */
export async function invalidateUserCache() {
  // Invalidate the cache for queries tagged with "allUsers"
  await prisma.$accelerate.invalidate({
    tags: ["allUsers"],
  });
}

/**
 * Example function showing how to use cache with a specific user query
 */
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    cacheStrategy: { 
      swr: 30, // Cache for 30 seconds
      tags: [`user:${id}`], // Tag with user ID for targeted invalidation
    }
  });
  
  return user;
}

/**
 * Example function showing how to invalidate cache for a specific user
 */
export async function invalidateUserById(id: string) {
  // Invalidate the cache for a specific user
  await prisma.$accelerate.invalidate({
    tags: [`user:${id}`],
  });
}

/**
 * Example function showing how to update a user and invalidate cache
 */
export async function updateUserAndInvalidateCache(id: string, data: any) {
  // Update the user
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });
  
  // Invalidate both the specific user cache and the all users cache
  await prisma.$accelerate.invalidate({
    tags: [`user:${id}`, "allUsers"],
  });
  
  return updatedUser;
}