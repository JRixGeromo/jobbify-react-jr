"use client"

import { useState } from "react"
import { ArrowRight, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ConfirmationDialog } from "./confirmation-dialog"
import { useToast } from "@/components/ui/use-toast"

export function QuickActions() {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: string
    title: string
    description: string
  }>({
    open: false,
    action: "",
    title: "",
    description: "",
  })
  const { toast } = useToast()

  const handleAction = (action: string) => {
    switch (action) {
      case "accept":
        setConfirmDialog({
          open: true,
          action: "accept",
          title: "Mark Quote as Accepted",
          description: "Are you sure you want to mark this quote as accepted? This action cannot be undone.",
        })
        break
      case "convert":
        setConfirmDialog({
          open: true,
          action: "convert",
          title: "Convert to Job",
          description: "This will create a new job based on this quote. Do you want to continue?",
        })
        break
      case "invoice":
        setConfirmDialog({
          open: true,
          action: "invoice",
          title: "Create Invoice",
          description: "This will generate a new invoice based on this quote. Do you want to continue?",
        })
        break
    }
  }

  const handleConfirm = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: `Action "${confirmDialog.action}" completed successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error processing your request.",
      })
    } finally {
      setConfirmDialog((prev) => ({ ...prev, open: false }))
    }
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="justify-start w-full" onClick={() => handleAction("accept")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Accepted
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update the status of this quote to Accepted</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="justify-start w-full" onClick={() => handleAction("convert")}>
                <FileText className="mr-2 h-4 w-4" />
                Convert to Job
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new job based on this quote</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="justify-start w-full" onClick={() => handleAction("invoice")}>
                <FileText className="mr-2 h-4 w-4" />
                Create Invoice
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate a new invoice from this quote</p>
            </TooltipContent>
          </Tooltip>
        </CardContent>

        <ConfirmationDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={handleConfirm}
        />
      </Card>
    </TooltipProvider>
  )
}

