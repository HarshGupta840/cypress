import React from "react";
import styles from "./styles.module.css";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { cn } from "@/lib/utils";
type CardProps = React.ComponentProps<typeof Card>;
type Props = CardProps & {
  cardHeader?: React.ReactNode;
  cardContent?: React.ReactNode;
  cardFooter?: React.ReactNode;
};

const CustomCard = ({
  className,
  cardContent,
  cardHeader,
  cardFooter,
}: Props) => {
  return (
    <>
      <Card className={cn("w-[380px]", className)}>
        <CardHeader>{cardHeader}</CardHeader>
        <CardContent>{cardContent}</CardContent>
        <CardFooter>{cardFooter}</CardFooter>
      </Card>
    </>
  );
};

export default CustomCard;
