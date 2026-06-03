export function Footer() {
  return (
    <footer className="border-t bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <div className="text-xl font-semibold">LIMATA</div>
            <div className="text-sm text-slate-600">One Click Furniture Store</div>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="font-medium">Links</div>
              <div className="mt-2 flex flex-col text-sm text-slate-600">
                <a href="/">Home</a>
                <a href="/products">Products</a>
                <a href="/contact">Contact</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-500">© 2026 LIMATA</div>
      </div>
    </footer>
  );
}