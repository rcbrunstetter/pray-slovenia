"use client";

import { useState } from "react";
import SloveniaOutline from "@/components/SloveniaOutline";

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

export default function SloveniaLights({ count }: { count: number }) {
  // Anything past the first count arrived while the page was open, so it lights up.
  const [firstCount] = useState(count);

  return (
    <div
      role="img"
      aria-label={`Map of Slovenia with ${count} ${count === 1 ? "light" : "lights"}`}
      className="relative mx-auto aspect-[341/222] w-full max-w-[339px]"
    >
      <SloveniaOutline className="block size-full" />
      {TOWNS.slice(0, count).map(([name, lon, lat], i) => (
        <span
          key={name}
          className={i >= firstCount ? "light light-new" : "light"}
          style={{
            left: left(lon),
            top: top(lat),
            animationDuration: i >= firstCount ? undefined : `${3.7 + (i % 5) * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
