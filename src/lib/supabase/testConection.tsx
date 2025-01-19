import { useEffect } from "react";
import { testSupabaseConnection } from "./client";

const TestConnection = () => {
  useEffect(() => {
    const checkConnection = async () => {
      const success = await testSupabaseConnection();
      if (success) {
        console.log("¡Conexión a Supabase exitosa!");
      } else {
        console.log("Hubo un problema con la conexión.");
      }
    };

    checkConnection();
  }, []);

  return <div>Prueba de conexión con Supabase</div>;
};

export default TestConnection;
