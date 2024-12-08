import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import characterSvg from "../svg/character.svg";
import scrollSvg from "../svg/scroll.svg";
import useStorage, { createCharacter } from "../services/storage";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spell, SpellTable } from "../services/spellsApi";
import InputButton from "../components/inputButton";

const Tab1Character = () => {
  const { id } = useParams<{ id: string }>();
  const { charactersStored, setCharactersStored, store } = useStorage();
  const [spellTable, setSpellTable] = useState<SpellTable[] | null>(null);
  const [totalSpellSlots, setTotalSpellSlots] = useState<
    { key: string; value: number }[]
  >([]);
  const [isCharacterReady, setIsCharacterReady] = useState(false);

  const findCharacter = (id: string) => {
    return charactersStored.find((character) => character.id === id);
  };

  const [getCharacter, setGetCharacter] = useState<createCharacter | undefined>(
    findCharacter(id)
  );

  useEffect(() => {
    if (charactersStored.length > 0) {
      const character = findCharacter(id);
      setGetCharacter(character);
      setIsCharacterReady(true);
    }
  }, [charactersStored, id]);

  const getUpdatedStorage = async () => {
    const storage = await store?.get("my-characters");
    setCharactersStored(storage);
  };

  useEffect(() => {
    if (store) {
      getUpdatedStorage();
    }
  }, [store, charactersStored]);

  useEffect(() => {
    if (isCharacterReady && getCharacter?.cls) {
      const API_URL = `https://www.dnd5eapi.co/api/classes/${getCharacter.cls.toLowerCase()}/levels`;
      const fetchSpellTable = async () => {
        try {
          const response = await axios.get(API_URL);
          setSpellTable(response.data);
        } catch (error) {
          console.error("Error fetching characters:", error);
        }
      };
      fetchSpellTable();
    }
  }, [isCharacterReady, getCharacter?.cls]);

  useEffect(() => {
    fillSpellSlots();
  }, [spellTable, getCharacter?.level]);

  const fillSpellSlots = () => {
    const findSpellSlots = spellTable?.find(
      (level: SpellTable) => level.level === getCharacter?.level
    )?.spellcasting;

    if (findSpellSlots) {
      const spellSlotsArray = Object.entries(findSpellSlots).map(
        ([key, value]) => ({
          key,
          value,
        })
      );
      setTotalSpellSlots(spellSlotsArray);
    } else {
      setTotalSpellSlots([]);
    }
  };

  let proficiencyBonus, spellcastingAbilityModifier;

  if (getCharacter && spellTable) {
    proficiencyBonus = spellTable?.find(
      (level: SpellTable) => level.level === getCharacter?.level
    )?.prof_bonus;
    spellcastingAbilityModifier = Math.floor(
      ((getCharacter[
        getCharacter.spellcastingAbility as keyof typeof getCharacter
      ] as number) -
        10) /
        2
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>Character</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {getCharacter && (
          <>
            <IonCard className="p-2 text-center">
              <IonCardTitle>{getCharacter.name}</IonCardTitle>
              <InputButton
                mentalAttribute="Intelligence"
                mentalAttributeShortcut="int"
                character={getCharacter}
                store={store}
                charactersStored={charactersStored}
                setCharactersStored={setCharactersStored}
                maxValue={30}
              ></InputButton>
              <InputButton
                mentalAttribute="Wisdom"
                mentalAttributeShortcut="wis"
                character={getCharacter}
                store={store}
                charactersStored={charactersStored}
                setCharactersStored={setCharactersStored}
                maxValue={30}
              ></InputButton>
              <InputButton
                mentalAttribute="Charisma"
                mentalAttributeShortcut="cha"
                character={getCharacter}
                store={store}
                charactersStored={charactersStored}
                setCharactersStored={setCharactersStored}
                maxValue={30}
              ></InputButton>
              <InputButton
                mentalAttribute="Level"
                mentalAttributeShortcut="level"
                character={getCharacter}
                store={store}
                charactersStored={charactersStored}
                setCharactersStored={setCharactersStored}
                maxValue={20}
              ></InputButton>
            </IonCard>
            <IonCard className="p-2 text-center">
              <IonCardTitle>Spell stats</IonCardTitle>
              {spellTable && totalSpellSlots && (
                <>
                  <IonCardContent>
                    <IonList>
                      <IonItem>
                        Spellcasting ability: {spellcastingAbilityModifier}
                      </IonItem>
                      <IonItem>
                        Spell save DC:{" "}
                        {8 +
                          (proficiencyBonus || 0) +
                          (spellcastingAbilityModifier || 0)}
                      </IonItem>
                      <IonItem>
                        Spell attack bonus:{" "}
                        {(proficiencyBonus || 0) +
                          (spellcastingAbilityModifier || 0)}
                      </IonItem>
                      <IonItem>
                        Cantrips known:{" "}
                        {spellTable.find(
                          (level: SpellTable) =>
                            level.level === getCharacter?.level
                        )?.spellcasting.cantrips_known || 0}
                      </IonItem>
                      {spellTable.find(
                        (level: SpellTable) =>
                          level.level === getCharacter?.level
                      )?.spellcasting.spells_known ? (
                        <IonItem>
                          Spells known:{" "}
                          {
                            spellTable.find(
                              (level: SpellTable) =>
                                level.level === getCharacter?.level
                            )?.spellcasting.spells_known
                          }
                        </IonItem>
                      ) : (
                        <IonItem>
                          Spells prepared:{" "}
                          {getCharacter.level +
                            (spellcastingAbilityModifier || 0)}
                        </IonItem>
                      )}
                      {totalSpellSlots
                        .filter(
                          (slot) =>
                            slot.key.startsWith("spell_slots_level_") &&
                            slot.value > 0
                        )
                        .map((slot) => (
                          <IonItem key={slot.key}>
                            {" "}
                            {slot.key.replace(
                              "spell_slots_level_",
                              "Level "
                            )}{" "}
                            spell slots: {slot.value}
                          </IonItem>
                        ))}
                    </IonList>
                  </IonCardContent>
                </>
              )}
            </IonCard>
            <IonCard className="p-4">
              <IonCardTitle className="p-2 text-center">Spells</IonCardTitle>
              {getCharacter.spells.map((spell: Spell) => (
                <IonItem key={spell.index}>{spell.name}</IonItem>
              ))}
            </IonCard>
          </>
        )}
      </IonContent>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1Character" href={`/tab1/character/${id}`}>
          <IonIcon aria-hidden="true" icon={characterSvg} />
          <IonLabel>Character</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab1Spells" href={`/tab1/spells/${id}`}>
          <IonIcon aria-hidden="true" icon={scrollSvg} />
          <IonLabel>Spells</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default Tab1Character;
