import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FollowUpStep {
  day: number
  title: string
  description: string
  enabled: boolean
}

const followUpSteps: FollowUpStep[] = [
  {
    day: 0,
    title: "Instant Confirmation",
    description: "Send quote delivery confirmation",
    enabled: true,
  },
  {
    day: 2,
    title: "First Reminder",
    description: "Send first reminder if no response received",
    enabled: true,
  },
  {
    day: 5,
    title: "Value-Add Follow-up",
    description: "Share additional service benefits and features",
    enabled: true,
  },
  {
    day: 7,
    title: "Limited Time Offer",
    description: "Send special discount offer",
    enabled: true,
  },
  {
    day: 14,
    title: "Final Reminder",
    description: "Notify about quote expiration",
    enabled: true,
  },
  {
    day: 30,
    title: "Re-engagement",
    description: "Re-engage with updated pricing",
    enabled: false,
  },
]

export function QuoteFollowUp() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quote Follow-up Automation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {followUpSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4 rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label className="text-base">
                  Day {step.day}: {step.title}
                </Label>
                <div className="text-sm text-muted-foreground">
                  {step.description}
                </div>
              </div>
              <Switch
                defaultChecked={step.enabled}
                onCheckedChange={(checked) => {
                  console.log(`${step.title} follow-up ${checked ? 'enabled' : 'disabled'}`)
                  // TODO: Implement state management and API call to update follow-up settings
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
