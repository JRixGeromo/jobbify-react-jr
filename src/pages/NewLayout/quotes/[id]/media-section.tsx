import { Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MediaSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Media</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Drag and drop files or click to upload</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
            <Button variant="secondary" size="sm" className="mt-4">
              Choose Files
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

