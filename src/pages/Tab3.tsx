import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab3.css";
import useStorage from "../services/storage";
import AnimatedToggle from "../components/animatedToggle";
import { useEffect, useState } from "react";

const Tab3: React.FC = () => {
  const { store } = useStorage();
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = (enabled: boolean) => {
    setTimeout(() => {
      document.documentElement.classList.toggle("ion-palette-dark", enabled);
    }, 100);
    setDarkMode(enabled);
    store?.set("dark-mode", enabled);
  };

  const initializeDarkMode = async () => {
    const storedValue = await store?.get("dark-mode");
    if (storedValue !== null && typeof storedValue === "boolean") {
      setDarkMode(storedValue);
      document.documentElement.classList.toggle(
        "ion-palette-dark",
        storedValue
      );
    }
  };

  useEffect(() => {
    initializeDarkMode();
  }, [store]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="flex flex-col items-center h-full">
          <h2 className="text-xl mb-4">Toggle Dark Mode</h2>
          <AnimatedToggle
            checked={darkMode}
            onChange={toggleDarkMode}
          ></AnimatedToggle>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
