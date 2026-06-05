export default function WishlistDrawer({ open, setOpen }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-4 border-b flex justify-between">
        <h2 className="font-bold">Wishlist</h2>
        <button onClick={() => setOpen(false)}>✖</button>
      </div>

      <div className="p-4 space-y-3">
        <div className="border p-2 rounded">HP Ryzen 3</div>
        <div className="border p-2 rounded">Dell Inspiron</div>
      </div>
    </div>
  );
}