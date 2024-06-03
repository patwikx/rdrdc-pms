  import { LoginForm } from "@/components/auth/login-form";


  export default function Home() {
    return (
      <main className="flex h-full flex-col items-center justify-center">
        <div className="mt-8">
            <LoginForm />
          </div>
      </main>
    )
  }
