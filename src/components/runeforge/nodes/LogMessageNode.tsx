"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, Text, Flex, Icon } from "@/once-ui/components";

const LogMessageNode = memo(({ data, isConnectable }: NodeProps) => {
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
            <Icon name="message-square" size="s" color="blue" />
            <Text weight="semibold">{data.label || "Log Message"}</Text>
          </Flex>
        </Flex>

        {data.message && (
          <Text size="xs" color="foreground-subtle">
            Message: {data.message}
          </Text>
        )}

        {data.level && (
          <Text size="xs" color="foreground-subtle">
            Level: {data.level}
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

LogMessageNode.displayName = "LogMessageNode";

export default LogMessageNode;
