import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import React, { use } from "react";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";
import { redirect } from "next/navigation";
import Dashboardsetup from "@/components/dashboard-setup/Dashboardsetup";
import { getUserSubscriptionStatus } from "@/lib/supabase/querries";

type Props = {};

const Dashboard = async ({}: Props) => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  console.log(user);
  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });
  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  if (subscriptionError) return;
  if (!workspace)
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <Dashboardsetup user={user} subscription={subscription} />
      </div>
    );
  redirect(`/dashboard/${workspace.id}`);
};

export default Dashboard;
