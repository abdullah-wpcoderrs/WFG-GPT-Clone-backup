"use client"

import { AuthProvider } from "@/hooks/use-auth"
import MessagesPage from "./dashboard/user/messages/page"

export default function MessagesPreview() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <MessagesPage />
      </div>
    </AuthProvider>
  )
}