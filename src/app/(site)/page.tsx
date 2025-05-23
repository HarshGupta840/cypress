"use client";
import React from "react";
import styles from "./styles.module.css";
import TitleSection from "@/components/landing-page/titile-section";
import { Button } from "@/components/ui/button";
import Banner from "../../../public/appBanner.png";
import Cal from "../../../public/cal.png";
import Image from "next/image";
import { CLIENTS, USERS, PRICING_CARDS, PRICING_PLANS } from "@/lib/constant";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import CustomCard from "@/components/landing-page/card-component";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";
type Props = {};

const Homepage = ({}: Props) => {
  const rouer = useRouter();
  const getFree = () => {
    console.log("cliecked on pafe");
    rouer.push("/login");
    return;
  };
  return (
    <>
      <section
        className=" overflow-hidden
      px-4
      sm:px-6
      mt-10
      sm:flex
      sm:flex-col
      gap-4
      md:justify-center
      md:items-center"
      >
        <TitleSection
          pill="✨ Your Workspace, Perfected"
          title="All-In-One Collaboration and Productivity Platform"
        />

        <div
          className=" bg-gradient-to-r p-[2px]
          mt-6
          rounded-xl
          from-primary
          to-brand-primaryBlue sm:w-[300px] z-[1000]"
        >
          <Link href={"/login"} className="cursor-pointer z-[1000]">
            <Button
              variant={"secondary"}
              className="w-full rounded-[10px]
            p-6
            text-2xl
            bg-background
            cursor-pointer"
            >
              Get TypeSync Frees
            </Button>
          </Link>
        </div>

        <div className="md:mt-[-90px] relative sm:ml-0 flex justify-center items-center w-full sm-w-[750px]">
          <Image alt="banner image " src={Banner} />
          <div
            className=" bottom-0 top-[50%]
            bg-gradient-to-t
            dark:from-background
            left-0
            right-0
            absolute
            z-10"
          ></div>
        </div>
      </section>

      <section className="relative">
        <div
          className="overflow-hidden flex
          after:content['']
          after:dark:from-brand-dark
          after:to-transparent
          after:from-background
          after:bg-gradient-to-l
          after:right-0
          after:bottom-0
          after:top-0
          after:w-20
          after:z-10
          after:absolute

          before:content['']
          before:dark:from-brand-dark
          before:to-transparent
          before:from-background
          before:bg-gradient-to-r
          before:left-0
          before:top-0
          before:bottom-0
          before:w-20
          before:z-10
          before:absolute
          "
        >
          <div className="flex flex-nowrap animate-slide">
            {CLIENTS.map((client, index) => {
              return (
                <div
                  key={index}
                  className="relative w-[200px] flex items-center m-20 shrink-0"
                >
                  <Image
                    alt={client.alt}
                    src={client.logo}
                    className="object-contain max-w-none"
                    width={200}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex flex-nowrap animate-slide">
            {CLIENTS.map((client, index) => {
              return (
                <div
                  key={index}
                  className="relative w-[200px] flex items-center m-20 shrink-0"
                >
                  <Image
                    alt={client.alt}
                    src={client.logo}
                    className="object-contain max-w-none"
                    width={200}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="sm:px-6
        flex
        justify-center
        items-center
        flex-col
        relative"
      >
        <div
          className="mt-10 w-[30%]
          blur-[120px]
          rounded-full
          h-32
         absolute
          bg-brand-primaryPurple/50
          -z-10
          top-22"
        />
        <TitleSection
          title="Keep track of your meetings all in one place"
          subheading="Capture your ideas, thoughts, and meeting notes in a structured and organized manner."
          pill="Features"
        />

        <div
          className="mt-10
          max-w-[500px]
          flex
          justify-center
          items-center
          relative
          sm:ml-0
          rounded-2xl
          border-8
          border-washed-purple-300 
          border-opacity-10
        "
        >
          <Image src={Cal} alt="Banner" className="rounded-2xl" />
        </div>
      </section>

      <section id="testimonial" className="relative">
        <div
          className="w-full
          blur-[120px]
          rounded-full
          h-32
          absolute
          bg-brand-primaryPurple/50
          -z-100
          top-56
        "
        />
        <div className="mt-20 flex flex-col overflow-x-hidden">
          <TitleSection
            title="Trusted by all"
            subheading="Join thousands of satisfied users who rely on our platform for their 
            personal and professional productivity needs."
            pill="Testimonials"
          />

          {[...Array(2)].map((arr, index) => (
            <div
              key={index}
              className={twMerge(
                clsx("mt-10 flex flex-nowrap gap-6 self-start", {
                  "flex-row-reverse": index === 1,
                  "animate-[slide_150s_linear_infinite]": true,
                  "animate-[slide_150s_linear_infinite_reverse]": index === 1,
                }),
                "hover:paused"
              )}
            >
              {USERS.map((testimonial, index) => (
                <CustomCard
                  key={index}
                  className="w-[500px] rounded-xl shrink-0"
                  cardHeader={
                    <div
                      className="flex
                    items-center
                    gap-4
                "
                    >
                      <Avatar>
                        <AvatarImage src={`/avatars/${index + 1}.png`} />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-foreground">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="dark:text-washed-purple-800">
                          {testimonial.name.toLocaleLowerCase()}
                        </CardDescription>
                      </div>
                    </div>
                  }
                  cardContent={
                    <p className="dark:text-washed-purple-800">
                      {testimonial.message}
                    </p>
                  }
                ></CustomCard>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="plan" className="mt-10 px-4 md:px6">
        <TitleSection
          title="The Perfect Plan For You"
          subheading="Experience all the benefits of our platform. Select a plan that suits your needs and take your productivity to new heights."
          pill="Pricing"
        />

        <div className="flex flex-col-reverse mt-10 sm:flex-row gap-8 justify-center items-stretch">
          {PRICING_CARDS.map((cards, index) => (
            <CustomCard
              key={index}
              className={clsx(
                "w-[300px] rounded-2xl dark:bg-black/40 background-blur-3xl relative",
                {
                  "border-brand-primaryPurple/70":
                    cards.planType === PRICING_PLANS.proplan,
                }
              )}
              cardHeader={
                <CardTitle
                  className="text-2xl
                  font-semibold
              "
                >
                  {cards.planType === PRICING_PLANS.proplan && (
                    <>
                      <div
                        className="hidden dark:block w-full blur-[120px] rounded-full h-32
                        absolute
                        bg-brand-primaryPurple/80
                        -z-10
                        top-0
                      "
                      />
                      {/* <Image
                        // src={Diamond}
                        width={200}
                        height={100}
                        src={"public/client.png"}
                        alt="Pro Plan Icon"
                        className="absolute top-6 right-6"
                      /> */}
                    </>
                  )}
                  {cards.planType}
                </CardTitle>
              }
              cardContent={
                <CardContent className="p-0">
                  <span
                    className="font-normal 
                    text-2xl
                "
                  >
                    ${cards.price}
                  </span>
                  {+cards.price > 0 ? (
                    <span className="dark:text-washed-purple-800 ml-1">
                      /mo
                    </span>
                  ) : (
                    ""
                  )}
                  <p className="dark:text-washed-purple-800">
                    {cards.description}
                  </p>
                  <Link href={"/signup"}>
                    <Button
                      variant="outline"
                      className="whitespace-nowrap w-full mt-4"
                    >
                      {cards.planType === PRICING_PLANS.proplan
                        ? "Go Pro"
                        : "Get Started"}
                    </Button>
                  </Link>
                </CardContent>
              }
              cardFooter={
                <ul
                  className="font-normal
                  flex
                  mb-2
                  flex-col
                  gap-4
                "
                >
                  <small>{cards.highlightFeature}</small>
                  {cards.freatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex
                      items-center
                      gap-2
                    "
                    >
                      {/* <Image
                        src={CheckIcon}
                        alt="Check Icon"
                      /> */}
                      {feature}
                    </li>
                  ))}
                </ul>
              }
            ></CustomCard>
          ))}
        </div>
      </section>
    </>
  );
};

export default Homepage;
