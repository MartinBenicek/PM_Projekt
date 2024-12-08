import { IonItem, IonLabel } from "@ionic/react";

const CharacterClass = ({
  name,
  onClick,
  selected,
  error,
}: {
  name: string;
  onClick: () => void;
  selected: boolean;
  error: boolean;
}) => {
  return (
    <IonItem
      button
      className={`text-center ${
        error
          ? "text-red-500 scale-125 transform-transform ease-in-out duration-200"
          : "scale-100 transform-transform ease-in-out duration-200"
      } ${selected ? "text-emerald-500" : ""}`}
      onClick={onClick}
    >
      <IonLabel>{name}</IonLabel>
    </IonItem>
  );
};

export default CharacterClass;
