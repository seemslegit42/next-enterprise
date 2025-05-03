'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/once-ui/components'
import { ArrowLeft } from 'lucide-react'
import { useWorkflowLogs } from '@/hooks/useWorkflowLogs'
import { WorkflowExecutionLog, LogEntry } from '@/interfaces/execution.interface'

export default function WorkflowLogDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { fetchLogById } = useWorkflowLogs()
  const [log, setLog] = useState<WorkflowExecutionLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLog = async () => {
      setIsLoading(true)
      const logData = await fetchLogById(params.id)
      setLog(logData)
      setIsLoading(false)
    }

    loadLog()
  }, [params.id, fetchLogById])

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

  // Get log level badge color
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>
      case 'Warn':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warn</Badge>
      case 'Error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  // Format JSON data
  const formatData = (data: any) => {
    if (!data) return '-'
    try {
      return (
        <pre className="text-xs overflow-auto max-h-32 p-2 bg-gray-50 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )
    } catch (e) {
      return String(data)
    }
  }

  // Calculate duration
  const calculateDuration = () => {
    if (!log) return '-'
    if (!log.startTime) return '-'
    if (!log.endTime) return 'Running...'

    const start = new Date(log.startTime)
    const end = new Date(log.endTime)
    const durationMs = end.getTime() - start.getTime()
    
    // Format as minutes and seconds
    const minutes = Math.floor(durationMs / 60000)
    const seconds = ((durationMs % 60000) / 1000).toFixed(2)
    
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/dashboard/workflow-logs')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Logs
      </Button>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : !log ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              Log not found or failed to load
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Workflow Execution Log
              <span className="ml-3">{getStatusBadge(log.status)}</span>
            </h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Execution Details</CardTitle>
              <CardDescription>Details about this workflow execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Workflow</h3>
                  <p className="mt-1">{log.workflow?.name || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Execution ID</h3>
                  <p className="mt-1 font-mono">{log.executionId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Time</h3>
                  <p className="mt-1">{format(new Date(log.startTime), 'MMM d, yyyy HH:mm:ss')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">End Time</h3>
                  <p className="mt-1">
                    {log.endTime
                      ? format(new Date(log.endTime), 'MMM d, yyyy HH:mm:ss')
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="mt-1">{calculateDuration()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Log Entries</h3>
                  <p className="mt-1">{log.logEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log Entries</CardTitle>
              <CardDescription>Detailed log entries for this execution</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="warn">Warnings</TabsTrigger>
                  <TabsTrigger value="error">Errors</TabsTrigger>
                </TabsList>

                {['all', 'info', 'warn', 'error'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue}>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Node ID</TableHead>
                            <TableHead>Node Type</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {log.logEntries
                            .filter((entry) => 
                              tabValue === 'all' || 
                              entry.level.toLowerCase() === tabValue.toLowerCase()
                            )
                            .map((entry: LogEntry) => (
                              <TableRow key={entry.id}>
                                <TableCell className="whitespace-nowrap">
                                  {format(new Date(entry.timestamp), 'HH:mm:ss.SSS')}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {entry.nodeId.length > 8 
                                    ? `${entry.nodeId.substring(0, 8)}...` 
                                    : entry.nodeId}
                                </TableCell>
                                <TableCell>{entry.nodeType}</TableCell>
                                <TableCell>{getLevelBadge(entry.level)}</TableCell>
                                <TableCell className="max-w-md truncate">
                                  {entry.message}
                                </TableCell>
                                <TableCell>{formatData(entry.data)}</TableCell>
                              </TableRow>
                            ))}
                          {log.logEntries.filter((entry) => 
                            tabValue === 'all' || 
                            entry.level.toLowerCase() === tabValue.toLowerCase()
                          ).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                No {tabValue === 'all' ? '' : tabValue} log entries found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
