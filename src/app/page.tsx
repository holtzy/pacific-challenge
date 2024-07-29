"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { data } from "@/data/data";
import { educationLevelData } from "@/data/education-level";
import { Barplot } from "@/dataviz/barplot/Barplot";
import { Lollipop } from "@/dataviz/lollipop/Lollipop";
import { EducationLevel, Island, allIslandNames } from "@/lib/types";
import { educationLevelItems } from "@/lib/utils";
import { BubbleMap } from "@/dataviz/bubbleMap/BubbleMap";
import { geoData } from "@/data/pacific";

const CONTAINER_WIDTH = 600;

export default function Home() {
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>("Primary education");

  const [selectedIsland, setSelectedIsland] = useState<Island>("Vanuatu");

  return (
    <main>
      <div
        className="container mx-auto px-4 py-6 "
        style={{ maxWidth: CONTAINER_WIDTH }}
      >
        <h1>Women in the Pacific</h1>

        <p>Here we explain in a few words the result of our investigation</p>

        <h2>The King's Plan</h2>
        <p>
          The king thought long and hard, and finally came up with{" "}
          <a
            href="#"
            className="font-medium text-primary underline underline-offset-4"
          >
            a brilliant plan
          </a>
          : he would tax the jokes in the kingdom.
        </p>
        <blockquote>
          "After all," he said, "everyone enjoys a good joke, so it's only fair
          that they should pay for the privilege."
        </blockquote>
        <br />
        <h3>Women DO study</h3>

        <p>
          Educational attainment varies from 1 island to the other. For
          instance, most of the people reach the primary school in Vanuatu, when
          most of the people go until upper secondary school in Nauru.
        </p>

        <p>
          Educational attainment is globally stable with a few notable
          exceptions. For instance, in Kiribati, most people aged 55-54 went to
          lower 2nd when youger people (aged 25-54) reached the upper 2nd.
        </p>

        <div className="flex gap-1 mt-4 ">
          {allIslandNames.map((item) => {
            return (
              <Button
                key={item}
                size={"sm"}
                variant={item === selectedIsland ? "default" : "outline"}
                onClick={() => setSelectedIsland(item)}
              >
                {item}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="w-full flex gap-2 justify-center">
        <Lollipop
          width={500}
          height={400}
          data={educationLevelData
            .filter((d) => d.island === selectedIsland)
            .filter((d) => d.age === "25-54")}
        />

        <Lollipop
          width={500}
          height={400}
          data={educationLevelData
            .filter((d) => d.island === selectedIsland)
            .filter((d) => d.age === "55-64")}
        />
      </div>

      <div
        className="container mx-auto px-4 py-6 "
        style={{ maxWidth: CONTAINER_WIDTH }}
      >
        <p className="caption">
          Fig 1.1 and 1.2: educational attainment in {selectedIsland}.
        </p>

        <p>
          The king's subjects were not amused. They grumbled and complained, but
          the king was firm:
        </p>
        <ul>
          <li>1st level of puns: 5 gold coins</li>
          <li>2nd level of jokes: 10 gold coins</li>
          <li>3rd level of one-liners : 20 gold coins</li>
        </ul>

        <BubbleMap
          data={geoData}
          width={400}
          height={250}
          selectedIsland={selectedIsland}
          setSelectedIsland={setSelectedIsland}
        />

        <p>
          As a result, people stopped telling jokes, and the kingdom fell into a
          gloom. But there was one person who refused to let the king's
          foolishness get him down: a court jester named Jokester.
        </p>
        <Button className="mt-6">This is a button</Button>

        <h3>The People's Rebellion</h3>
        <p>
          The people of the kingdom, feeling uplifted by the laughter, started
          to tell jokes and puns again, and soon the entire kingdom was in on
          the joke.
        </p>

        <p>And here is a plot</p>
        <Barplot width={500} height={400} data={data} />
      </div>
    </main>
  );
}
