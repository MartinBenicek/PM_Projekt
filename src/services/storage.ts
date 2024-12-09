import { Storage } from "@ionic/storage";

import { useEffect, useState } from "react";
import { Spell } from "./spellsApi";

const createCharacterKeys = "my-characters";
const darkModeKey = "dark-mode";

export interface createCharacter {
  id: string;
  name: string;
  level: number;
  cls: string;
  spells: Spell[];
  int: number;
  wis: number;
  cha: number;
  spellcastingAbility: string;
  cantripsMax: number;
  spellsMax: number;
}

const useStorage = () => {
  const [store, setStore] = useState<Storage>();
  const [charactersStored, setCharactersStored] = useState<createCharacter[]>(
    []
  );
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const initStorage = async () => {
      const newStore = new Storage({
        name: "dndDB",
      });
      const store = await newStore.create();
      setStore(store);
      const storedCharacters = (await store.get(createCharacterKeys)) || [];
      setCharactersStored(storedCharacters);
      const storedDarkMode = (await store?.get(darkModeKey)) || [];
      setDarkMode(storedDarkMode);
    };
    initStorage();
  }, []);

  return {
    charactersStored,
    store,
    setCharactersStored,
    darkMode,
    setDarkMode,
  };
};

export default useStorage;
