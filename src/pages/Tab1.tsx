import {
  IonPage,
  IonFab,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonFabButton,
  IonModal,
  IonButton,
  IonItem,
  IonInput,
  IonList,
  IonSpinner,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonAlert,
} from "@ionic/react";
import { add, trash } from "ionicons/icons";
import "./Tab1.css";
import { useEffect, useState } from "react";
import CharacterClass from "../components/characterClass";
import axios from "axios";
import { Class } from "../services/spellsApi";
import useStorage, { createCharacter } from "../services/storage";
import { useHistory, useLocation } from "react-router-dom";

const API_URL = "https://www.dnd5eapi.co/api/classes/";

const Tab1: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState<Class[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [selectedClass, setselectedClass] = useState("");
  const [level, setLevel] = useState(1);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const { charactersStored, setCharactersStored, store } = useStorage();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(API_URL);
        const noSpellClass = ["barbarian", "fighter", "monk", "rogue"];
        const spellcastingClasses = response.data.results.filter(
          (cls: Class) => !noSpellClass.includes(cls.index)
        );
        setClasses(spellcastingClasses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleName = (e: any) => {
    setName(e.target.value);
  };

  const createCharacter = async () => {
    let isError = false;
    if (name.length === 0) {
      setErrorName(true);
      setTimeout(() => {
        setErrorName(false);
      }, 200);
      isError = true;
    }

    if (selectedClass.length === 0) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 200);
      isError = true;
    }
    if (isError) return;

    const getSpellCastingAbility = async () => {
      try {
        const response = await axios.get(
          `https://www.dnd5eapi.co/api/classes/${selectedClass.toLowerCase()}`
        );
        return response.data.spellcasting.spellcasting_ability.index;
      } catch (error) {
        console.error("Error fetching spellcasting ability:", error);
        return null;
      }
    };

    const spellcastingAbility = await getSpellCastingAbility();

    const characterData: createCharacter = {
      id: new Date().getTime().toString(),
      name: name,
      cls: selectedClass,
      level: level,
      spells: [],
      int: 10,
      wis: 10,
      cha: 10,
      spellcastingAbility: spellcastingAbility,
      spellsMax: 0,
      cantripsMax: 0,
    };

    const updatedCharacters = [...charactersStored, characterData];
    setCharactersStored(updatedCharacters);
    await store?.set("my-characters", updatedCharacters);

    closeModal();
  };

  const deleteCharacter = async (id: string) => {
    const filterCharacters = charactersStored.filter(
      (character) => character.id !== id
    );
    setCharactersStored(filterCharacters);
    await store?.set("my-characters", filterCharacters);
  };

  useEffect(() => {
    const fetchStoredCharacters = async () => {
      const storedCharacters = await store?.get("my-characters");
      if (storedCharacters) {
        setCharactersStored(storedCharacters);
      }
    };

    fetchStoredCharacters();
  }, [location]);

  const handleInputChange = (e: CustomEvent) => {
    const value = parseInt(e.detail.value || "10", 10);
    if (!isNaN(value)) {
      const result = Math.max(1, Math.min(20, value));
      setLevel(result);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Characters</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="relative">
        <div className="pb-16">
          {charactersStored.map((char) => (
            <IonCard
              key={char.id}
              className="p-2"
              onClick={() => {
                if (alert) return;
                history.push(`/tab1/character/${char.id}`);
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <IonCardTitle>{char.name}</IonCardTitle>
                  <IonCardSubtitle>
                    {char.cls}, level - {char.level}
                  </IonCardSubtitle>
                </div>
                <div
                  className="text-xl text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCharId(char.id);
                    setAlert(true);
                  }}
                >
                  <IonIcon icon={trash} size="large"></IonIcon>
                </div>
              </div>
              <IonAlert
                isOpen={alert}
                header="Delete character?"
                message={`Do you really want to remove ${
                  charactersStored.find((c) => c.id === selectedCharId)?.name
                }?`}
                buttons={[
                  {
                    text: "Cancel",
                    role: "cancel",
                    handler: () => {
                      setSelectedCharId(null);
                      setAlert(false);
                    },
                  },
                  {
                    text: "Confirm",
                    role: "destructive",
                    handler: async () => {
                      if (selectedCharId) {
                        await deleteCharacter(selectedCharId);
                        setAlert(false);
                        setSelectedCharId(null);
                      }
                    },
                  },
                ]}
              ></IonAlert>
            </IonCard>
          ))}
        </div>
        <IonFab onClick={openModal} className="right-2.5 fixed bottom-2.5">
          <IonFabButton id="character-add">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonModal isOpen={modalOpen} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create new character</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div id="character-data">
              <IonItem className="py-4">
                <IonInput
                  label="Character name"
                  labelPlacement="stacked"
                  type="text"
                  fill="outline"
                  placeholder="Name"
                  className={`my-2 ${errorName ? "text-red-500" : ""} `}
                  onIonInput={handleName}
                  value={name}
                  maxlength={30}
                  counter={true}
                />
              </IonItem>
            </div>
            <IonList className="grid grid-cols-2">
              {loading ? (
                <IonSpinner />
              ) : (
                classes.map((cls: Class) => (
                  <CharacterClass
                    key={cls.index}
                    name={cls.name}
                    onClick={() => {
                      setselectedClass(cls.name);
                    }}
                    selected={cls.name === selectedClass}
                    error={error}
                  ></CharacterClass>
                ))
              )}
            </IonList>
            <div className="px-10 pt-5">
              <div className="flex justify-between">
                <IonButton
                  strong={true}
                  onClick={() => (level == 1 ? null : setLevel(level - 1))}
                >
                  -
                </IonButton>
                <IonInput
                  type="number"
                  className="w-12 text-center"
                  value={level}
                  onIonChange={handleInputChange}
                />
                <IonButton
                  strong={true}
                  onClick={() => (level == 20 ? null : setLevel(level + 1))}
                >
                  +
                </IonButton>
              </div>

              <div className="flex justify-between items-center mt-4">
                <IonButton strong={true} onClick={closeModal}>
                  Cancel
                </IonButton>
                <IonButton strong={true} onClick={createCharacter}>
                  Confirm
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
