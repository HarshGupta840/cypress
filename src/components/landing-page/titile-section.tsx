import React from "react";
import styles from "./styles.module.css";

type Props = {
  title: string;
  subheading?: string;
  pill: string;
};

const TitleSection = ({ title, subheading, pill }: Props) => {
  return (
    <>
      <section className="flex flex-col justify-center md:items-center items-start gap-4">
        <article
          className="rounded-full  text-sm p-[1px]
          dark:bg-gradient-to-r
          dark:from-brand-primaryBlue
          dark:to-brand-primaryPurple"
        >
          <div
            className="rounded-full 
            px-3
            py-1
            dark:bg-black"
          >
            {pill}
          </div>
        </article>{" "}
        {subheading ? (
          <>
            <h2
              className="text-left
              text-3xl
              sm:text-5xl
              sm:max-w-[750px]
              md:text-center
              font-semibold
            "
            >
              {title}
            </h2>
            <p
              className="dark:text-washed-purple-700 sm:max-w-[450px]
              md:text-center
            "
            >
              {subheading}
            </p>
          </>
        ) : (
          <>
            <h1
              className=" text-left
            text-4xl
            sm:text-6xl
            sm:max-w-[850px]
            md:text-center
            font-semibold
          "
            >
              {title}
            </h1>
          </>
        )}
      </section>
    </>
  );
};

export default TitleSection;
