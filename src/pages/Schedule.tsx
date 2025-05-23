
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useScheduling } from '../contexts/SchedulingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Computer, Calendar, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Schedule = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createAppointment } = useScheduling();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !description.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    // Validar se a data não é no passado
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    if (selectedDateTime <= now) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data e hora futuras",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const appointmentId = createAppointment(user?.id || '', date, time, description);
      
      toast({
        title: "Sucesso!",
        description: "Agendamento registrado com sucesso!",
        className: "bg-green-50 border-green-200",
      });

      // Limpar formulário
      setDate('');
      setTime('');
      setDescription('');

      // Redirecionar para agendamentos após 2 segundos
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr;
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
                <p className="text-sm text-gray-600">Agendar Suporte Técnico</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Agendar Atendimento Técnico
          </h2>
          <p className="text-gray-600">
            Preencha os dados para solicitar um atendimento técnico
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900 flex items-center space-x-2">
                  <Calendar className="h-6 w-6" />
                  <span>Novo Agendamento</span>
                </CardTitle>
                <CardDescription>
                  Preencha as informações do atendimento que você precisa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data do Atendimento</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Horário Preferido</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Problema</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente o problema que você está enfrentando..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500">
                      Seja específico sobre o problema para que possamos prestar o melhor atendimento
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Confirmar Agendamento'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="space-y-6">
            {/* Informações do Usuário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações do Solicitante</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Nome:</span>
                  <p className="text-gray-600">{user?.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">E-mail:</span>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">ID do Usuário:</span>
                  <p className="text-gray-600 font-mono text-sm">{user?.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Preview do Agendamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Data:</span>
                  <p className="text-gray-600">{date ? formatDate(date) : 'Não selecionada'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Horário:</span>
                  <p className="text-gray-600">{time ? formatTime(time) : 'Não selecionado'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Descrição:</span>
                  <p className="text-gray-600">{description || 'Não informada'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Dicas Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-blue-800">
                <p>• Seja específico na descrição do problema</p>
                <p>• Informe marca e modelo dos equipamentos</p>
                <p>• Mencione mensagens de erro, se houver</p>
                <p>• Indique a urgência do atendimento</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
