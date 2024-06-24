import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package2 } from "lucide-react";
import {TrendingUp, Plus, ReportMoney, Users, Checkbox} from "tabler-icons-react"
import { OverviewType } from "@/types";

const Overview: React.FC = () => {
  const [overViews] = useState<OverviewType[]>([
    {
      title: "Total Run",
      value: 229,
      icon: <TrendingUp />,
    },
    {
      title: "Total Queued",
      value: 40,
      icon: <TrendingUp />,
    },
    // {
    //   title: "Create",
    //   value: "13004 $",
    //   icon: <ReportMoney />,
    // },

  ]);

  return (
    <div className=" flex flex-col lg:flex-row gap-3 ">
      {overViews?.map((overview, index) => (
        <div className=" basis-3/12 " key={index}>
          <Card className=" dark:text-light dark:border-foreground ">
            <CardHeader>
              <CardTitle className=" flex items-center justify-between gap-2 opacity-70 font-normal ">
                {overview.title}
                {overview.icon}
              </CardTitle>
              <CardDescription >
                <div className=" text-2xl dark:text-light ">{overview.value}</div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Overview;
