// components/Navbar.jsx
export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
      <h1 className="font-bold">E-Commerce</h1>

      <input
        className="w-1/2 px-3 py-1 rounded text-black"
        placeholder="Search products..."
      />

      <div className="flex gap-4">
        <span>Cart 🛒</span>
        <span>Login</span>
      </div>
    </div>
  );
}