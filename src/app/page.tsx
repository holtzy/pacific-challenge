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
import { employmentRates } from "@/data/employment-rates";

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

        <div className="relative w-full mt-44" style={{ height: 600 }}>
          <BubbleMap
            data={geoData}
            width={600}
            height={600}
            selectedIsland={undefined}
            setSelectedIsland={setSelectedIsland}
            scale={300}
          />
          <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0">
            <span className="uppercase font-thin text-2xl text-gray-800">
              A look at gender inequality
            </span>

            <h1 className="text-7xl">Women in the Pacific</h1>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <p className="italic text-sm">
            A project by Yan <a href="https://www.yan-holtz.com">Holtz</a> and
            Joseph <a href="">Barbier</a>
          </p>
        </div>

        <div className="h-10" />
        <p>Here we explain in a few words the result of our investigation</p>

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
        <p>
          Weird. The dataset has very contrasted result on pay gap. Good news
          but kills the story. Ask Joseph: one column is missing.
        </p>
        <Barplot
          width={600}
          height={500}
          data={
            genderPayGap.filter((item) => item.Urbanization === "National")
            // .filter((item) => item.Occupation === "All occupations")
          }
        />
        <div ref={minimapRef} />

        <h2>And work less</h2>
        <p>Evolution of unemployment rate</p>
        {islandSelectButtons}
        <LineChart
          width={600}
          height={500}
          data={employmentRates
            .filter((d) => d.age === "25-54")
            .filter((d) => d.island === selectedIsland)}
        />
      </div>
    </main>
  );
}
