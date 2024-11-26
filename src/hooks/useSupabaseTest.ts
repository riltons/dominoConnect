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
      
      // Tenta buscar a versão do PostgreSQL
      const { data, error: queryError } = await supabase
        .rpc('version')
        .single();

      if (queryError) {
        throw queryError;
      }

      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message);
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
