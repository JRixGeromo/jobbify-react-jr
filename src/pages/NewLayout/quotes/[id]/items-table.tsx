"use client"

import { useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

interface Item {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export function ItemsTable() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", description: "Service Description", quantity: 1, unitPrice: 222.0 },
  ])

  const addItem = useCallback(() => {
    const newItem: Item = {
      id: String(Date.now()),
      description: "",
      quantity: 1,
      unitPrice: 0,
    }
    setItems((prevItems) => [...prevItems, newItem])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const updateItem = useCallback((id: string, field: keyof Item, value: string | number) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * 0.0825 // Assuming 8.25% tax rate
  const total = subtotal + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Enter item description"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", Math.max(1, Number.parseInt(e.target.value) || 0))
                      }
                      className="w-20 text-right"
                      min="1"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, "unitPrice", Math.max(0, Number.parseFloat(e.target.value) || 0))
                      }
                      className="w-24 text-right"
                      min="0"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button variant="outline" className="mt-4" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax (8.25%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

