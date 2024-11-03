import "./Unit.sass";
import { UnitModel } from "@/model/UnitModel";
import { UnitType } from "@/constants/Constants";

type UnitProps = {
  model: UnitModel | null;
  onClick: (unitType: UnitType) => void | null;
  isActive: boolean;
}

const Unit = ({ model, onClick, isActive }: UnitProps) => {
  const handleClick = () => {
    if (!onClick || !model) {
      return;
    }
    onClick(model.type);
  };

  if (model == null) {
    return <div></div>;
  }
  return (
    <div className={isActive ? "Unit active" : "Unit"}
         onClick={handleClick}>
      <img alt={model.getName()}
           src={model.getImage()}
      />
    </div>
  );
};

export default Unit;
