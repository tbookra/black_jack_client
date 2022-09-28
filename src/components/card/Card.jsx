import "./card.css";
import { getColor, getImage, getNumber } from "../../utils/utilsFuntions";

export default function Card({ symbol, number }) {
  const IMG = getImage(symbol);
  const NUMBER = getNumber(number);
  const COLOR = getColor(symbol);
  return (
    <main className="cardContainer">
      <div className="symbolsContainer symbolsLeft">
        <img src={IMG} alt="" className="symbolImg" />
        <span className="symbolNumber" style={{ color: COLOR }}>
          {NUMBER.numSymbol}
        </span>
      </div>
      <div className="symbolsContainer symbolsRight">
        <img src={IMG} alt="" className="symbolImg" />
        <span className="symbolNumber" style={{ color: COLOR }}>
          {NUMBER.numSymbol}
        </span>
      </div>
    </main>
  );
}
