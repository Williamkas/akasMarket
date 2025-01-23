import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-900 text-white">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">AKAS MARKET</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 rounded-l-md border border-gray-300"
        />
        <button className="p-2 bg-blue-600 text-white rounded-r-md">Search</button>
      </div>
      <div className="flex items-center">
        <Link href="/cart">
          <span className="material-icons">shopping_cart</span>
        </Link>
        <Link href="/api/auth/logout">
          <button className="ml-4 p-2 bg-red-600 text-white rounded">Perfil</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;