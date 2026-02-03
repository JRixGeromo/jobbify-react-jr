import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ClientInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> Louis Blythe
          </p>
          <p>
            <strong>Company:</strong> Acme Corp
          </p>
          <p>
            <strong>Email:</strong> louis.blythe@acme.com
          </p>
          <p>
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
          <Button variant="outline" className="w-full mt-4">
            View Full Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

