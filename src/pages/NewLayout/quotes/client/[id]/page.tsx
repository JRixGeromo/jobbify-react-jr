"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentSection } from "./comment-section"
import Image from "next/image"
import { Check, X, MessageSquare } from "lucide-react"

// Mock data - replace with actual data fetching
const mockQuote = {
  id: "64f1b4aa",
  status: "pending",
  customerName: "John Smith",
  companyName: "Professional Home Services",
  items: [
    { description: "Basic Service Package", quantity: 1, price: 299.99 },
    { description: "Premium Add-on", quantity: 2, price: 149.99 }
  ],
  total: 599.97,
  terms: "1. All prices are valid for 30 days\n2. 50% deposit required\n3. Work guaranteed for 12 months",
  media: [
    { url: "/placeholder-image-1.jpg", alt: "Service Area 1" },
    { url: "/placeholder-image-2.jpg", alt: "Service Area 2" }
  ]
}

const mockComments = [
  {
    id: "1",
    author: {
      name: "John Smith",
      role: "client" as const,
    },
    content: "Could you clarify what's included in the Basic Service Package?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    author: {
      name: "Service Pro",
      role: "business" as const,
    },
    content: "The Basic Service Package includes a full inspection, cleaning, and basic maintenance. Would you like me to break down each component?",
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
  },
]

export default function ClientQuotePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("quote")
  const [comments, setComments] = useState(mockComments)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)

  const handleAccept = () => {
    toast({
      title: "Quote Accepted",
      description: "Thank you for accepting the quote. We'll be in touch shortly to arrange the next steps.",
    })
    setShowAcceptDialog(false)
  }

  const handleDecline = () => {
    toast({
      title: "Quote Declined",
      description: "The quote has been declined. Please add a comment to explain why so we can better serve you.",
    })
    setShowDeclineDialog(false)
    setActiveTab("discussion")
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: String(comments.length + 1),
      author: {
        name: "John Smith",
        role: "client" as const,
      },
      content,
      timestamp: new Date(),
    }
    setComments([...comments, newComment])
    toast({
      title: "Comment Added",
      description: "Your comment has been posted successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Quote Details</h1>
            <Badge variant={
              mockQuote.status === "accepted" ? "secondary" :
              mockQuote.status === "declined" ? "destructive" :
              "secondary"
            }>
              {mockQuote.status.charAt(0).toUpperCase() + mockQuote.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Review and respond to your quote</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="quote">Quote Details</TabsTrigger>
                <TabsTrigger value="discussion" className="flex items-center gap-2">
                  Discussion
                  <Badge variant="secondary" className="ml-1">
                    {comments.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="quote" className="space-y-6">
                {/* Company Header */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 relative">
                        <Image
                          src="/placeholder-logo.png"
                          alt="Company Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{mockQuote.companyName}</h3>
                        <p className="text-sm text-muted-foreground">Professional Services</p>
                      </div>
                    </div>
                    <p className="font-medium">Quote #{mockQuote.id}</p>
                  </div>
                </Card>

                {/* Line Items */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Quote Items</h3>
                  <div className="space-y-4">
                    {mockQuote.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Total</p>
                      <p className="font-semibold">${mockQuote.total.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>

                {/* Terms */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Terms and Conditions</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {mockQuote.terms}
                  </p>
                </Card>

                {/* Media */}
                {mockQuote.media.length > 0 && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Attached Photos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {mockQuote.media.map((media, index) => (
                        <div key={index} className="relative aspect-video">
                          <Image
                            src={media.url}
                            alt={media.alt}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="discussion">
                <Card className="p-6">
                  <CommentSection
                    comments={comments}
                    onAddComment={handleAddComment}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => setShowAcceptDialog(true)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept Quote
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowDeclineDialog(true)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline Quote
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Request Changes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this quote? By accepting, you agree to the terms and conditions outlined in the quote.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept}>Accept Quote</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this quote? Please consider adding a comment to explain why so we can better serve you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDecline}
              className="bg-destructive hover:bg-destructive/90"
            >
              Decline Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
