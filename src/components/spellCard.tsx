import { School, Class } from "../services/spellsApi";

const SpellCard = ({
  title,
  description,
}: {
  title: string;
  description: string | number | string[] | boolean;
}) => {
  return (
    <p>
      <strong>{title}:</strong> {description}
    </p>
  );
};

export default SpellCard;
