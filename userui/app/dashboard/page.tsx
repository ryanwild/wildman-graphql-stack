"use client";

import { redirect } from "next/navigation";
import { useSession } from "../../lib/auth-client";
import { gql, useQuery } from "urql";

export const dynamic = "force-dynamic";

const SystemInfoQuery = gql`
  {
    SystemInfo {
      ready
      uptimeInSeconds
    }
  }
`;

const Page = () => {
  const { data, isPending, error } = useSession();
  const [result, reexecuteQuery] = useQuery({
    query: SystemInfoQuery,
  });

  const { data: systemInfo, fetching, error: gqlError } = result;

  if (!isPending && (error || !data)) {
    return redirect("/login");
  }
  if (!fetching && gqlError) {
    return (
      <div>
        There was a problem fetching SystemInfo{" "}
        <button onClick={reexecuteQuery}>Retry</button>
      </div>
    );
  }
  return (
    <div>
      {isPending || fetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            <h4>Session:</h4>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <h4>System Info:</h4>
            <pre>{JSON.stringify(systemInfo, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
