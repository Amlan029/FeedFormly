"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
export default function Home() {
  return (
    <>
    
      <main className="flex-grow flex  flex-col items-center justify-center px-4 md:px-24 py-12  text-purple-700 dark:text-purple-400">
        
          <section className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
            Dive into the world of <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Anonymous Conversations</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400  max-w-3xl mx-auto">
            Form your thoughts - Feed them anonymously.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        
        
      </main>
      
      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2025 Feed Formly. All rights reserved.
      </footer>
         
      
       
      
    </>
  );
}
