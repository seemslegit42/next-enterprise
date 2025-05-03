"use client";

import { useState, useEffect } from "react";
import { Card, Text, Flex, Input, Textarea, Select, Button } from "@/once-ui/components";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Node } from "reactflow";
import { useAgents } from "@/hooks/useAgents";
import { NodeType } from "@/interfaces/workflow.interface";

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onNodeChange: (nodeId: string, data: any) => void;
}

export function PropertiesPanel({ selectedNode, onNodeChange }: PropertiesPanelProps) {
  const { agents, isLoading: agentsLoading } = useAgents();
  const [nodeData, setNodeData] = useState<any>({
    label: "",
    description: "",
  });

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setNodeData({
        label: selectedNode.data.label || "",
        description: selectedNode.data.description || "",
      });
    }
  }, [selectedNode]);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    const updatedData = { ...nodeData, [field]: value };
    setNodeData(updatedData);

    if (selectedNode) {
      onNodeChange(selectedNode.id, updatedData);
    }
  };

  if (!selectedNode) {
    return (
      <Card
        padding="4"
        radius="lg"
        border="neutral-alpha-weak"
        background="surface"
        style={{ width: "100%" }}
      >
        <Text weight="semibold" marginBottom="4">
          Node Properties
        </Text>
        <Text color="foreground-subtle">
          Select a node to view and edit its properties
        </Text>
      </Card>
    );
  }

  return (
    <Card
      padding="4"
      radius="lg"
      border="neutral-alpha-weak"
      background="surface"
      style={{ width: "100%" }}
    >
      <Text weight="semibold" marginBottom="4">
        Node Properties
      </Text>

      <ScrollArea.Root className="overflow-hidden">
        <ScrollArea.Viewport className="w-full max-h-[calc(100vh-300px)]">
          <Flex direction="column" gap="4">
            <Input
              label="Label"
              value={nodeData.label}
              onChange={(e) => handleChange("label", e.target.value)}
            />

            <Textarea
              label="Description"
              value={nodeData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {/* Additional properties based on node type */}
            {selectedNode.type === "decision" && (
              <Select
                label="Decision Type"
                options={[
                  { label: "Condition", value: "condition" },
                  { label: "Switch", value: "switch" },
                ]}
                value={nodeData.decisionType || "condition"}
                onSelect={(value) => handleChange("decisionType", value)}
              />
            )}

            {selectedNode.type === "task" && (
              <>
                <Input
                  label="Task Name"
                  value={nodeData.taskName || ""}
                  onChange={(e) => handleChange("taskName", e.target.value)}
                />
                <Select
                  label="Priority"
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                  ]}
                  value={nodeData.priority || "medium"}
                  onSelect={(value) => handleChange("priority", value)}
                />
              </>
            )}

            {selectedNode.type === NodeType.AGENT_TASK && (
              <>
                <Select
                  label="Agent"
                  options={agentsLoading ? [] : agents.map(agent => ({
                    label: agent.name,
                    value: agent.id
                  }))}
                  value={nodeData.agentId || ""}
                  onSelect={(value) => {
                    const selectedAgent = agents.find(a => a.id === value);
                    handleChange("agentId", value);
                    if (selectedAgent) {
                      handleChange("agentName", selectedAgent.name);
                      handleChange("agentProvider", selectedAgent.provider);
                    }
                  }}
                  placeholder={agentsLoading ? "Loading agents..." : "Select an agent"}
                />
                <Textarea
                  label="Task Prompt"
                  value={nodeData.taskPrompt || ""}
                  onChange={(e) => handleChange("taskPrompt", e.target.value)}
                  placeholder="Enter instructions for the agent"
                />
                <Select
                  label="Output Format"
                  options={[
                    { label: "Text", value: "text" },
                    { label: "JSON", value: "json" },
                    { label: "Markdown", value: "markdown" },
                  ]}
                  value={nodeData.outputFormat || "text"}
                  onSelect={(value) => handleChange("outputFormat", value)}
                />
              </>
            )}

            {/* Delete node button */}
            <Button
              variant="danger"
              label="Delete Node"
              onClick={() => {
                // This would be handled by the parent component
                // We'll pass the event up through a callback if needed
              }}
            />
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
