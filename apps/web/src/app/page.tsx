import { MainLayout } from "@/components/layout/main-layout";

export default function HomePage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold">LIMATA</h1>
          <p className="mt-4 text-lg text-slate-600">
            AI-assisted furniture ecommerce platform
          </p>
        </div>
      </section>
    </MainLayout>
  );
}