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
  IonButtons,
  IonItem,
  IonInput,
} from "@ionic/react";
import { add } from "ionicons/icons";
import "./Tab1.css";
import { useState } from "react";

const Tab1: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const createCharacter = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Characters</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab horizontal="end" vertical="bottom" onClick={createCharacter}>
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
              <IonItem className="char">
                <IonInput
                  label="Character name"
                  labelPlacement="stacked"
                  type="text"
                  fill="outline"
                  placeholder="Name"
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="Enter your name"
                  labelPlacement="stacked"
                  type="text"
                  fill="outline"
                  placeholder="Your name"
                />
              </IonItem>
            </div>
            <div id="button-holder">
              <IonButton strong={true} onClick={closeModal}>
                Cancel
              </IonButton>
              <IonButton strong={true}>Confirm</IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
