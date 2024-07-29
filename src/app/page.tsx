"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { data } from "@/data/data";
import { educationLevelData } from "@/data/education-level";
import { Barplot } from "@/dataviz/barplot/Barplot";
import { Lollipop } from "@/dataviz/barplot/Lollipop";
import { EducationLevel, Island, allIslandNames } from "@/lib/types";
import { educationLevelItems } from "@/lib/utils";

export default function Home() {
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>("Primary education");

  const [selectedIsland, setSelectedIsland] = useState<Island>("Vanuatu");

  return (
    <main className="container mx-auto px-4 py-6 " style={{ maxWidth: 600 }}>
      <div>
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

        <div className="flex gap-1 mt-4">
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

        <Lollipop
          width={500}
          height={400}
          data={educationLevelData.filter((d) => d.island === selectedIsland)}
        />

        <p>
          The king's subjects were not amused. They grumbled and complained, but
          the king was firm:
        </p>
        <ul>
          <li>1st level of puns: 5 gold coins</li>
          <li>2nd level of jokes: 10 gold coins</li>
          <li>3rd level of one-liners : 20 gold coins</li>
        </ul>
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
