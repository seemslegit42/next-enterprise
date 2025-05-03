'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/once-ui/components'
import { useWorkflowLogs } from '@/hooks/useWorkflowLogs'
import { useWorkflows } from '@/hooks/useWorkflows'
import { WorkflowExecutionLog } from '@/interfaces/execution.interface'

export default function WorkflowLogsPage() {
  const router = useRouter()
  const { logs, isLoading, fetchLogs } = useWorkflowLogs()
  const { workflows } = useWorkflows()
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Apply filters
  const handleApplyFilters = () => {
    fetchLogs({
      workflowId: selectedWorkflow || undefined,
      status: selectedStatus as any || undefined,
    })
  }

  // Reset filters
  const handleResetFilters = () => {
    setSelectedWorkflow('')
    setSelectedStatus('')
    fetchLogs()
  }

  // View log details
  const handleViewLog = (log: WorkflowExecutionLog) => {
    router.push(`/dashboard/workflow-logs/${log.id}`)
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Running</Badge>
      case 'Completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      case 'Failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workflow Execution Logs</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter workflow execution logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium mb-1">Workflow</label>
              <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                <SelectTrigger>
                  <SelectValue placeholder="All workflows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All workflows</SelectItem>
                  {workflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2 ml-auto">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Execution Logs</CardTitle>
          <CardDescription>View and manage workflow execution logs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No workflow execution logs found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Execution ID</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Log Entries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.workflow?.name || 'Unknown'}</TableCell>
                      <TableCell className="font-mono text-xs">{log.executionId.substring(0, 8)}...</TableCell>
                      <TableCell>{format(new Date(log.startTime), 'MMM d, yyyy HH:mm:ss')}</TableCell>
                      <TableCell>
                        {log.endTime
                          ? format(new Date(log.endTime), 'MMM d, yyyy HH:mm:ss')
                          : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{log.logEntries.length}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewLog(log)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
