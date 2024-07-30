"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { data } from "@/data/data";
import { educationLevelData } from "@/data/education-level";
import { Barplot } from "@/dataviz/barplot/Barplot";
import { Lollipop } from "@/dataviz/lollipop/Lollipop";
import { EducationLevel, Island, allIslandNames } from "@/lib/types";
import { educationLevelItems, islandColorScale } from "@/lib/utils";
import { BubbleMap } from "@/dataviz/bubbleMap/BubbleMap";
import { geoData } from "@/data/pacific";
import { genderPayGap } from "@/data/gender-pay-gap";
import { LineChart } from "@/dataviz/lineChart/LineChart";
import { employmentRates } from "@/data/employment_yh";

const CONTAINER_WIDTH = 600;

export default function Home() {
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>("Primary education");

  const [isMinimapEnabled, setIsMinimapEnabled] = useState(false);

  const [selectedIsland, setSelectedIsland] = useState<Island>("Vanuatu");

  const minimapRef = useRef(null);

  const islandSelectButtons = (
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
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMinimapEnabled(true);
          }
        });
      },
      {
        threshold: 0.8,
      }
    );

    if (minimapRef.current) {
      observer.observe(minimapRef.current);
    }
    return () => {
      if (minimapRef.current) {
        observer.unobserve(minimapRef.current);
      }
    };
  }, []);

  return (
    <main>
      <div
        className="container mx-auto px-4 py-6 "
        style={{ maxWidth: CONTAINER_WIDTH }}
      >
        {isMinimapEnabled && (
          <div className="fixed top-2 right-2 border border-gray-200 rounded-md h-44 w-44 overflow-hidden">
            <BubbleMap
              data={geoData}
              width={176}
              height={176}
              selectedIsland={selectedIsland}
              setSelectedIsland={setSelectedIsland}
              scale={100}
            />
          </div>
        )}

        <div className="relative w-full mt-20" style={{ height: 700 }}>
          <div className="absolute top-36">
            <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <BubbleMap
              data={geoData}
              width={600}
              height={600}
              selectedIsland={undefined}
              setSelectedIsland={setSelectedIsland}
              scale={300}
            />
          </div>
          <div className="absolute top-0 right-0">
            <span className="uppercase font-thin text-2xl text-gray-800">
              A look at gender inequality
            </span>
            <h1 className="text-7xl mt-2">Women in the Pacific</h1>
            <p>
              We crunched the data so that you don't have to. Here is what we
              found about gender inequality in 7 islands of the Pacific. Lorem
              ipsum some more text should go here my friend.
            </p>
          </div>
          <div className="absolute bottom-0 w-full flex justify-center">
            <div className="text-center">
              <p className="italic text-sm">
                A project by Yan <a href="https://www.yan-holtz.com">Holtz</a>{" "}
                and Joseph <a href="">Barbier</a>
              </p>
              <span className="italic text-sm text-gray-400">July 2024</span>
            </div>
          </div>
        </div>

        <div className="h-10" />

        <h2>Women DO study</h2>

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

        {islandSelectButtons}
      </div>

      <div ref={minimapRef} />

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

        <h2>But they are poorer</h2>
        <p>Women globally earn less than men.</p>
        <p>
          The gross earnings ratio between women and men is available for 6 out
          of the 7 islands of our study. In four of them, the ratio was below 1,
          meaning that women earn less than men.
        </p>
        <p>Interstingly, </p>
        <Barplot
          width={600}
          height={500}
          data={
            genderPayGap.filter((item) => item.Urbanization === "National")
            // .filter((item) => item.Occupation === "All occupations")
          }
        />

        <h2>And work less</h2>
        <p>Evolution of unemployment rate</p>
        {islandSelectButtons}
        <LineChart
          width={600}
          height={500}
          data={employmentRates
            .filter((d) => d.island === selectedIsland)
            .filter((d) => d.Sex !== "Total")}
        />
      </div>
    </main>
  );
}
