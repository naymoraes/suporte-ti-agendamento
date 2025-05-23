
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Appointment {
  id: string;
  userId: string;
  date: string;
  time: string;
  description: string;
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  createdAt: string;
}

interface SchedulingContextType {
  appointments: Appointment[];
  createAppointment: (userId: string, date: string, time: string, description: string) => string;
  updateAppointment: (id: string, updates: Partial<Appointment>) => boolean;
  cancelAppointment: (id: string) => boolean;
  getUserAppointments: (userId: string) => Appointment[];
}

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};

export const SchedulingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const saveAppointments = (updatedAppointments: Appointment[]) => {
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const createAppointment = (userId: string, date: string, time: string, description: string): string => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      userId,
      date,
      time,
      description,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    const updatedAppointments = [...appointments, newAppointment];
    saveAppointments(updatedAppointments);
    return newAppointment.id;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>): boolean => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, ...updates } : appointment
    );
    saveAppointments(updatedAppointments);
    return true;
  };

  const cancelAppointment = (id: string): boolean => {
    return updateAppointment(id, { status: 'cancelado' });
  };

  const getUserAppointments = (userId: string): Appointment[] => {
    return appointments.filter(appointment => appointment.userId === userId);
  };

  const value = {
    appointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getUserAppointments,
  };

  return <SchedulingContext.Provider value={value}>{children}</SchedulingContext.Provider>;
};
