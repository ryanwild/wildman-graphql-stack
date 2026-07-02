"use client";

import { useSearchParams } from "next/navigation";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
export default function ErrorPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const message = searchParams.get("message") ?? "";
  return (
    <Container size="4" maxWidth="400px" pt="8" align="center">
      <Flex justify="center" direction="column">
        <Heading align="center">Error {status}</Heading>
        <Text align="center">{message}</Text>
      </Flex>
    </Container>
  );
}
