"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
}

export function CommunicationHistory() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "John Doe (Client)",
      content: "Thank you for the quote. Can we discuss the pricing for item 3?",
      timestamp: "2 days ago",
    },
    {
      id: "2",
      sender: "Jane Smith (Sales Rep)",
      content: "I'd be happy to discuss the pricing for item 3. When would be a good time for a call?",
      timestamp: "1 day ago",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: String(Date.now()),
        sender: "You",
        content: newMessage.trim(),
        timestamp: "Just now",
      }
      setMessages((prevMessages) => [...prevMessages, message])
      setNewMessage("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="font-medium">{message.sender}</p>
                <p className="text-sm text-muted-foreground">{message.timestamp}</p>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <Input type="file" className="w-1/2" />
            <Button onClick={handleSendMessage}>Send Message</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

