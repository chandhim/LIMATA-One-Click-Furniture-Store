import { Button } from "@limata/ui";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold">LIMATA Monorepo Starter</h1>
      <p className="text-muted-foreground">
        Next.js 15 web app connected to shared UI, API, and AI service
        workspaces.
      </p>
      <div>
        <Button>shadcn/ui button from packages/ui</Button>
      </div>
    </main>
  );
}
