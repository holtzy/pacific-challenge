"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { educationLevelData } from "@/data/education-level";
import { Barplot } from "@/dataviz/barplot/Barplot";
import { Lollipop } from "@/dataviz/lollipop/Lollipop";
import { Island, allIslandNames } from "@/lib/types";
import { BubbleMap } from "@/dataviz/bubbleMap/BubbleMap";
import { geoData } from "@/data/pacific";
import { genderPayGap } from "@/data/gender-pay-gap";
import { LineChart } from "@/dataviz/lineChart/LineChart";
import { employmentRates } from "@/data/employment_yh";

const CONTAINER_WIDTH = 600;

export default function Home() {
  const [isMinimapEnabled, setIsMinimapEnabled] = useState(false);

  const [selectedIsland, setSelectedIsland] = useState<Island | undefined>(
    undefined
  );

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
      {isMinimapEnabled && (
        <div className="fixed top-2 right-2 border border-gray-200 rounded-md h-44 w-44 overflow-hidden">
          <BubbleMap
            data={geoData}
            width={176}
            height={176}
            selectedIsland={selectedIsland}
            setSelectedIsland={setSelectedIsland}
            scale={100}
            bubbleSize={7}
          />
        </div>
      )}

      {/* ////////////////////// TITLE SECTION */}
      <div
        className="container mx-auto px-4 py-6 "
        style={{ maxWidth: CONTAINER_WIDTH }}
      >
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
              bubbleSize={20}
            />
          </div>
          <div className="absolute top-0 right-0">
            <span className="uppercase font-thin text-2xl text-gray-800">
              A look at gender inequality
            </span>
            <h1 className="text-7xl mt-2">Women in the Pacific</h1>
            <p>
              Gender inequality persists in the Pacific islands, where women{" "}
              <b>work</b> less, <b>earn</b> slightly less, and have fewer{" "}
              <b>managerial</b> roles than men. This essay explores these
              disparities, despite women's strong access to <b>education</b>.
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
      </div>

      <div className="h-10" />

      {/* ////////////////////// LINE CHART SECTION */}
      <div
        className="container mx-auto px-4 py-6 "
        style={{ maxWidth: CONTAINER_WIDTH }}
      >
        <h2>Women are consistently less employed </h2>
        <p>
          The number of employed women is <b>consistently lower</b> than that of
          men across all geographic zones and recorded years in our dataset.
        </p>
        <p>
          This disparity is significant, with most zones — except{" "}
          <a
            onClick={() => {
              setSelectedIsland("Vanuatu");
            }}
            className="cursor-pointer"
          >
            Vanuatu
          </a>{" "}
          and{" "}
          <a
            onClick={() => {
              setSelectedIsland("Tonga");
            }}
            className="cursor-pointer"
          >
            Tonga
          </a>{" "}
          — showing over 50% more employed men than women.
        </p>
        <p>
          In the{" "}
          <a
            onClick={() => {
              setSelectedIsland("Marshall Islands");
            }}
            className="cursor-pointer"
          >
            Marshall Islands
          </a>{" "}
          , the gap is even more pronounced, with twice as many men employed
          compared to women.
        </p>
        <br />
        {islandSelectButtons}
        <LineChart
          width={600}
          height={400}
          data={employmentRates
            .filter((d) => d.island === selectedIsland)
            .filter((d) => d.Sex !== "Total")}
        />{" "}
        <p className="caption">
          Fig 1: Number of employed men and women in {selectedIsland}. Data:
          Employed population by economic sector (
          <a href="https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_EMPLOYED_SECTOR&df[ag]=SPC&df[vs]=1.0&av=true&pd=%2C&dq=A...._T._T._T._T&ly[cl]=SEX&to[TIME_PERIOD]=false&vw=tb">
            link
          </a>
          )
        </p>
        <br />
        <p>
          Having established that women are generally less likely to be
          employed, let's now examine if there are wage disparities compared to
          men.
        </p>
        {/* ////////////////////// BARPLOT */}
        <h2>But they are poorer</h2>
        <p>
          Wage differences between men and women are a notorious indicator of
          gender inequality.
        </p>
        <p>
          Our study provides access to the gross earnings ratio between women
          and men for six of the seven islands (data for Nauru is missing). This
          ratio indicates how much women earn compared to men: a value above 1
          means women earn more, while a value below 1 means they earn less.
        </p>
        <p>
          The data is categorized by occupation type. In the graph below, each
          circle represents an occupation type, and the bar represents the
          overall data for all occupations combined.
        </p>
        <p>
          In the majority of the geographic zones (4 out of 6), the ratio is
          below 1, indicating that women earn less than men.
        </p>
        <Barplot
          width={600}
          height={500}
          data={
            genderPayGap.filter((item) => item.Urbanization === "National")
            // .filter((item) => item.Occupation === "All occupations")
          }
        />
        <p>
          However, in Kiribati and the Marshall Islands, the ratio is above 1,
          suggesting that women earn more than men in these areas. This
          surprising result conflicts with some other studies on the topic,
          indicating a need for further exploration of the data.
        </p>
        {/* ////////////////////// LOLLIPOP */}
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
      </div>
    </main>
  );
}
