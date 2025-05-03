import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export const metadata: Metadata = {
  title: "Tasks Dashboard",
  description: "Manage your tasks",
};

export default async function TasksPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard/tasks");
  }

  // Fetch tasks for the current user
  const tasks = await prisma.task.findMany({
    where: {
      assignedTo: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track your tasks
          </p>
        </div>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">You don't have any tasks yet.</p>
          <button
            type="button"
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : task.status === "running"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : task.status === "failed"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {task.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <button type="button" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Edit
                  </button>
                  <button type="button" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
