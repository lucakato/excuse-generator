/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Q55ucDeSkHI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function Component() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    context: "",
    outcome: "",
    style: "text",
    user_name: "",
    boss_name: "",
    severity: 1,
    ridiculousness: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, style: value })
  }

  const handleSliderChange = (id: string, value: number[]) => {
    setFormData({ ...formData, [id]: value[0] })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/wordware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      const data = await response.json()
      router.push(`/excuse?message=${encodeURIComponent(data.message)}`)
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Excuse Generator!</h1>
        <Card className="rounded-2xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="context">Context</Label>
                <Textarea id="context" placeholder="Enter context" className="rounded-2xl" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Desired Outcome</Label>
                <Textarea id="outcome" placeholder="Enter outcome of excuse" className="rounded-2xl" onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">style</Label>
              <Select
                defaultValue="text"
                onValueChange={(value) => handleSelectChange(value)}
              >
                <SelectTrigger id="style" className="rounded-2xl">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="text" className="rounded-2xl">
                    Text
                  </SelectItem>
                  <SelectItem value="email" className="rounded-2xl">
                    Email
                  </SelectItem>
                  <SelectItem value="letter" className="rounded-2xl">
                    Letter
                  </SelectItem>
                  <SelectItem value="all" className="rounded-2xl">
                    All 3
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_name">Your Name</Label>
                <Input id="user_name" placeholder="Enter your name" className="rounded-2xl" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boss_name">Boss's Name</Label>
                <Input id="boss_name" placeholder="Enter boss's name" className="rounded-2xl" onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity of Excuse</Label>
                <Slider
                  id="severity"
                  min={1}
                  max={10}
                  defaultValue={[1]}
                  className="h-6 rounded-2xl"
                  onValueChange={(value) => handleSliderChange("severity", value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ridiculousness">Ridiculousness of Excuse</Label>
                <Slider
                  id="ridiculousness"
                  min={1}
                  max={10}
                  defaultValue={[1]}
                  className="h-6 rounded-2xl"
                  onValueChange={(value) => handleSliderChange("ridiculousness", value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="rounded-2xl" onClick={handleSubmit}>Generate Excuse </Button>
          </CardFooter>
           </form>
        </Card>
      </div>
    </div>
  )
}