export default function CartPage() {
  const token = 'your-token-here'; // Define your token here

  // GET carrito
  fetch('/api/carts', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  // PATCH carrito
  fetch('/api/carts', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [
        { productId: 'b5cd991f-4425-48de-acf1-6376916bcc61', quantity: 10 },
        { productId: '20f03f4d-bd15-4dae-a40f-4634d35b6bff', quantity: 5 }
      ]
    })
  });

  return (
    <div>
      <h1>Cart</h1>
      {/* Aquí puedes incluir más contenido o componentes */}
    </div>
  );
}
