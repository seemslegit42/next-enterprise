"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, Text, Flex, Icon } from "@/once-ui/components";

const AgentTaskNode = memo(({ data, isConnectable }: NodeProps) => {
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
            <Icon name="bot" size="s" color="indigo" />
            <Text weight="semibold">{data.label || "Agent Task"}</Text>
          </Flex>
        </Flex>

        {data.agentName && (
          <Text size="xs" color="foreground-subtle">
            Agent: {data.agentName}
          </Text>
        )}

        {data.agentProvider && (
          <Text size="xs" color="foreground-subtle">
            Provider: {data.agentProvider}
          </Text>
        )}

        {data.taskPrompt && (
          <Text size="xs" color="foreground-subtle">
            Prompt: {data.taskPrompt.substring(0, 50)}...
          </Text>
        )}

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

AgentTaskNode.displayName = "AgentTaskNode";

export default AgentTaskNode;
