"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {useRouter} from "next/navigation"
import {User} from "next-auth"
import { Button } from "./ui/button"
import toast from "react-hot-toast"

const Navbar = () => {
    
    const router = useRouter()
    const {data: session} = useSession()
    const user: User = session?.user as User
    const onLogout = async () => {
        await signOut()
        router.push('/')
        toast.success("Logged Out")
    }
  return (
    <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-xl font-bold mb-4 md:mb-0" href="#">Feed Formly</a>
            {
                session ? (
                    <>
                    <span className="mr-4">Welcome, {user.username} || {user.email}</span>
                    <Button className="md:w-auto w-full" onClick={
                        onLogout
                        }>Logout</Button>
                    </>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button className="md:w-auto w-full">Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar