/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com',
      'images.unsplash.com',
      'cdn.pixabay.com'
      // Agrega aquí otros dominios que uses para imágenes de productos
    ]
  }
};

module.exports = nextConfig;
