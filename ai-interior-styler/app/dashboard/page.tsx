"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [newProjectName, setNewProjectName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/")
        return
      }
      setUser(data.user)

      // fetch credits
      const { data: userRow } = await supabase
        .from("users")
        .select("credits")
        .eq("id", data.user.id)
        .single()
      setCredits(userRow?.credits ?? 0)

      // fetch projects
      fetchProjects(data.user.id)
    }
    init()
  }, [])

  const fetchProjects = async (userId: string) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    setProjects(data || [])
  }

  const createProject = async () => {
    if (!newProjectName.trim() || !user) return
    await supabase
      .from("projects")
      .insert([{ user_id: user.id, name: newProjectName }])
    setNewProjectName("")
    fetchProjects(user.id)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <p>Hello <b>{user?.email}</b></p>
        <p className="mt-2">Credits: <span className="font-semibold">{credits}</span></p>

        <div className="mt-4">
          <h3 className="font-medium">Create Project</h3>
          <div className="flex gap-2 mt-2">
            <input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
              placeholder="Project name"
            />
            <button onClick={createProject} className="bg-green-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Your Projects</h4>
            <div className="mt-2 grid gap-2">
              {projects.length === 0 && <div className="text-sm text-gray-500">No projects yet</div>}
              {projects.map((p) => (
                <div key={p.id} className="p-3 border rounded bg-gray-50">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">Created: {new Date(p.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
