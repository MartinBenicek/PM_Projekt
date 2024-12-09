import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab3.css";
import sun from "../svg/sun.svg";
import moon from "../svg/moon.svg";
import useStorage from "../services/storage";
import { useEffect } from "react";

const Tab3: React.FC = () => {
  const { store } = useStorage();

  const toggleDarkMode = (enabled: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", enabled);
    store?.set("dark-mode", enabled);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="flex items-center h-full">
          <img
            className="w-1/2"
            src={moon}
            onClick={() => toggleDarkMode(true)}
            alt="Enable Dark Mode"
          />
          <img
            className="w-1/2"
            src={sun}
            onClick={() => toggleDarkMode(false)}
            alt="Disable Dark Mode"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
