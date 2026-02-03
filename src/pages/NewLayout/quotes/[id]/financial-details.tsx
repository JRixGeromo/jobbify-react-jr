"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function FinancialDetails() {
  const [customTaxRate, setCustomTaxRate] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                  <SelectItem value="jpy">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate</Label>
              {customTaxRate ? (
                <Input id="tax-rate" type="number" placeholder="Enter custom tax rate" min="0" max="100" step="0.01" />
              ) : (
                <Select defaultValue="standard">
                  <SelectTrigger id="tax-rate">
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (20%)</SelectItem>
                    <SelectItem value="reduced">Reduced (5%)</SelectItem>
                    <SelectItem value="zero">Zero (0%)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="custom-tax" checked={customTaxRate} onCheckedChange={setCustomTaxRate} />
            <Label htmlFor="custom-tax">Use custom tax rate</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-terms">Payment Terms</Label>
            <Select defaultValue="net30">
              <SelectTrigger id="payment-terms">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net30">Net 30</SelectItem>
                <SelectItem value="net60">Net 60</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount-type">Discount Type</Label>
            <Select defaultValue="percentage">
              <SelectTrigger id="discount-type">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="none">No Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

