"use client"
import { useRouter } from "next/navigation"

export default function ProjectCard({ project }: { project: any }) {
  const router = useRouter()
  return (
    <div onClick={() => router.push(`/dashboard/${project.id}`)} className="p-3 border rounded cursor-pointer hover:shadow">
      <div className="font-semibold">{project.name}</div>
      <div className="text-sm text-gray-500">Created: {new Date(project.created_at).toLocaleString()}</div>
    </div>
  )
}
