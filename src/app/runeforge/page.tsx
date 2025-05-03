"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import "./runeforge.css";

// Import Once UI components
import {
  Flex,
  Grid,
  Text,
  Heading,
  Button,
  Card,
  IconButton,
  Row,
  Column,
  Dialog,
  Input,
  Textarea,
  Select,
  Badge,
  Background as OnceBackground,
} from "@/once-ui/components";

// Import Radix UI components
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Tabs from "@radix-ui/react-tabs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Import animations
import { PageTransition, FadeIn, SlideUp } from "@/components/animations";

// Import custom components
import { NodePalette, PropertiesPanel } from "@/components/runeforge";
import { StartNode, StopNode, LogMessageNode, ConditionNode, AgentTaskNode, CustomNode } from "@/components/runeforge/nodes";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useAgents } from "@/hooks/useAgents";
import { NodeType } from "@/interfaces/workflow.interface";

// Define custom node types
const nodeTypes = {
  [NodeType.START]: StartNode,
  [NodeType.STOP]: StopNode,
  [NodeType.LOG_MESSAGE]: LogMessageNode,
  [NodeType.CONDITION]: ConditionNode,
  [NodeType.TASK]: CustomNode,
  [NodeType.PROCESS]: CustomNode,
  [NodeType.DECISION]: ConditionNode,
  [NodeType.AGENT_TASK]: AgentTaskNode,
  // Fallback for any other node types
  default: CustomNode,
};

// Initial nodes and edges
const initialNodes = [
  {
    id: "1",
    type: NodeType.START,
    data: { label: "Start" },
    position: { x: 250, y: 100 },
  },
  {
    id: "2",
    type: NodeType.LOG_MESSAGE,
    data: {
      label: "Log Message",
      message: "Workflow started",
      level: "info"
    },
    position: { x: 250, y: 200 },
  },
  {
    id: "3",
    type: NodeType.STOP,
    data: { label: "Stop" },
    position: { x: 250, y: 300 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
];

export default function RuneforgeWorkflowBuilder() {
  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // State for dialogs
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  // State for workflow name and description
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);

  // State for selected node
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Reference to the flow wrapper
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Use the workflows hook
  const {
    workflows,
    isLoading,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    fetchWorkflowById,
    executeWorkflow,
    getExecutionStatus,
    cancelExecution
  } = useWorkflows();

  // Use the agents hook to preload agents
  const { fetchAgents } = useAgents();

  // State for execution
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<string | null>(null);
  const [executionPollingInterval, setExecutionPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle node change
  const handleNodeChange = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Fetch workflows and agents on component mount
  useEffect(() => {
    fetchWorkflows();
    fetchAgents();
  }, [fetchWorkflows, fetchAgents]);

  // Handle saving workflow
  const handleSaveWorkflow = async () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        definitionJson: flow,
      };

      if (currentWorkflowId) {
        // Update existing workflow
        await updateWorkflow(currentWorkflowId, workflowData);
      } else {
        // Create new workflow
        const newWorkflow = await createWorkflow(workflowData);
        if (newWorkflow) {
          setCurrentWorkflowId(newWorkflow.id);
        }
      }

      setSaveDialogOpen(false);
    }
  };

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (executionPollingInterval) {
        clearInterval(executionPollingInterval);
      }
    };
  }, [executionPollingInterval]);

  // Poll for execution status updates
  const startPollingExecutionStatus = useCallback((executionId: string) => {
    // Clear any existing polling interval
    if (executionPollingInterval) {
      clearInterval(executionPollingInterval);
    }

    // Set up polling interval
    const interval = setInterval(async () => {
      const status = await getExecutionStatus(executionId);
      if (status) {
        setExecutionStatus(status.state);
        setExecutionResult(status);

        // If execution is completed, failed, or canceled, stop polling
        if (
          status.state === 'COMPLETED' ||
          status.state === 'FAILED' ||
          status.state === 'CANCELED'
        ) {
          clearInterval(interval);
          setExecutionPollingInterval(null);
          setIsExecuting(false);
          setIsResultDialogOpen(true);
        }
      }
    }, 2000); // Poll every 2 seconds

    setExecutionPollingInterval(interval);
  }, [executionPollingInterval, getExecutionStatus]);

  // Handle executing workflow
  const handleExecuteWorkflow = async () => {
    if (!currentWorkflowId) {
      // If the workflow hasn't been saved yet, prompt the user to save it first
      setSaveDialogOpen(true);
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionStatus(null);
    setCurrentExecutionId(null);

    try {
      const result = await executeWorkflow(currentWorkflowId);
      if (result && result.executionId) {
        setCurrentExecutionId(result.executionId);
        setExecutionStatus('PENDING');
        startPollingExecutionStatus(result.executionId);
      } else {
        throw new Error('No execution ID returned');
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
      setIsExecuting(false);
    }
  };

  // Handle canceling execution
  const handleCancelExecution = async () => {
    if (!currentExecutionId) return;

    try {
      await cancelExecution(currentExecutionId);
      // Polling will pick up the canceled state
    } catch (error) {
      console.error('Error canceling execution:', error);
    }
  };

  // Handle loading workflow
  const handleLoadWorkflow = async (id: string) => {
    const workflow = await fetchWorkflowById(id);

    if (workflow && workflow.definitionJson) {
      setWorkflowName(workflow.name);
      setWorkflowDescription(workflow.description || "");
      setCurrentWorkflowId(workflow.id);

      // Set nodes and edges from the workflow definition
      setNodes(workflow.definitionJson.nodes || []);
      setEdges(workflow.definitionJson.edges || []);

      // Set viewport if available
      if (workflow.definitionJson.viewport && reactFlowInstance) {
        const { x, y, zoom } = workflow.definitionJson.viewport;
        reactFlowInstance.setViewport({ x, y, zoom });
      }
    }

    setLoadDialogOpen(false);
  };

  // Handle adding a new node
  const handleAddNode = (type: string) => {
    const position = reactFlowInstance
      ? reactFlowInstance.project({
          x: Math.random() * 400 + 50,
          y: Math.random() * 400 + 50
        })
      : { x: 100, y: 100 };

    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        description: `Description for ${type} node`
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  // Handle deleting a node
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes]);

  return (
    <PageTransition>
      <Flex direction="column" gap="6" fillHeight className="runeforge-wrapper">
        {/* Header */}
        <FadeIn>
          <Flex
            direction="row"
            horizontal="space-between"
            vertical="center"
            padding="6"
            background="surface"
            border="neutral-alpha-weak"
            radius="lg"
          >
            <Heading as="h1" variant="display-default-l">
              {workflowName}
            </Heading>
            <Flex gap="4">
              <Button
                variant="secondary"
                label="Load"
                onClick={() => setLoadDialogOpen(true)}
              />
              <Button
                variant="secondary"
                label="Save"
                onClick={() => setSaveDialogOpen(true)}
              />
              {currentWorkflowId && (
                <>
                  {isExecuting ? (
                    <Flex gap="2">
                      <Button
                        variant="danger"
                        label="Cancel"
                        onClick={handleCancelExecution}
                        icon="x"
                      />
                      <Button
                        variant="primary"
                        label={`Executing (${executionStatus || 'PENDING'})`}
                        disabled={true}
                        icon="loader-2"
                        className="animate-spin"
                      />
                    </Flex>
                  ) : (
                    <Button
                      variant="primary"
                      label="Execute"
                      onClick={handleExecuteWorkflow}
                      disabled={!currentWorkflowId}
                      icon="play"
                    />
                  )}
                </>
              )}
            </Flex>
          </Flex>
        </FadeIn>

        {/* Main Content */}
        <SlideUp delay={0.1}>
          <Flex fillHeight gap="6">
            {/* Sidebar */}
            <Flex direction="column" gap="4" className="runeforge-sidebar">
              <Tabs.Root defaultValue="nodes">
                <Tabs.List className="flex mb-4 border-b border-gray-200 dark:border-gray-800">
                  <Tabs.Trigger
                    value="nodes"
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400"
                  >
                    Nodes
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="properties"
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400"
                  >
                    Properties
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="nodes" className="outline-none">
                  <NodePalette onAddNode={handleAddNode} />
                </Tabs.Content>

                <Tabs.Content value="properties" className="outline-none">
                  <PropertiesPanel
                    selectedNode={selectedNode}
                    onNodeChange={handleNodeChange}
                  />
                </Tabs.Content>
              </Tabs.Root>
            </Flex>

            {/* Flow Canvas */}
            <Card
              padding="0"
              radius="lg"
              border="neutral-alpha-weak"
              className="runeforge-canvas"
            >
              <div
                ref={reactFlowWrapper}
                className="w-full h-full"
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  onInit={setReactFlowInstance}
                  nodeTypes={nodeTypes}
                  deleteKeyCode="Delete"
                  fitView
                  className="runeforge-flow"
                >
                  <Background />
                  <Controls />
                  <MiniMap />
                  <Panel position="top-right">
                    <Flex gap="2">
                      <IconButton
                        icon="plus"
                        variant="secondary"
                        onClick={() => handleAddNode("task")}
                        tooltip="Add Task Node"
                      />
                      <IconButton
                        icon="git-branch"
                        variant="secondary"
                        onClick={() => handleAddNode("decision")}
                        tooltip="Add Decision Node"
                      />
                      <IconButton
                        icon="bot"
                        variant="secondary"
                        onClick={() => handleAddNode(NodeType.AGENT_TASK)}
                        tooltip="Add Agent Task Node"
                      />
                      <IconButton
                        icon="trash"
                        variant="secondary"
                        onClick={() => {
                          if (selectedNode) {
                            handleDeleteNode(selectedNode.id);
                          }
                        }}
                        tooltip="Delete Selected Node"
                      />
                    </Flex>
                  </Panel>
                </ReactFlow>
              </div>
            </Card>
          </Flex>
        </SlideUp>

        {/* Save Dialog */}
        <Dialog
          isOpen={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          title={currentWorkflowId ? "Update Workflow" : "Save Workflow"}
        >
          <Flex direction="column" gap="4" padding="4">
            <Input
              label="Workflow Name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
            />
            <Textarea
              label="Description (optional)"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Enter a description for this workflow"
            />
            <Flex horizontal="end" gap="2">
              <Button
                variant="secondary"
                label="Cancel"
                onClick={() => setSaveDialogOpen(false)}
              />
              <Button
                variant="primary"
                label={currentWorkflowId ? "Update" : "Save"}
                onClick={handleSaveWorkflow}
                disabled={!workflowName.trim()}
              />
            </Flex>
          </Flex>
        </Dialog>

        {/* Load Dialog */}
        <Dialog
          isOpen={loadDialogOpen}
          onClose={() => setLoadDialogOpen(false)}
          title="Load Workflow"
        >
          <Flex direction="column" gap="4" padding="4">
            <Text weight="semibold" marginBottom="2">Select a workflow to load:</Text>

            <ScrollArea.Root className="max-h-[300px] overflow-hidden">
              <ScrollArea.Viewport className="w-full">
                <Flex direction="column" gap="2">
                  {isLoading ? (
                    <Flex padding="4" horizontal="center">
                      <Text>Loading workflows...</Text>
                    </Flex>
                  ) : workflows.length > 0 ? (
                    workflows.map((workflow) => (
                      <Card
                        key={workflow.id}
                        padding="3"
                        radius="md"
                        border="neutral-alpha-weak"
                        background="page"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => handleLoadWorkflow(workflow.id)}
                      >
                        <Flex gap="3" vertical="center">
                          <Icon name="file-text" size="s" />
                          <Flex direction="column" gap="1">
                            <Text weight="semibold">{workflow.name}</Text>
                            {workflow.description && (
                              <Text size="xs" color="foreground-subtle">
                                {workflow.description}
                              </Text>
                            )}
                            <Text size="xs" color="foreground-subtle">
                              Version: {workflow.version} • Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
                            </Text>
                          </Flex>
                        </Flex>
                      </Card>
                    ))
                  ) : (
                    <Text color="foreground-subtle">No saved workflows found</Text>
                  )}
                </Flex>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                orientation="vertical"
              >
                <ScrollArea.Thumb className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full relative" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            <Flex horizontal="end" gap="2">
              <Button
                variant="secondary"
                label="Refresh"
                onClick={() => fetchWorkflows()}
              />
              <Button
                variant="secondary"
                label="Cancel"
                onClick={() => setLoadDialogOpen(false)}
              />
            </Flex>
          </Flex>
        </Dialog>

        {/* Execution Result Dialog */}
        <Dialog
          isOpen={isResultDialogOpen}
          onClose={() => setIsResultDialogOpen(false)}
          title="Workflow Execution Results"
        >
          <Flex direction="column" gap="4" padding="4">
            {executionResult ? (
              <>
                <Card padding="4" radius="md" border="neutral-alpha-weak">
                  <Flex direction="column" gap="2">
                    <Flex horizontal="space-between" vertical="center">
                      <Text weight="semibold">Execution Summary</Text>
                      <Badge
                        variant={
                          executionResult.state === 'COMPLETED' ? 'success' :
                          executionResult.state === 'FAILED' ? 'danger' :
                          executionResult.state === 'CANCELED' ? 'warning' :
                          executionResult.state === 'RUNNING' ? 'info' : 'neutral'
                        }
                      >
                        {executionResult.state}
                      </Badge>
                    </Flex>

                    <Flex direction="column" gap="1">
                      <Text size="sm">
                        <Text weight="semibold" as="span">Workflow ID:</Text> {executionResult.workflowId}
                      </Text>
                      <Text size="sm">
                        <Text weight="semibold" as="span">Execution ID:</Text> {executionResult.id}
                      </Text>
                      <Text size="sm">
                        <Text weight="semibold" as="span">Started:</Text> {new Date(executionResult.startedAt).toLocaleString()}
                      </Text>
                      {executionResult.completedAt && (
                        <Text size="sm">
                          <Text weight="semibold" as="span">Completed:</Text> {new Date(executionResult.completedAt).toLocaleString()}
                        </Text>
                      )}
                      {executionResult.error && (
                        <Text size="sm" color="danger">
                          <Text weight="semibold" as="span">Error:</Text> {executionResult.error}
                        </Text>
                      )}
                    </Flex>

                    {executionResult.logs && executionResult.logs.length > 0 && (
                      <Flex direction="column" gap="2">
                        <Text weight="semibold" marginTop="2">Execution Logs</Text>
                        <ScrollArea.Root className="max-h-[200px] overflow-hidden">
                          <ScrollArea.Viewport className="w-full">
                            <Flex direction="column" gap="2">
                              {executionResult.logs.map((log: any, index: number) => (
                                <Card
                                  key={index}
                                  padding="2"
                                  radius="sm"
                                  border="neutral-alpha-weak"
                                  background={log.level === 'error' ? 'danger-weak' : log.level === 'warn' ? 'warning-weak' : 'surface'}
                                >
                                  <Flex direction="column" gap="1">
                                    <Flex horizontal="space-between">
                                      <Text size="xs" weight="semibold">
                                        {log.nodeId}
                                      </Text>
                                      <Text size="xs" color="foreground-subtle">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                      </Text>
                                    </Flex>
                                    <Text size="sm">{log.message}</Text>
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
                      </Flex>
                    )}

                    {executionResult.nodeStates && Object.keys(executionResult.nodeStates).length > 0 && (
                      <Flex direction="column" gap="2">
                        <Text weight="semibold" marginTop="2">Node Execution States</Text>
                        <ScrollArea.Root className="max-h-[200px] overflow-hidden">
                          <ScrollArea.Viewport className="w-full">
                            <Flex direction="column" gap="2">
                              {Object.entries(executionResult.nodeStates).map(([nodeId, state]: [string, any]) => (
                                <Card
                                  key={nodeId}
                                  padding="2"
                                  radius="sm"
                                  border="neutral-alpha-weak"
                                  background={
                                    state.state === 'FAILED' ? 'danger-weak' :
                                    state.state === 'COMPLETED' ? 'success-weak' :
                                    state.state === 'RUNNING' ? 'info-weak' :
                                    state.state === 'SKIPPED' ? 'warning-weak' : 'surface'
                                  }
                                >
                                  <Flex direction="column" gap="1">
                                    <Flex horizontal="space-between">
                                      <Text size="xs" weight="semibold">
                                        {nodeId}
                                      </Text>
                                      <Badge size="sm" variant={
                                        state.state === 'FAILED' ? 'danger' :
                                        state.state === 'COMPLETED' ? 'success' :
                                        state.state === 'RUNNING' ? 'info' :
                                        state.state === 'SKIPPED' ? 'warning' : 'neutral'
                                      }>
                                        {state.state}
                                      </Badge>
                                    </Flex>
                                    {state.startedAt && (
                                      <Text size="xs">
                                        Started: {new Date(state.startedAt).toLocaleTimeString()}
                                      </Text>
                                    )}
                                    {state.completedAt && (
                                      <Text size="xs">
                                        Completed: {new Date(state.completedAt).toLocaleTimeString()}
                                      </Text>
                                    )}
                                    {state.error && (
                                      <Text size="xs" color="danger">
                                        Error: {state.error}
                                      </Text>
                                    )}
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
                      </Flex>
                    )}
                  </Flex>
                </Card>
              </>
            ) : (
              <Text>No execution results available.</Text>
            )}
            <Flex horizontal="end" gap="2">
              <Button
                variant="primary"
                label="Close"
                onClick={() => setIsResultDialogOpen(false)}
              />
            </Flex>
          </Flex>
        </Dialog>
      </Flex>
    </PageTransition>
  );
}
