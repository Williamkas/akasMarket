import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routes = [
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/products' }
];

export default function Breadcrumb() {
  const pathname = usePathname();
  return (
    <nav className='flex items-center text-sm text-gray-700 mb-6' aria-label='Breadcrumb'>
      {routes.map((route, idx) => {
        const isActive = pathname === route.href || (route.href === '/' && pathname === '');
        return (
          <span key={route.href} className='flex items-center'>
            {idx > 0 && <span className='mx-2 text-gray-400'>&gt;</span>}
            <Link
              href={route.href}
              className={
                isActive
                  ? 'font-bold text-gray-900 pointer-events-none cursor-default'
                  : 'hover:underline text-gray-600'
              }
              aria-current={isActive ? 'page' : undefined}
            >
              {route.name}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
