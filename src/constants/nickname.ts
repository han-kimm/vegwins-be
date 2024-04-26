const nicknameMaker = (sub: string) => {
  const index: { [key: string]: string[] } = {
    where: ["지구", "도시", "정원", "사물함", "설산", "오지", "사무실", "오솔길", "파도", "주차장"],
    when: ["단단한", "기꺼운", "필연적", "운명적", "요동친", "안도한", "올곧은", "알맞은", "보람찬", "비밀"],
    who: ["전사", "새싹", "사랑", "연습생", "기후위기", "중고거래", "줍깅", "대중교통", "비건", "에코"],
  };

  let name: string = "";

  for (const key of Object.keys(index)) {
    const arr = index[key];
    const spacing = key === "where" ? "의 " : key === "when" ? " " : "";
    name += arr[Math.floor(Math.random() * arr.length)] + spacing;
  }

  return name + sub.slice(-2);
};
export default nicknameMaker;
