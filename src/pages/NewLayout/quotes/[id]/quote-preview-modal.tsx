import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Download, Send, X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

interface QuotePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: () => void
  quote: {
    id: string
    customerName: string
    companyName: string
    items: Array<{
      description: string
      quantity: number
      price: number
    }>
    total: number
    terms: string
    media: Array<{
      url: string
      alt: string
    }>
  }
}

export function QuotePreviewModal({
  isOpen,
  onClose,
  onSend,
  quote,
}: QuotePreviewModalProps) {
  const { toast } = useToast()

  const handleDownloadPDF = async () => {
    toast({
      title: "Generating PDF",
      description: "Your PDF is being generated and will download shortly.",
    })
    // TODO: Implement actual PDF generation
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] min-w-[320px] h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Quote Preview</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Preview how your quote will appear to the customer
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-8">
            {/* Company Header */}
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
                  <h3 className="font-semibold">{quote.companyName}</h3>
                  <p className="text-sm text-muted-foreground">Professional Services</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Quote #{quote.id}</p>
                <p className="text-sm text-muted-foreground">Valid for 30 days</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Customer Information</h4>
              <p>{quote.customerName}</p>
            </div>

            {/* Line Items */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-4">Quote Items</h4>
              <div className="space-y-4">
                {quote.items.map((item, index) => (
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
                  <p className="font-semibold">${quote.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Media */}
            {quote.media.length > 0 && (
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-4">Attached Photos</h4>
                <div className="grid grid-cols-2 gap-4">
                  {quote.media.map((media, index) => (
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
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Terms and Conditions</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {quote.terms}
              </p>
            </div>
          </div>
        </ScrollArea>
        <Separator className="my-4" />
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onSend}>
                <Send className="mr-2 h-4 w-4" />
                Send Quote
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
