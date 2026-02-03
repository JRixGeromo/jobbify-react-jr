"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Download,
  Send,
  Eye,
  MoreVertical,
  Copy,
  FileText,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  Printer,
  Share2,
  ArrowRight,
  ClipboardList,
  DollarSign,
} from "lucide-react"
import { Quote } from "@/types/quote"
import { useToast } from "@/components/ui/use-toast"

interface QuoteActionsProps {
  quote: Quote
  onSend?: (emailData: any) => void
  onDownload?: () => void
  onPreview?: () => void
  onAccept?: () => void
  onConvertToJob?: () => void
  onCreateInvoice?: () => void
}

export function QuoteActions({ 
  quote, 
  onSend, 
  onDownload, 
  onPreview,
  onAccept,
  onConvertToJob,
  onCreateInvoice,
}: QuoteActionsProps) {
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null)
  const { toast } = useToast()

  const [emailData, setEmailData] = useState({
    to: quote.clientId,
    subject: `Quote ${quote.id} from Your Company`,
    message: `Dear valued client,\n\nPlease find attached quote ${quote.id}.\n\nThank you for considering our services!`,
    sendCopy: true,
    enableFollowUp: true,
  })

  const handleSendEmail = () => {
    onSend?.(emailData)
    setShowEmailDialog(false)
    toast({
      title: "Quote Sent",
      description: "The quote has been sent to the client.",
    })
  }

  const handlePreview = () => {
    window.open(`/quotes/${quote.id}/preview`, '_blank')
  }

  const handleAction = (
    title: string,
    description: string,
    action: () => void
  ) => {
    setConfirmAction({ title, description, action })
    setShowConfirmDialog(true)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send Quote
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Quote</DialogTitle>
            <DialogDescription>
              Send this quote to your client via email. You can customize the message and enable follow-up reminders.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">Recipient Email</Label>
              <Input
                id="to"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                className="h-24"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sendCopy"
                checked={emailData.sendCopy}
                onCheckedChange={(checked) => setEmailData({ ...emailData, sendCopy: checked })}
              />
              <Label htmlFor="sendCopy">Send me a copy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableFollowUp"
                checked={emailData.enableFollowUp}
                onCheckedChange={(checked) => setEmailData({ ...emailData, enableFollowUp: checked })}
              />
              <Label htmlFor="enableFollowUp">Enable follow-up reminders</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Quote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction?.title}</DialogTitle>
            <DialogDescription>{confirmAction?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmAction?.action()
                setShowConfirmDialog(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Quote Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview as Client
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
              <Mail className="mr-2 h-4 w-4" />
              Send via Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            {quote.status !== 'accepted' && (
              <DropdownMenuItem
                onClick={() =>
                  handleAction(
                    "Accept Quote",
                    "Are you sure you want to mark this quote as accepted?",
                    onAccept || (() => {})
                  )
                }
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Accept Quote
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                handleAction(
                  "Convert to Job",
                  "This will create a new job based on this quote. Do you want to continue?",
                  onConvertToJob || (() => {})
                )
              }
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Convert to Job
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleAction(
                  "Create Invoice",
                  "This will generate a new invoice based on this quote. Do you want to continue?",
                  onCreateInvoice || (() => {})
                )
              }
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Create Invoice
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
