import { AudioApp } from '../components/AudioApp'; 

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        
      </div>

      <div className="relative flex place-items-center">
        <AudioApp/>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
      </div>
    </main>
  )
}
