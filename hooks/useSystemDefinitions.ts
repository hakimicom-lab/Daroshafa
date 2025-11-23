
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { BaseDefinition } from '../types';

export const useSystemDefinitions = () => {
  const [definitions, setDefinitions] = useState<BaseDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinitions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('base_definitions')
        .select('*')
        .order('title');

      if (error) throw error;
      setDefinitions(data as BaseDefinition[] || []);
    } catch (err: any) {
      console.error('Error fetching definitions:', err);
      setError(err.message);
      setDefinitions([]); // Ensure it is empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDefinitions();
  }, [fetchDefinitions]);

  // --- Derived State Helpers ---

  // Get all departments
  const departments = definitions.filter(d => d.category === 'department');

  // Get all jobs (can filter by deptId if provided)
  const getJobs = (deptId?: string) => {
    const jobs = definitions.filter(d => d.category === 'job_title');
    if (deptId) {
      return jobs.filter(j => j.parent_id === deptId);
    }
    return jobs;
  };

  // Get all KPIs
  const kpis = definitions.filter(d => d.category === 'evaluation_kpi');

  // --- CRUD Actions ---
  
  const addDefinition = async (def: Omit<BaseDefinition, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('base_definitions').insert(def).select();
    if (error) throw error;
    if (data) setDefinitions(prev => [...prev, data[0]]);
    return data;
  };

  const updateDefinition = async (id: string, updates: Partial<BaseDefinition>) => {
    const { data, error } = await supabase.from('base_definitions').update(updates).eq('id', id).select();
    if (error) throw error;
    if (data) setDefinitions(prev => prev.map(d => d.id === id ? data[0] : d));
  };

  const deleteDefinition = async (id: string) => {
    const { error } = await supabase.from('base_definitions').delete().eq('id', id);
    if (error) throw error;
    setDefinitions(prev => prev.filter(d => d.id !== id));
  };

  return {
    definitions,
    loading,
    error,
    departments,
    getJobs,
    kpis,
    refresh: fetchDefinitions,
    addDefinition,
    updateDefinition,
    deleteDefinition
  };
};
