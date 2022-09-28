export const getImage = (sym) => {
  switch (sym) {
    case "hearts":
      return "/assets/card-symbols/hearts.png";
    case "spades":
      return "/assets/card-symbols/spades.png";
    case "diamonds":
      return "/assets/card-symbols/diamond.png";
    case "clubs":
      return "/assets/card-symbols/clubs.png";

    default:
      break;
  }
};
export const getNumber = (num) => {
  switch (num) {
    case "1":
      return { numSymbol: "A", value: 11 };
    case "11":
      return { numSymbol: "J", value: 10 };
    case "12":
      return { numSymbol: "Q", value: 10 };
    case "13":
      return { numSymbol: "K", value: 10 };

    default:
      return { numSymbol: `${num}`, value: parseInt(num) };
  }
};
export const getColor = (sym) => {
  if (sym === "hearts" || sym === "diamonds") {
    return "red";
  } else {
    return "black";
  }
};
export const hasWon = (num) => {
  if (num > 21) return "lost";
  if (num === 21) return "win";
  return "no";
};
export const hasDealerWon = (num) => {
  if (num > 21) return "lost";
  if (num === 21) return "win";
  if (num > 16) return "stop";
  return "no";
};
