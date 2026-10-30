import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { Eyebrow, SectionTitle } from "@/components/ui";
import bates from "./photos/bates.jpg";
import bell from "./photos/bell.jpg";
import brunstetter from "./photos/brunstetter.jpg";
import josh from "./photos/josh.jpg";
import manley from "./photos/manley.jpg";

export const metadata: Metadata = { title: "Our Team" };

const team = [
  { name: "The Manley Family", roles: ["Team Leaders", "Church Planters"], photo: manley, focus: "50% 60%" },
  { name: "The Bell Family", roles: ["Church Planters"], photo: bell, focus: "50% 22%" },
  { name: "The Brunstetter Family", roles: ["Church Planters", "Student Strategists"], photo: brunstetter, focus: "50% 40%" },
  { name: "The Bates Family", roles: ["Church Planters"], photo: bates, focus: "50% 50%" },
  { name: "Josh Johnston", roles: ["Church Planter"], photo: josh, focus: "50% 12%" },
];

export default function TeamPage() {
  return (
    <PageShell title="Our Team">
      <section className="flex flex-col gap-3">
        <Eyebrow>Our Mission</Eyebrow>
        <p className="text-[22px] leading-[1.5] text-pretty text-prayer">
          Pray Slovenia exists to mobilize believers around the world to intercede for the nation of Slovenia — one of
          the least evangelized countries in Europe. Through daily prayer, we believe God is moving in the hearts of the
          Slovenian people, and that a great awakening is coming to this beautiful alpine nation.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Meet the Team</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {team.map(({ name, roles, photo, focus }) => (
            <article key={name} className="overflow-hidden rounded-[14px] border border-card-line bg-card">
              <Image
                src={photo}
                alt={name}
                placeholder="blur"
                sizes="(min-width: 640px) 310px, calc(100vw - 48px)"
                className="aspect-[4/3] w-full object-cover"
                style={{ objectPosition: focus }}
              />
              <div className="flex flex-col gap-1 p-[18px]">
                <h3 className="text-[22px] leading-[1.22] font-medium dark:font-normal">{name}</h3>
                <p className="font-sans text-[13px] font-medium text-meta">{roles.join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
