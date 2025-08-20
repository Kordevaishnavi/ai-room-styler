"use client"
import AuthButton from "@/components/AuthButton"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="text-xl font-semibold">AI Interior Styler</div>
      <div>
        <AuthButton />
      </div>
    </nav>
  )
}
