import { Toaster } from "sonner"
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function AppLayout() {
  return (
    <>
        <Toaster richColors position="bottom-center" />

        <div className="bg-background text-foreground flex h-[100dvh] flex-col overflow-hidden">
            {/* Top navbar */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto overscroll-contain pt-14 pb-4">
                <Outlet />
            </main>
        </div>
    </>
  )
}