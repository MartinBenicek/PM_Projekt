import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonButtons,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonBackButton,
  IonIcon,
  IonAlert,
} from "@ionic/react";
import "./Tab1.css";
import { Spell, SpellDetail } from "../services/spellsApi";
import { useEffect, useState } from "react";
import axios from "axios";
import SpellCard from "../components/spellCard";
import { useParams } from "react-router-dom";
import characterSvg from "../svg/character.svg";
import scrollSvg from "../svg/scroll.svg";
import useStorage, { createCharacter } from "../services/storage";

const Tab1Spells: React.FC = () => {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spellDetails, setSpellDetails] = useState<SpellDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { charactersStored, setCharactersStored, store } = useStorage();
  const [alert, setAlert] = useState(false);

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
    }
  }, [charactersStored, id]);

  useEffect(() => {
    if (store) {
      getUpdatedStorage();
    }
  }, [store, charactersStored]);

  const getUpdatedStorage = async () => {
    const storage = await store?.get("my-characters");
    setCharactersStored(storage);
  };

  useEffect(() => {
    if (getCharacter?.cls) {
      const API_URL = `https://www.dnd5eapi.co/api/classes/${getCharacter.cls.toLowerCase()}/spells`;
      const fetchSpells = async () => {
        try {
          const response = await axios.get(API_URL);
          setSpells(response.data.results);
          setFilteredSpells(response.data.results);
        } catch (error) {
          console.error("Error fetching spells:", error);
        } finally {
          changeLevel(0);
          setLoading(false);
        }
      };

      fetchSpells();
    }
  }, [getCharacter?.cls]);

  useEffect(() => {
    if (spells.length > 0) {
      changeLevel(0);
    }
  }, [spells]);

  const changeLevel = (level: number) => {
    setFilteredSpells(spells.filter((spell: Spell) => spell.level === level));
  };

  const fetchSpellDetails = async (url: string) => {
    try {
      const response = await axios.get(`https://www.dnd5eapi.co${url}`);
      setSpellDetails(response.data);
    } catch (error) {
      console.error("Error fetching spell details:", error);
    }
  };

  const handleSpellClick = (url: string) => {
    fetchSpellDetails(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSpellDetails(null);
  };

  const addSpell = (newSpell: Spell) => {
    if (getCharacter) {
      const alreadyAdded = getCharacter.spells.some(
        (spell: Spell) => spell.index === newSpell.index
      );

      if (alreadyAdded) {
        setAlert(true);
        return;
      }

      const updatedCharacter = {
        ...getCharacter,
        spells: [...getCharacter.spells, newSpell],
      };
      const updatedCharacters = charactersStored.map((char) =>
        char.id === updatedCharacter.id ? updatedCharacter : char
      );

      setCharactersStored(updatedCharacters);
      store?.set("my-characters", updatedCharacters);
      closeModal();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>Spells</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButtons id="spell-buttons">
          {[...Array(10)].map((_, level) => (
            <IonButton key={level} onClick={() => changeLevel(level)}>
              Level {level}
            </IonButton>
          ))}
        </IonButtons>

        {loading ? (
          <p>Loading spells...</p>
        ) : (
          <IonList>
            {filteredSpells.map((spell: Spell) => (
              <IonItem
                key={spell.index}
                onClick={() => handleSpellClick(spell.url)}
              >
                {spell.name}
              </IonItem>
            ))}
          </IonList>
        )}

        <IonModal
          isOpen={modalOpen}
          onDidDismiss={closeModal}
          id="custom-modal"
        >
          <IonContent id="custom-content">
            <IonCard className="flex flex-col pb-3 px-2">
              <IonCardHeader>
                <IonCardTitle>
                  {spellDetails ? spellDetails.name : "Loading..."}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent key={spellDetails?.index}>
                {spellDetails ? (
                  <>
                    <div className="info-section">
                      <SpellCard
                        title="Level"
                        description={spellDetails.level}
                      />
                      <p>
                        <strong>Casting Time:</strong>{" "}
                        {spellDetails.casting_time}
                        {spellDetails.ritual ? " (ritual)" : null}
                      </p>
                      <p>
                        <strong>Range:</strong> {spellDetails.range}
                        {spellDetails.area_of_effect
                          ? ` (${spellDetails.area_of_effect.size} feet, ${spellDetails.area_of_effect.type})`
                          : null}
                      </p>
                      <p>
                        <strong>Components:</strong>{" "}
                        {spellDetails.components.join(", ")}
                        {spellDetails.components.includes("M")
                          ? ` (${spellDetails.material})`
                          : null}
                      </p>
                      <SpellCard
                        title="Duration"
                        description={spellDetails.duration}
                      />
                      <SpellCard
                        title="School"
                        description={spellDetails.school.name}
                      />
                      <SpellCard
                        title="Classes"
                        description={spellDetails.classes
                          .map((cls) => cls.name)
                          .join(", ")}
                      />
                      <SpellCard
                        title="Attack/Save"
                        description={
                          spellDetails.dc?.dc_type?.name ||
                          spellDetails.attack_type ||
                          "None"
                        }
                      />
                      {spellDetails.damage?.damage_type?.name && (
                        <SpellCard
                          title="Damage/Effect"
                          description={spellDetails.damage.damage_type.name}
                        />
                      )}
                    </div>
                    <div className="description-section">
                      <SpellCard
                        title="Description"
                        description={spellDetails.desc.join(" ")}
                      />
                    </div>
                  </>
                ) : (
                  <IonSpinner />
                )}
              </IonCardContent>
              {spellDetails && (
                <IonButton
                  onClick={() =>
                    addSpell({
                      index: spellDetails.index,
                      name: spellDetails.name,
                      level: spellDetails.level,
                      url: spellDetails.url,
                    })
                  }
                >
                  Add spell
                </IonButton>
              )}
              <IonAlert
                isOpen={alert}
                header="Spell Known"
                message={`You already have ${spellDetails?.name}`}
                buttons={[
                  {
                    text: "Ok",
                    role: "cancel",
                    handler: () => {
                      closeModal();
                      setAlert(false);
                    },
                  },
                ]}
              ></IonAlert>
            </IonCard>
          </IonContent>
        </IonModal>
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

export default Tab1Spells;
