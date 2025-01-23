import React from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  onAddToCart: (id: string) => void;
  onFavorite: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  onAddToCart,
  onFavorite,
}) => {
  return (
    <div className="border rounded-lg shadow-md p-4">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{name}</h2>
      <p className="text-gray-700">${price.toFixed(2)}</p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onAddToCart(id)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add to Cart
        </button>
        <button
          onClick={() => onFavorite(id)}
          className="text-red-500 hover:underline"
        >
          Favorite
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
