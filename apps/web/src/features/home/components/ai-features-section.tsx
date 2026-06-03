"use client";

const aiFeatures = [
  { title: "3D Product Visualization", desc: "Preview products in 3D for a better sense of scale and style." },
  { title: "AR Furniture Placement", desc: "Place furniture virtually in your room using your phone's camera." },
  { title: "AI Placement Guidance", desc: "Get smart suggestions to arrange furniture for optimal flow." },
];

export function AIFeaturesSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-semibold text-slate-900">AI & AR Features</h2>
        <p className="mt-2 text-sm text-slate-600">Practical tools coming soon to help you visualize and place furniture.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiFeatures.map((f) => (
            <div key={f.title} className="rounded bg-white p-4 shadow-sm">
              <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center font-medium text-slate-700">AI</div>
              <h3 className="mt-3 font-medium text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
