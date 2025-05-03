"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, Text, Flex, Icon } from "@/once-ui/components";

// Define node types and their icons
const nodeIcons = {
  input: "play",
  output: "check",
  default: "box",
  decision: "git-branch",
  process: "cpu",
  task: "list-check",
  agentTask: "bot",
};

const CustomNode = memo(({ data, isConnectable, type = "default" }: NodeProps) => {
  // Determine the icon based on the node type
  const iconName = nodeIcons[type] || nodeIcons.default;

  return (
    <Card
      padding="4"
      radius="lg"
      border="neutral-alpha-weak"
      background="surface"
      shadow="sm"
      className="runeforge-node"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="runeforge-handle"
      />

      <Flex direction="column" gap="2">
        <Flex horizontal="space-between" vertical="center" gap="2">
          <Flex gap="2" vertical="center">
            <Icon name={iconName} size="s" />
            <Text weight="semibold">{data.label}</Text>
          </Flex>
        </Flex>

        {data.description && (
          <Text size="xs" color="foreground-subtle">
            {data.description}
          </Text>
        )}
      </Flex>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="runeforge-handle"
      />
    </Card>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
