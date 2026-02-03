"use client"

import { useState } from "react"
import { ArrowLeft, Download, Eye, Copy, Send, Printer, MessageCircle, History, DollarSign, List, Users } from "lucide-react"
import Link from "next/link"
import { useHotkeys } from "react-hotkeys-hook"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommandPalette } from "@/components/ui/command-palette"
import { QuoteActions } from "./quote-actions"
import { RecentActivity } from "./recent-activity"
import { QuoteInformation } from "./quote-information"
import { MediaSection } from "./media-section"
import { ItemsTable } from "./items-table"
import { CommunicationHistory } from "./communication-history"
import { VersionHistory } from "./version-history"
import { FinancialDetails } from "./financial-details"
import { ClientInfo } from "./client-info"
import { useToast } from "@/components/ui/use-toast"
import { QuoteFollowUp } from "./quote-followup"
import { QuotePreviewModal } from "./quote-preview-modal"

export default function QuoteDetailsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Mock quote data - replace with actual data
  const mockQuote = {
    id: "64f1b4aa",
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

  useHotkeys("ctrl+p", () => window.print(), { preventDefault: true })
  useHotkeys("ctrl+s", (e) => {
    e.preventDefault()
    toast({
      title: "Quote Sent",
      description: "The quote has been sent successfully.",
    })
  })
  useHotkeys("ctrl+1", () => setActiveTab("details"), { preventDefault: true })
  useHotkeys("ctrl+2", () => setActiveTab("communication"), { preventDefault: true })
  useHotkeys("ctrl+3", () => setActiveTab("versions"), { preventDefault: true })
  useHotkeys("ctrl+4", () => setActiveTab("financial"), { preventDefault: true })

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/quotes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quotes
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/quotes" className="hover:text-foreground">
                Quotes
              </Link>
              <span>/</span>
              <span className="text-foreground">64f1b4aa C8ae 4efc Ab1c Bc7beb05c4dd</span>
            </nav>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Quote Details</h1>
              <p className="text-sm text-muted-foreground">View and manage quote information</p>
            </div>
            <div className="flex items-center gap-2">
              <QuoteActions
                quote={mockQuote}
                onSend={(emailData) => {
                  console.log('Sending quote with:', emailData)
                  toast({
                    title: "Quote Sent",
                    description: "The quote has been sent successfully.",
                  })
                }}
                onDownload={() => {
                  console.log('Downloading quote')
                  toast({
                    title: "Quote Downloaded",
                    description: "The quote has been downloaded as PDF.",
                  })
                }}
                onPreview={() => setIsPreviewOpen(true)}
                onAccept={() => {
                  toast({
                    title: "Quote Accepted",
                    description: "The quote has been marked as accepted.",
                  })
                }}
                onConvertToJob={() => {
                  toast({
                    title: "Job Created",
                    description: "A new job has been created from this quote.",
                  })
                }}
                onCreateInvoice={() => {
                  toast({
                    title: "Invoice Created",
                    description: "A new invoice has been created from this quote.",
                  })
                }}
              />
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/quotes/client/${mockQuote.id}`}>
                  <Users className="w-4 h-4 mr-2" />
                  View as Client
                </Link>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="details">
                <List className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="communication">
                <MessageCircle className="w-4 h-4 mr-2" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="versions">
                <History className="w-4 h-4 mr-2" />
                Versions
              </TabsTrigger>
              <TabsTrigger value="financial">
                <DollarSign className="w-4 h-4 mr-2" />
                Financial
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                  <QuoteInformation />
                  <MediaSection />
                  <ItemsTable />
                </div>
                <div className="space-y-6">
                  <ClientInfo />
                  <RecentActivity />
                  <QuoteFollowUp />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="communication">
              <CommunicationHistory />
            </TabsContent>
            <TabsContent value="versions">
              <VersionHistory />
            </TabsContent>
            <TabsContent value="financial">
              <FinancialDetails />
            </TabsContent>
          </Tabs>
        </div>
        <CommandPalette />
      </main>
      <QuotePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSend={() => {
          setIsPreviewOpen(false)
          toast({
            title: "Quote Sent",
            description: "The quote has been sent successfully.",
          })
        }}
        quote={mockQuote}
      />
    </div>
  )
}

