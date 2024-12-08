import { Storage } from "@ionic/storage";

import { useEffect, useState } from "react";
import { Spell } from "./spellsApi";

const createCharacterKeys = "my-characters";

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
}

const useStorage = () => {
  const [store, setStore] = useState<Storage>();
  const [charactersStored, setCharactersStored] = useState<createCharacter[]>(
    []
  );

  useEffect(() => {
    const initStorage = async () => {
      const newStore = new Storage({
        name: "dndDB",
      });
      const store = await newStore.create();
      setStore(store);
      const storedCharacters = (await store.get(createCharacterKeys)) || [];
      setCharactersStored(storedCharacters);
    };
    initStorage();
  }, []);

  return { charactersStored, store, setCharactersStored };
};

export default useStorage;
