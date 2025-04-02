import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import React, { use } from "react";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";
import { redirect } from "next/navigation";
import Dashboardsetup from "@/components/dashboard-setup/Dashboardsetup";
import { getUserSubscriptionStatus } from "@/lib/supabase/querries";

type Props = {};

const Dashboard = async ({}: Props) => {
  const supabase = createServerComponentClient({ cookies });
  //fetch the user to identify weather the user is authenticated or not
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; //if the user is not found the it will not show anything
  console.log(user);
  //Query the database to find the workspace owned by the user
  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });
  //Retrieve the user subscrpition status
  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //if their any error fettching the subscription ther return
  if (subscriptionError) return;
  //if the user dosent have the workspece then render this
  if (!workspace)
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <Dashboardsetup user={user} subscription={subscription} />
      </div>
    );
  //redirect the user to their dashboard as they have the workspace
  redirect(`/dashboard/${workspace.id}`);
};

export default Dashboard;
