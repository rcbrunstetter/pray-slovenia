const OUTLINE =
  "M0.0 88.5 L6.9 78.6 L21.0 69.6 L33.0 66.6 L36.0 54.6 L55.5 54.6 L67.5 59.7 L78.0 60.6 L83.1 67.2 L109.5 65.7 L121.5 69.6 L125.1 76.5 L129.0 67.2 L139.5 63.6 L151.5 56.1 L156.0 41.7 L168.0 39.6 L175.5 34.2 L190.5 35.7 L214.5 34.2 L219.9 40.2 L226.5 38.1 L229.5 29.1 L241.5 26.1 L261.0 23.7 L271.5 27.6 L279.9 33.6 L274.5 20.1 L275.1 6.6 L286.5 2.1 L301.5 0.0 L312.0 3.6 L310.5 17.1 L319.5 29.1 L316.5 36.6 L330.0 50.1 L339.0 61.5 L325.5 57.6 L313.5 50.7 L301.5 57.6 L308.1 75.6 L294.0 74.1 L282.0 74.1 L283.5 81.6 L271.5 89.1 L253.5 93.6 L252.0 101.1 L238.5 100.5 L234.0 111.6 L238.5 120.6 L247.5 126.6 L244.5 140.1 L244.5 155.1 L237.0 159.6 L226.5 156.6 L208.5 165.6 L198.0 174.6 L202.5 182.1 L208.5 177.6 L213.0 186.6 L201.0 192.6 L203.1 204.6 L211.5 210.6 L199.5 215.1 L190.5 219.6 L180.0 210.6 L163.5 204.6 L160.5 212.1 L151.5 214.5 L147.0 206.1 L138.0 203.1 L129.0 191.1 L126.0 182.7 L118.5 192.6 L117.0 201.6 L100.5 212.7 L88.5 208.5 L78.0 212.1 L64.5 206.1 L63.0 215.1 L52.5 219.6 L42.0 214.5 L31.5 216.6 L21.0 210.6 L20.1 203.7 L36.0 201.6 L36.0 194.7 L49.5 195.6 L57.0 188.1 L48.0 179.1 L45.0 171.6 L31.5 164.1 L22.5 161.1 L21.0 153.6 L27.0 141.6 L27.0 135.6 L16.5 138.0 L10.5 131.1 L13.5 125.1 L28.5 113.1 L30.0 105.6 L19.5 102.6 L6.0 99.6 L3.0 101.1 Z";

// Lights fill in this order, so the first few spread across the country.
const TOWNS: [name: string, lon: number, lat: number][] = [
  ["Ljubljana", 14.51, 46.05],
  ["Maribor", 15.65, 46.55],
  ["Koper", 13.73, 45.55],
  ["Celje", 15.26, 46.23],
  ["Kranj", 14.36, 46.24],
  ["Novo Mesto", 15.17, 45.8],
  ["Murska Sobota", 16.16, 46.66],
  ["Nova Gorica", 13.65, 45.96],
  ["Velenje", 15.11, 46.36],
  ["Ptuj", 15.87, 46.42],
  ["Jesenice", 14.06, 46.43],
  ["Postojna", 14.21, 45.78],
  ["Kočevje", 14.85, 45.64],
  ["Slovenj Gradec", 15.08, 46.51],
  ["Krško", 15.49, 45.96],
  ["Tolmin", 13.73, 46.18],
  ["Idrija", 14.03, 46.0],
  ["Bled", 14.11, 46.37],
  ["Trbovlje", 15.05, 46.15],
  ["Črnomelj", 15.19, 45.57],
  ["Ormož", 16.15, 46.41],
  ["Lendava", 16.45, 46.56],
  ["Ajdovščina", 13.91, 45.89],
  ["Škofja Loka", 14.31, 46.17],
  ["Domžale", 14.59, 46.14],
  ["Kamnik", 14.61, 46.22],
  ["Ravne na Koroškem", 14.97, 46.54],
  ["Brežice", 15.59, 45.9],
  ["Rogaška Slatina", 15.64, 46.24],
  ["Sežana", 13.87, 45.71],
];

const left = (lon: number) => `${(((lon - 13.38) * 105 + 1) / 341) * 100}%`;
const top = (lat: number) => `${(((46.876 - lat) * 150.8 + 1) / 222) * 100}%`;

export default function SloveniaLights({ count, newLight }: { count: number; newLight: boolean }) {
  const lit = Math.min(count, TOWNS.length);
  const newest = newLight ? (count - 1) % TOWNS.length : -1;

  return (
    <div
      role="img"
      aria-label={`Map of Slovenia with ${count} ${count === 1 ? "light" : "lights"}`}
      className="relative mx-auto aspect-[341/222] w-full max-w-[339px]"
    >
      <svg
        viewBox="-1 -1 341 222"
        fill="none"
        stroke="#F3EEE3"
        strokeOpacity="0.42"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden="true"
        className="block size-full"
      >
        <path fill="#F3EEE3" fillOpacity="0.035" d={OUTLINE} />
      </svg>
      {TOWNS.slice(0, lit).map(([name, lon, lat], i) => (
        <span
          key={name}
          className={i === newest ? "light light-new" : "light"}
          style={{
            left: left(lon),
            top: top(lat),
            animationDuration: i === newest ? undefined : `${3.7 + (i % 5) * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
