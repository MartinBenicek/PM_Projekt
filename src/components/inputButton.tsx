import { IonButton, IonInput } from "@ionic/react";
import { useEffect, useState } from "react";

const InputButton = ({
  mentalAttribute,
  mentalAttributeShortcut,
  character,
  charactersStored,
  setCharactersStored,
  store,
  maxValue,
}: {
  mentalAttribute: string;
  mentalAttributeShortcut: string;
  character: any;
  charactersStored: any[];
  setCharactersStored: (updated: any[]) => void;
  store: any;
  maxValue: number;
}) => {
  const [attribute, setAttribute] = useState(
    character[mentalAttributeShortcut.toLowerCase()]
  );

  useEffect(() => {
    setAttribute(character[mentalAttributeShortcut.toLowerCase()]);
  }, [character, mentalAttributeShortcut]);

  const updateStat = async (id: string, newResult: number) => {
    const foundCharacter = charactersStored.find((char) => char.id === id);

    if (foundCharacter) {
      foundCharacter[mentalAttributeShortcut.toLowerCase()] = newResult;

      const updatedCharacters = charactersStored.map((char) =>
        char.id === id ? foundCharacter : char
      );

      setCharactersStored(updatedCharacters);
      await store?.set("my-characters", updatedCharacters);
    }
  };

  const handleInputChange = (e: CustomEvent) => {
    const value = parseInt(e.detail.value || "10", 10);
    if (!isNaN(value)) {
      const result = Math.max(1, Math.min(maxValue, value));
      setAttribute(result);
      updateStat(character.id, result);
    }
  };

  const increment = () => {
    if (attribute < maxValue) {
      const result = attribute + 1;
      setAttribute(result);
      updateStat(character.id, result);
    }
  };

  const decrement = () => {
    if (attribute > 1) {
      const result = attribute - 1;
      setAttribute(result);
      updateStat(character.id, result);
    }
  };
  return (
    <div className="grid grid-cols-2 mt-3">
      <div>
        <h2 className="text-xl">{mentalAttribute}</h2>
      </div>
      <div className="flex items-center justify-evenly">
        <IonButton strong={true} onClick={decrement}>
          -
        </IonButton>
        <IonInput
          type="number"
          className="w-12 h-10 text-center"
          value={attribute}
          onIonChange={handleInputChange}
          max={maxValue}
          min={1}
        />
        <IonButton strong={true} onClick={increment}>
          +
        </IonButton>
      </div>
    </div>
  );
};

export default InputButton;
