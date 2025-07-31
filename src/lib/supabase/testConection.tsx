import { useEffect } from 'react';
import { supabase } from './client';

export const supabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error al conectar con Supabase:', error.message);
      return false;
    }

    console.log('Conexión exitosa. Datos:', data);
    return true;
  } catch (err) {
    console.error('Error inesperado:', err);
    return false;
  }
};

const TestConnection = () => {
  useEffect(() => {
    const checkConnection = async () => {
      const success = await supabaseConnection();
      if (success) {
        // ¡Conexión a Supabase exitosa!
      } else {
        // Hubo un problema con la conexión.
      }
    };

    checkConnection();
  }, []);

  return <div>Prueba de conexión con Supabase</div>;
};

export default TestConnection;
