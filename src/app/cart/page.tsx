'use client';

import { useEffect } from 'react';

export default function CartPage() {
  const token =
    'eyJhbGciOiJIUzI1NiIsImtpZCI6IlNWRy81bUZTOTdhcTZqd04iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2twbm1yZGNqeHd1dGl1dm54bXRyLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhMjQ0Y2JjYy04ZTFiLTRiYmQtODA1NC03YTA3MmNjOTdkZTMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQwNDU2MDY4LCJpYXQiOjE3NDA0NTI0NjgsImVtYWlsIjoid2lsbGlhbWthc21lcmNhZG9saWJyZUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoid2lsbGlhbWthc21lcmNhZG9saWJyZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibGFzdG5hbWUiOiJQYWxhY2lvcyIsIm5hbWUiOiJXaWxseSIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicm9sZSI6ImFkbWluIiwic3ViIjoiYTI0NGNiY2MtOGUxYi00YmJkLTgwNTQtN2EwNzJjYzk3ZGUzIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDA0NTI0Njh9XSwic2Vzc2lvbl9pZCI6IjAxMmU0MjYzLWFlZGQtNGU0OS1iYWY1LTFmMTYzZmNhMTljMiIsImlzX2Fub255bW91cyI6ZmFsc2V9.4afZ2fvhDhuHSrrSXSLtaYp3rsPdEUeHsKMeC6ZwG2k'; // Define your token here

  useEffect(() => {
    // GET carrito
    fetch('/api/carts', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => console.log('Carrito:', data))
      .catch((error) => console.error('Error al obtener el carrito:', error));

    // PATCH carrito
    // fetch('/api/carts', {
    //   method: 'PATCH',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     items: [
    //       { productId: 'b5cd991f-4425-48de-acf1-6376916bcc61', quantity: 10 },
    //       { productId: '20f03f4d-bd15-4dae-a40f-4634d35b6bff', quantity: 5 }
    //     ]
    //   })
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log('Carrito actualizado:', data))
    //   .catch((error) => console.error('Error al actualizar el carrito:', error));
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div>
      <h1>Cart</h1>
      {/* Aquí puedes incluir más contenido o componentes */}
    </div>
  );
}
