import { Container, Flex, Heading } from "@radix-ui/themes";

export default async function Home() {
  return (
    <main>
      <Container size="1">
        <Flex direction="column" align="center">
          <Heading size="6" wrap="wrap">
            Wildman Stack
          </Heading>
        </Flex>
      </Container>
    </main>
  );
}
