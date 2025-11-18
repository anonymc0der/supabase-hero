'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface SupabaseHeroData {
  supabase_hero_id: string;
  created_at: string;
  number_input: number;
}

export default function Home() {
  const [numberInput, setNumberInput] = useState<number | ''>('');
  const [data, setData] = useState<SupabaseHeroData[]>([]);
  const supabase = createClient();

  const fetchData = async () => {
    const { data: supabaseData, error } = await supabase
      .from('supabase-hero')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(supabaseData || []);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('supabase-hero-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'supabase-hero' },
        (payload) => {
          console.log('Change received!', payload);
          fetchData(); // Re-fetch data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numberInput === '') return;

    const { error } = await supabase
      .from('supabase-hero')
      .insert({ number_input: numberInput });

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      setNumberInput('');
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">Supabase Hero Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          value={numberInput}
          onChange={(e) => setNumberInput(Number(e.target.value))}
          placeholder="Enter a number"
          className="p-2 border border-gray-300 rounded-md text-black"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">Supabase Hero Table</h2>
        {data.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 text-black">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Number Input</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.supabase_hero_id}>
                  <td className="py-2 px-4 border-b">{row.supabase_hero_id}</td>
                  <td className="py-2 px-4 border-b">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{row.number_input}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data yet. Enter a number to add the first row!</p>
        )}
      </div>
    </div>
  );
}
