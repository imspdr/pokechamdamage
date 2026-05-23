import { useState, useEffect } from 'react';
import { Party } from '../types/party';
import { createDefaultConfig } from '../types/pokemon';

const STORAGE_KEY = 'pokecham_parties';

export const useParties = () => {
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setParties(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse parties from local storage:', e);
      }
    }
  }, []);

  const saveParties = (newParties: Party[]) => {
    setParties(newParties);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newParties));
  };

  const createParty = () => {
    const newParty: Party = {
      id: Date.now().toString(),
      name: `새 파티 ${parties.length + 1}`,
      members: Array(6).fill(null).map(() => createDefaultConfig())
    };
    saveParties([...parties, newParty]);
    return newParty.id;
  };

  const updateParty = (id: string, updated: Party) => {
    saveParties(parties.map(p => p.id === id ? updated : p));
  };

  const deleteParty = (id: string) => {
    saveParties(parties.filter(p => p.id !== id));
  };

  return { parties, createParty, updateParty, deleteParty };
};
