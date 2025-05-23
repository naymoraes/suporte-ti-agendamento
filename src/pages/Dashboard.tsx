
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useScheduling } from '../contexts/SchedulingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Computer, Calendar, Settings, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getUserAppointments } = useScheduling();
  const navigate = useNavigate();

  const userAppointments = getUserAppointments(user?.id || '');
  const pendingAppointments = userAppointments.filter(apt => apt.status === 'pendente').length;
  const confirmedAppointments = userAppointments.filter(apt => apt.status === 'confirmado').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Computer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Suporte TI</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Gerencie seus agendamentos de suporte técnico
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Agendamentos Pendentes
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{pendingAppointments}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Agendamentos Confirmados
              </CardTitle>
              <Settings className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{confirmedAppointments}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Total de Agendamentos
              </CardTitle>
              <Computer className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{userAppointments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
                onClick={() => navigate('/schedule')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Agendar Suporte Técnico</CardTitle>
                  <CardDescription>
                    Agende um novo atendimento técnico
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/schedule')}
              >
                Agendar Atendimento
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
                onClick={() => navigate('/appointments')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-gray-900">Meus Agendamentos</CardTitle>
                  <CardDescription>
                    Visualize e gerencie seus agendamentos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
                onClick={() => navigate('/appointments')}
              >
                Ver Agendamentos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Info */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Informações da Conta</CardTitle>
                <CardDescription>Seus dados cadastrais</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Nome:</span>
                <span className="ml-2 text-gray-600">{user?.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">E-mail:</span>
                <span className="ml-2 text-gray-600">{user?.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ID do Usuário:</span>
                <span className="ml-2 text-gray-600 font-mono text-sm">{user?.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
