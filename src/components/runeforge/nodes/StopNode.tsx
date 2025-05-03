"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, Text, Flex, Icon } from "@/once-ui/components";

const StopNode = memo(({ data, isConnectable }: NodeProps) => {
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
            <Icon name="square" size="s" color="red" />
            <Text weight="semibold">{data.label || "Stop"}</Text>
          </Flex>
        </Flex>

        {data.description && (
          <Text size="xs" color="foreground-subtle">
            {data.description}
          </Text>
        )}
      </Flex>
    </Card>
  );
});

StopNode.displayName = "StopNode";

export default StopNode;
