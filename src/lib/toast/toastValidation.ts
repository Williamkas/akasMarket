import { toast } from 'sonner';

export const showErrorToast = (message: string) => {
  toast(message, {
    duration: 6000,
    style: {
      background: '#f44336', // Fondo rojo para error
      color: 'white',
      borderRadius: '8px',
      fontSize: '18px', // Tamaño de texto aumentado
      padding: '10px 20px'
    }
  });
};

export const showSuccessToast = (message: string) => {
  toast(message, {
    duration: 5000,
    style: {
      background: '#4CAF50', // Fondo verde para éxito
      color: 'white',
      borderRadius: '8px',
      fontSize: '18px', // Tamaño de texto aumentado
      padding: '10px 20px'
    }
  });
};
