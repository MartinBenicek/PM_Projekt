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
} from "@ionic/react";
import "./Tab1.css";
import { Spell, SpellDetail, School } from "../services/spellsApi";
import { useEffect, useState } from "react";
import axios from "axios";
import SpellCard from "../components/spellCard";

const API_URL = "https://www.dnd5eapi.co/api/spells";

const Tab1: React.FC = () => {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spellDetails, setSpellDetails] = useState<SpellDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const response = await axios.get(API_URL);
        setSpells(response.data.results);
        setFilteredSpells(
          response.data.results.filter((spell: Spell) => spell.level === 0)
        );
      } catch (error) {
        console.error("Chyba při načítání kouzel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  // Funkce pro změnu levelu
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>D&D Kouzla</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButtons>
          {[...Array(10)].map((_, level) => (
            <IonButton key={level} onClick={() => changeLevel(level)}>
              Level {level}
            </IonButton>
          ))}
        </IonButtons>

        {loading ? (
          <p>Načítám kouzla...</p>
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

        <IonModal isOpen={modalOpen}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                {spellDetails ? spellDetails.name : "Loading..."}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent key={spellDetails?.index}>
              {spellDetails ? (
                <>
                  <SpellCard
                    title="Level"
                    description={spellDetails.level}
                  ></SpellCard>
                  <SpellCard
                    title="Casting Time"
                    description={spellDetails.casting_time}
                  ></SpellCard>
                  <SpellCard
                    title="Range"
                    description={spellDetails.range}
                  ></SpellCard>
                  <SpellCard
                    title="Duration"
                    description={spellDetails.duration}
                  ></SpellCard>
                  <p>
                    <strong>Components:</strong>{" "}
                    {spellDetails.components.join(", ")}
                    {spellDetails.components.includes("M")
                      ? ` (${spellDetails.material})`
                      : null}
                  </p>
                  <SpellCard
                    title="School"
                    description={spellDetails.school.name}
                  ></SpellCard>

                  <SpellCard
                    title="Description"
                    description={spellDetails.desc.join(" ")}
                  ></SpellCard>
                </>
              ) : (
                <IonSpinner />
              )}
              <IonButton expand="block" onClick={closeModal}>
                Close
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
