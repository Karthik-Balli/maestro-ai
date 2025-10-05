export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 py-6 mt-auto">
      <div className="container mx-auto text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AI Interview Assistant
      </div>
    </footer>
  );
}
