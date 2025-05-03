"use client"

import { useEffect, useState } from "react"

// Types for WebSocket events
export type WebSocketEvent = {
  type: string
  payload: any
}

// WebSocket connection status
export type ConnectionStatus = "connecting" | "connected" | "disconnected"

// Mock WebSocket URL - in a real app, this would be your actual WebSocket server
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://api.example.com/ws"

/**
 * Custom hook for WebSocket connection
 */
export function useWebSocket(userId: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null)
  const [events, setEvents] = useState<WebSocketEvent[]>([])

  // Connect to WebSocket
  useEffect(() => {
    // In development, we'll use a mock implementation
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock WebSocket in development")
      const mockSocket = createMockWebSocket(userId)
      setSocket(mockSocket as unknown as WebSocket)
      setStatus("connected")
      return () => {
        mockSocket.close()
      }
    }

    // In production, connect to the real WebSocket server
    try {
      const ws = new WebSocket(`${WS_URL}?userId=${userId}`)
      
      ws.onopen = () => {
        console.log("WebSocket connected")
        setStatus("connected")
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketEvent
          setLastEvent(data)
          setEvents((prev) => [...prev, data])
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setStatus("disconnected")
      }
      
      ws.onclose = () => {
        console.log("WebSocket disconnected")
        setStatus("disconnected")
      }
      
      setSocket(ws)
      
      // Clean up on unmount
      return () => {
        ws.close()
      }
    } catch (error) {
      console.error("Error connecting to WebSocket:", error)
      setStatus("disconnected")
    }
  }, [userId])

  // Send message to WebSocket
  const sendMessage = (type: string, payload: any) => {
    if (socket && status === "connected") {
      socket.send(JSON.stringify({ type, payload }))
    } else if (process.env.NODE_ENV === "development") {
      console.log("Mock WebSocket message sent:", { type, payload })
    } else {
      console.warn("Cannot send message, WebSocket not connected")
    }
  }

  return {
    status,
    lastEvent,
    events,
    sendMessage,
  }
}

/**
 * Create a mock WebSocket for development
 */
function createMockWebSocket(userId: string) {
  const eventTypes = ["task_created", "task_updated", "task_deleted", "log_created"]
  const mockSocket = {
    listeners: {
      message: [] as ((event: { data: string }) => void)[],
      open: [] as (() => void)[],
      close: [] as (() => void)[],
      error: [] as ((error: any) => void)[],
    },
    
    addEventListener(type: string, callback: any) {
      if (type === "message") this.listeners.message.push(callback)
      if (type === "open") this.listeners.open.push(callback)
      if (type === "close") this.listeners.close.push(callback)
      if (type === "error") this.listeners.error.push(callback)
    },
    
    removeEventListener(type: string, callback: any) {
      if (type === "message") {
        this.listeners.message = this.listeners.message.filter((cb) => cb !== callback)
      }
      if (type === "open") {
        this.listeners.open = this.listeners.open.filter((cb) => cb !== callback)
      }
      if (type === "close") {
        this.listeners.close = this.listeners.close.filter((cb) => cb !== callback)
      }
      if (type === "error") {
        this.listeners.error = this.listeners.error.filter((cb) => cb !== callback)
      }
    },
    
    send(data: string) {
      console.log("Mock WebSocket message sent:", data)
    },
    
    close() {
      clearInterval(this.interval)
      this.listeners.close.forEach((cb) => cb())
    },
    
    // Simulate random events
    interval: setInterval(() => {
      if (Math.random() > 0.7) {
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        const event = {
          type,
          payload: {
            id: `mock-${Date.now()}`,
            userId,
            timestamp: new Date().toISOString(),
          },
        }
        
        mockSocket.listeners.message.forEach((cb) => {
          cb({ data: JSON.stringify(event) })
        })
      }
    }, 10000) as unknown as number,
    
    // Simulate initial connection
    onopen: null as null | (() => void),
    onmessage: null as null | ((event: { data: string }) => void),
    onclose: null as null | (() => void),
    onerror: null as null | ((error: any) => void),
  }
  
  // Trigger open event on next tick
  setTimeout(() => {
    if (mockSocket.onopen) mockSocket.onopen()
  }, 100)
  
  return mockSocket
}

/**
 * Service for real-time notifications
 */
export function useRealTimeNotifications(userId: string) {
  const { status, events } = useWebSocket(userId)
  const [notifications, setNotifications] = useState<any[]>([])
  
  // Process WebSocket events into notifications
  useEffect(() => {
    if (events.length > 0) {
      const newNotifications = events.map((event) => {
        let title = ""
        let message = ""
        
        switch (event.type) {
          case "task_created":
            title = "New Task"
            message = `A new task "${event.payload.title}" has been created`
            break
          case "task_updated":
            title = "Task Updated"
            message = `Task "${event.payload.title}" has been updated`
            break
          case "task_deleted":
            title = "Task Deleted"
            message = `A task has been deleted`
            break
          case "log_created":
            title = "New Log Entry"
            message = `A new log entry has been created: ${event.payload.message}`
            break
          default:
            title = "Notification"
            message = "You have a new notification"
        }
        
        return {
          id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          message,
          timestamp: new Date().toISOString(),
          read: false,
          data: event.payload,
        }
      })
      
      setNotifications((prev) => [...newNotifications, ...prev])
    }
  }, [events])
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }
  
  // Clear notification
  const clearNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }
  
  return {
    status,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  }
}
