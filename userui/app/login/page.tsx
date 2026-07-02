"use client";

import { InfoCircledIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Callout,
  Container,
  Flex,
  Heading,
  TextField,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { Label } from "radix-ui";
import { useState, SyntheticEvent } from "react";
import InputError from "../_components/InputError/index";
import { LoginFormState } from "../api/login/route";
import { useRouter } from "next/navigation";

const initialState: LoginFormState = {};

export const dynamic = "force-dynamic";

const LogIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<LoginFormState>(initialState);

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const body = JSON.stringify(Object.fromEntries(formData));
      const response = await fetch("/api/login", {
        method: "POST",
        body,
        credentials: "include",
      });
      if (response.ok) {
        router.push("/dashboard", { scroll: true });
        router.refresh();
      }
      const responseState = await response.json();
      setState(responseState);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Container size="4" maxWidth="400px" pt="8">
      <form onSubmit={onSubmit}>
        <Flex gap="4" direction="column" justify="between" display="flex">
          <Heading as="h1" align="center">
            Login
          </Heading>
          <Label.Root className="LabelRoot" htmlFor="email">
            Email
          </Label.Root>
          <TextField.Root
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            defaultValue={state?.data?.email}
          />
          <InputError inputError={state?.validation?.email} />
          <Label.Root className="LabelRoot" htmlFor="password">
            Password
          </Label.Root>
          <TextField.Root
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            defaultValue={state.data?.password}
          />
          <InputError inputError={state?.validation?.password} />
          <Box width="100%" pt="2">
            <Button type="submit" loading={isLoading}>
              <LockOpen1Icon /> Log In
            </Button>
          </Box>
          {state?.message && (
            <Callout.Root color="blue" size="1">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{state.message}</Callout.Text>
            </Callout.Root>
          )}
        </Flex>
      </form>
      <Box width="100%" pt="5">
        <Text size="1">
          Create an account <Link href="/signup">here</Link>
        </Text>
      </Box>
    </Container>
  );
};

export default LogIn;
