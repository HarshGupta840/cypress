// import { SubscriptionModalProvider } from '@/lib/providers/subscription-modal-provider';
// import { getActiveProductsWithPrice } from '@/lib/supabase/queries';
import { SubscriptionModalProvider } from "@/lib/provider/subscription-modal-providor";
import { getActiveProductsWithPrice } from "@/lib/supabase/querries";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { data: products, error } = await getActiveProductsWithPrice();
  //   if (error) throw new Error("error");
  return (
    <main className="flex over-hidden h-screen">
      <SubscriptionModalProvider products={products}>
        {children}
      </SubscriptionModalProvider>
    </main>
  );
};

export default Layout;
