"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Version {
  id: string
  number: number
  updatedBy: string
  updatedAt: string
  changes: string[]
}

export function VersionHistory() {
  const [versions, setVersions] = useState<Version[]>([
    {
      id: "3",
      number: 3,
      updatedBy: "Jane Smith",
      updatedAt: "1 day ago",
      changes: ["Updated item prices", "Added new service description"],
    },
    {
      id: "2",
      number: 2,
      updatedBy: "John Doe",
      updatedAt: "3 days ago",
      changes: ["Modified payment terms", "Adjusted discount"],
    },
    {
      id: "1",
      number: 1,
      updatedBy: "Jane Smith",
      updatedAt: "5 days ago",
      changes: ["Initial quote creation"],
    },
  ])

  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.map((version) => (
            <div key={version.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-medium">
                  Version {version.number} {version.number === versions[0].number && "(Current)"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Updated {version.updatedAt} by {version.updatedBy}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedVersion(version)}>
                    View Changes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Version {selectedVersion?.number} Changes</DialogTitle>
                  </DialogHeader>
                  <ul className="list-disc pl-6">
                    {selectedVersion?.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

