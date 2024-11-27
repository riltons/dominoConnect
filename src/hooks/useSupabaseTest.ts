import { useState } from 'react';
import { supabase } from '../config/supabase';

export const useSupabaseTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Iniciando teste de conexão...');
      
      // Tenta fazer uma query simples na tabela users
      const { data, error: queryError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (queryError) {
        console.error('Erro na query:', queryError);
        throw new Error(`Erro na query: ${queryError.message}`);
      }

      console.log('Conexão bem sucedida! Resultado:', data);
      setResult({ success: true, message: 'Conexão estabelecida com sucesso!' });
      return data;
    } catch (err: any) {
      console.error('Erro completo:', JSON.stringify(err, null, 2));
      const errorMessage = err.message || 'Erro desconhecido ao conectar com o Supabase';
      setError(errorMessage);
      setResult({ success: false, message: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    testConnection,
    isLoading,
    error,
    result
  };
};
