import React, { useState } from "react";
import { question } from "./AccordianData";
import MyAccordian from "./myAccordian";
import "./Accordian.css";

const Accordian = () => {
  const [data, setData] = useState(question);
  return (
    <>
      <section className="main-div">
        <h1>FAQS </h1>
        {data.map((curElem) => {
          return <MyAccordian key={curElem.id} {...curElem} />;
        })}
      </section>
    </>
  );
};

export default Accordian;
