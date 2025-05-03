"use client";

import { useCallback } from "react";
import { Card, Text, Flex, Button, Icon } from "@/once-ui/components";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { NodeType } from "@/interfaces/workflow.interface";

// Node types with their descriptions
const nodeTypes = [
  {
    type: NodeType.START,
    label: "Start Node",
    description: "Starting point of a workflow",
    icon: "play",
  },
  {
    type: NodeType.STOP,
    label: "Stop Node",
    description: "End point of a workflow",
    icon: "square",
  },
  {
    type: NodeType.LOG_MESSAGE,
    label: "Log Message",
    description: "Logs a message to the system",
    icon: "message-square",
  },
  {
    type: NodeType.CONDITION,
    label: "Condition",
    description: "Branches workflow based on a condition",
    icon: "git-branch",
  },
  {
    type: NodeType.TASK,
    label: "Task Node",
    description: "Represents a task to be performed",
    icon: "list-check",
  },
  {
    type: NodeType.PROCESS,
    label: "Process Node",
    description: "Represents a process or operation",
    icon: "cpu",
  },
  {
    type: NodeType.AGENT_TASK,
    label: "Agent Task",
    description: "Executes a task using an AI agent",
    icon: "bot",
  },
];

interface NodePaletteProps {
  onAddNode: (type: string) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const handleDragStart = useCallback(
    (event, nodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  return (
    <Card
      padding="4"
      radius="lg"
      border="neutral-alpha-weak"
      background="surface"
      style={{ width: "100%" }}
    >
      <Text weight="semibold" marginBottom="4">
        Node Palette
      </Text>

      <ScrollArea.Root className="overflow-hidden">
        <ScrollArea.Viewport className="w-full max-h-[calc(100vh-300px)]">
          <Flex direction="column" gap="3">
            {nodeTypes.map((node) => (
              <Card
                key={node.type}
                padding="3"
                radius="md"
                border="neutral-alpha-weak"
                background="page"
                className="cursor-grab"
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
                onClick={() => onAddNode(node.type)}
              >
                <Flex gap="3" vertical="center">
                  <Icon name={node.icon} size="s" />
                  <Flex direction="column">
                    <Text weight="semibold" size="sm">
                      {node.label}
                    </Text>
                    <Text size="xs" color="foreground-subtle">
                      {node.description}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Card>
  );
}
