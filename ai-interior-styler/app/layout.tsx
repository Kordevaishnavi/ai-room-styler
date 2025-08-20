import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "AI Interior Styler",
  description: "Transform your room images with AI styles",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  )
}
