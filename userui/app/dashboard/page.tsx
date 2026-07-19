"use client";

import { useSession } from "../../lib/auth-client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { graphQLClient } from "../../lib/graphql-client";
import { logout } from "../../lib/logout";
import { Heading, Text, Box, Button } from "@radix-ui/themes";
import { ReloadIcon } from "@radix-ui/react-icons";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SYSTEM_INFO = gql`
  {
    SystemInfo {
      ready
      uptimeInSeconds
    }
  }
`;

const Page = () => {
  const {
    loading: loadingSystemInfo,
    error: systemInfoError,
    data: systemInfoData,
    refetch: refetchSystemInfo,
  } = useQuery(SYSTEM_INFO, {
    client: graphQLClient,
    fetchPolicy: "network-only",
  });

  const {
    data: sessionData,
    isPending: loadingSession,
    error: sessionError,
    refetch: refetchSession,
  } = useSession();

  if (!loadingSession && (sessionError || !sessionData)) {
    logout();
  }

  if (!loadingSystemInfo && (systemInfoError || !systemInfoData)) {
    return (
      <>
        <h1>Error</h1>
        <div>System info not loaded</div>
        <Button
          onClick={() => {
            refetchSession();
            refetchSystemInfo();
          }}
        >
          Reload <ReloadIcon />
        </Button>
      </>
    );
  }

  return (
    <Box width="100%" pt="5">
      <Text size="1">
        <Heading size="4">Session:</Heading>
        {loadingSession ? (
          <div>Loading session data...</div>
        ) : (
          <pre>{JSON.stringify(sessionData, null, 2)}</pre>
        )}
        <Heading size="4">System Info:</Heading>
        {loadingSystemInfo ? (
          <div>Loading system info...</div>
        ) : (
          <pre>{JSON.stringify(systemInfoData, null, 2)}</pre>
        )}
      </Text>
    </Box>
  );
};

export default Page;
