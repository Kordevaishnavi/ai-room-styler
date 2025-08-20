"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // initial getUser
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser(data.user ?? null)
    })

    // listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      // unsubscribe listener
      try { authListener.subscription.unsubscribe() } catch {}
    }
  }, [])

  // ensure user row exists with 50 credits
  useEffect(() => {
    if (!user) return
    const ensureUser = async () => {
      try {
        const { data } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single()
        if (!data) {
          await supabase.from("users").insert([
            { id: user.id, email: user.email, credits: 50 }
          ])
        }
      } catch (err) {
        console.error("ensureUser error:", err)
      }
    }
    ensureUser()
  }, [user])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Login with Google
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{user.email}</span>
      <button onClick={signOut} className="bg-red-500 text-white px-2 py-1 rounded">
        Logout
      </button>
    </div>
  )
}
