"use client";

import { redirect } from "next/navigation";
import { useSession } from "../../lib/auth-client";

export const dynamic = "force-dynamic";

const Page = () => {
  const { data, isPending, error } = useSession();
  if (!isPending && (error || !data)) {
    return redirect("/login");
  }

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
