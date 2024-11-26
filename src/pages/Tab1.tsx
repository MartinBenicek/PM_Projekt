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
} from "@ionic/react";
import "./Tab1.css";
import { Spell } from "../services/spellsApi";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://www.dnd5eapi.co/api/spells";

const Tab1: React.FC = () => {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch všech dat na začátku
  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const response = await axios.get(API_URL);
        setSpells(response.data.results);
        setFilteredSpells(
          response.data.results.filter((spell: Spell) => spell.level === 0)
        ); // Defaultně Cantrips
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
    setSelectedLevel(level);
    setFilteredSpells(spells.filter((spell: Spell) => spell.level === level));
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
              <IonItem key={spell.index}>{spell.name}</IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
