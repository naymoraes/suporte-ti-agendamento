
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useScheduling } from '../contexts/SchedulingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Computer, Calendar, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Appointments = () => {
  const { user } = useAuth();
  const { getUserAppointments, cancelAppointment, updateAppointment } = useScheduling();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const appointments = getUserAppointments(user?.id || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluido':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'confirmado':
        return 'Confirmado';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleCancel = async (appointmentId: string) => {
    setLoading(appointmentId);
    try {
      const success = cancelAppointment(appointmentId);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Agendamento cancelado com sucesso!",
          className: "bg-green-50 border-green-200",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cancelar agendamento",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('pt-BR');
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

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
                <p className="text-sm text-gray-600">Meus Agendamentos</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => navigate('/schedule')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Novo Agendamento
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Seus Agendamentos
          </h2>
          <p className="text-gray-600">
            Gerencie todos os seus agendamentos de suporte técnico
          </p>
        </div>

        {appointments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Você ainda não tem agendamentos. Que tal criar o primeiro?
              </p>
              <Button
                onClick={() => navigate('/schedule')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Agendar Suporte Técnico
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedAppointments.map((appointment) => (
              <Card key={appointment.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">
                          {formatDate(appointment.date)} às {formatTime(appointment.time)}
                        </CardTitle>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-500">
                        Agendamento #{appointment.id} • Criado em {' '}
                        {new Date(appointment.createdAt).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                    {appointment.status !== 'cancelado' && appointment.status !== 'concluido' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading === appointment.id}
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {loading === appointment.id ? 'Cancelando...' : 'Cancelar'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Descrição do Problema:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {appointment.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                      <div>
                        <span className="font-medium text-gray-700">Data:</span>
                        <p className="text-gray-600">{formatDate(appointment.date)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Horário:</span>
                        <p className="text-gray-600">{formatTime(appointment.time)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <p className="text-gray-600">{getStatusText(appointment.status)}</p>
                      </div>
                    </div>

                    {appointment.status === 'pendente' && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertDescription className="text-yellow-800">
                          <strong>Aguardando confirmação:</strong> Nossa equipe analisará sua solicitação e entrará em contato em breve.
                        </AlertDescription>
                      </Alert>
                    )}

                    {appointment.status === 'confirmado' && (
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-blue-800">
                          <strong>Agendamento confirmado:</strong> Nossa equipe comparecerá no horário agendado.
                        </AlertDescription>
                      </Alert>
                    )}

                    {appointment.status === 'concluido' && (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                          <strong>Atendimento concluído:</strong> O suporte técnico foi realizado com sucesso.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Resumo estatísticas */}
        {appointments.length > 0 && (
          <Card className="mt-8 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Resumo dos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {appointments.filter(a => a.status === 'pendente').length}
                  </div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {appointments.filter(a => a.status === 'confirmado').length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {appointments.filter(a => a.status === 'concluido').length}
                  </div>
                  <div className="text-sm text-gray-600">Concluídos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {appointments.filter(a => a.status === 'cancelado').length}
                  </div>
                  <div className="text-sm text-gray-600">Cancelados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Appointments;
