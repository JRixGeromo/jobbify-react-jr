import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
    role: "client" | "business"
  }
  content: string
  timestamp: Date
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (content: string) => void
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Discussion</h3>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>
                    {comment.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{comment.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {comment.author.role === "client" ? "Customer" : "Business"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <p className="mt-2">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Add a comment or ask for clarification..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </form>
    </div>
  )
}
