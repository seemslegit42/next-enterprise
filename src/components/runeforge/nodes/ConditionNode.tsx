"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, Text, Flex, Icon } from "@/once-ui/components";

const ConditionNode = memo(({ data, isConnectable }: NodeProps) => {
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
            <Icon name="git-branch" size="s" color="orange" />
            <Text weight="semibold">{data.label || "Condition"}</Text>
          </Flex>
        </Flex>

        {data.condition && (
          <Text size="xs" color="foreground-subtle">
            Condition: {data.condition}
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
        id="true"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="runeforge-handle"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        id="false"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="runeforge-handle"
        style={{ left: '75%' }}
      />
    </Card>
  );
});

ConditionNode.displayName = "ConditionNode";

export default ConditionNode;
