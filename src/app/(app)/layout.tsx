import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
          <div className="flex flex-col min-h-screen dark:text-white ">
          <Navbar/>
          {children}
          
        </div>
      </body>
    </html>
  );
}