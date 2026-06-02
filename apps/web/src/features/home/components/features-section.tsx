"use client";

const features = [
  { title: "Quality Furniture", desc: "Handpicked pieces built to last." },
  { title: "Secure Shopping", desc: "Safe payments and data protection." },
  { title: "Fast Delivery", desc: "Reliable delivery right to your door." },
  { title: "Trusted Experience", desc: "Thousands of satisfied customers." },
];

export function FeaturesSection() {
  return (
    <section id="about" className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-semibold text-slate-900">Why Choose LIMATA</h2>
        <p className="mt-2 text-sm text-slate-600">Simple, reliable, and customer-focused.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded bg-white p-4 shadow-sm">
              <div className="h-10 w-10 rounded bg-amber-100 flex items-center justify-center font-bold text-amber-700">{f.title[0]}</div>
              <h3 className="mt-3 font-medium text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
