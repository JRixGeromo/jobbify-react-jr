import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuoteInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quote Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium">fqf24f</p>
            </div>
            <Badge variant="secondary">Accepted</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">Louis Blythe</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">06/02/2025</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">08/03/2025</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-medium">$240.31</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

