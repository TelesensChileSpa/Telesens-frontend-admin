// src/interfaces/socket.user.interface.ts

export interface ServerToClientEvents {
    userLoggedIn: (data: { userId: string | null }) => void;  // Aceptamos null si userId puede ser nulo
    userLoggedOut: (data: { userId: string }) => void;  // Suponemos que siempre se recibe un string para logged out
    connect_error: (err: Error) => void;
    disconnect: (reason: string) => void;
  }
  
  export interface ClientToServerEvents {
    // Si tu cliente emite eventos al servidor, los defines aquí
    // Actualmente está vacío
  }
  