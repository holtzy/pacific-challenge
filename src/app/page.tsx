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
    "Kiribati"
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
            <div className="absolute w-full h-4/6 top-0 left-0 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <BubbleMap
              data={geoData}
              width={600}
              height={600}
              selectedIsland={undefined}
              setSelectedIsland={setSelectedIsland}
              scale={300}
              bubbleSize={16}
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
        <div ref={minimapRef} />
        {/* ////////////////////// BARPLOT */}
        <h2>Women earn less on average</h2>
        <p>
          Wage differences between men and women are a notorious indicator of
          gender inequality.
        </p>
        <p>
          Our study provides access to the gross <b>earnings ratio</b> between
          women and men for six of the seven islands (data for Nauru is
          missing). This ratio indicates how much women earn compared to men: a
          value <b>above 1</b> means women earn more, while a value{" "}
          <b>below 1</b> means they earn less.
        </p>
        <p>
          The data is categorized by occupation type. In the graph below, each
          circle represents an occupation type, and the bar represents the
          overall data for <b>all occupations combined</b>.
        </p>
        <p>
          In the majority of the geographic zones (4 out of 6), the ratio is
          below 1, indicating that women <b>earn less</b> than men.
        </p>
        <Barplot
          width={600}
          height={500}
          data={genderPayGap.filter((item) => item.Urbanization === "National")}
        />
        <p className="caption">
          Fig 2: Gross earning ratio between women and men. Represented for all
          occupations (bars) and split by occupations (circles). Data: Gender
          pay gap in wages (
          <a href="https://stats.pacificdata.org/vis?tm=wage&pg=0&snb=5&df[ds]=ds%3ASPC2&df[id]=DF_GWG&df[ag]=SPC&df[vs]=1.0&pd=%2C&dq=A......&to[TIME_PERIOD]=false">
            link
          </a>
          )
        </p>
        <p>
          However, in Kiribati and the Marshall Islands, the ratio is above 1,
          suggesting that women earn more than men in these areas. This
          surprising result conflicts with some other studies on the topic,
          indicating a need for further exploration of the data.
        </p>
        <p>
          It's worth noting that certain work categories deviate from this
          pattern: in elementary occupations and craft and related trades, women
          consistently earn less than men.
        </p>
        {/* ////////////////////// LOLLIPOP */}
        <h2>Education: The Root Cause?</h2>
        <p>
          A potential explanation for gender inequality could be{" "}
          <b>educational attainment</b>. However, the data does not support this
          theory.
        </p>
        <p>
          Educational attainment varies across the islands. For example, in{" "}
          <a
            onClick={() => {
              setSelectedIsland("Vanuatu");
            }}
            className="cursor-pointer"
          >
            Vanuatu
          </a>
          , most people complete primary school, whereas in{" "}
          <a
            onClick={() => {
              setSelectedIsland("Nauru");
            }}
            className="cursor-pointer"
          >
            Nauru
          </a>
          , the majority reach upper secondary school.
        </p>
        <p>
          Overall, educational attainment is stable, with some notable
          exceptions. In{" "}
          <a
            onClick={() => {
              setSelectedIsland("Kiribati");
            }}
            className="cursor-pointer"
          >
            Kiribati
          </a>
          , for instance, most people aged 55-64 (right graph) only completed
          lower secondary school, while younger individuals (aged 25-54, left
          graph) reached upper secondary school.
        </p>
        <br />
        {islandSelectButtons}
      </div>

      <div className="w-full flex gap-2 justify-center">
        <Lollipop
          width={500}
          height={400}
          data={educationLevelData
            .filter((d) => d.island === selectedIsland)
            .filter((d) => d.age === "25-54")}
          title="Age Range: 25-54"
        />

        <Lollipop
          width={500}
          height={400}
          data={educationLevelData
            .filter((d) => d.island === selectedIsland)
            .filter((d) => d.age === "55-64")}
          title="Age Range: 55-64"
        />
      </div>

      <div
        className="container mx-auto px-4 py-6 "
        style={{ maxWidth: CONTAINER_WIDTH }}
      >
        <p className="caption">
          Fig 3.1 and 3.2: educational attainment in {selectedIsland}.
        </p>

        <h2>Conclusion</h2>
        <p>
          Despite advances in education, gender inequality remains pronounced in
          the Pacific Islands, with women earning less and holding fewer
          managerial positions than men.
        </p>
        <p>
          The wage gap persists across various occupations, and educational
          attainment alone does not account for these disparities.
        </p>
        <p>
          Addressing this issue requires a deeper examination of structural and
          cultural factors beyond education.
        </p>

        <h2>Material and Method</h2>
        <p>
          This project is built with{" "}
          <a href="https://www.react-graph-gallery.com">React</a> and{" "}
          <a href="https://www.d3-graph-gallery.com">D3.js</a>, with graphs
          inspired by the{" "}
          <a href="https://www.react-graph-gallery.com">React Graph Gallery</a>.
          Styling is handled using Tailwind CSS and{" "}
          <a href="https://ui.shadcn.com">ShadcnUI</a> components. The source
          code is available on{" "}
          <a href="https://github.com/holtzy/pacific-challenge">GitHub</a>.
        </p>
        <p>
          The data is sourced from the{" "}
          <a href="https://pacificdata.org"> Pacific Data Hub</a>, and the exact
          datasets are linked in the captions of each chart.
        </p>
        <p>
          This is a project made by{" "}
          <a href="https://www.yan-holtz.com">Yan Holtz</a> for the{" "}
          <a href="https://pacificdatavizchallenge.org/">
            Pacific Data Challenge
          </a>
          .
        </p>
        <div className="flex my-24 justify-center w-full">
          <img src="favicon.ico" width={100} />
        </div>
      </div>
    </main>
  );
}
