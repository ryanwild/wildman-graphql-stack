"use client";

import { InfoCircledIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Callout,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Label } from "radix-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { authClient } from "../../lib/auth-client";
import { validateLogin } from "../../lib/validation";
import InputError from "../_components/InputError/index";
import { CheckBox } from "../_components/CheckBox/index";

export type LoginFormState = {
  message?: string;
  data?: {
    email?: string;
    password?: string;
    rememberMe?: boolean;
  };
  validation?: {
    email?: string[];
    password?: string[];
  };
};

const initialState: LoginFormState = {};

export const dynamic = "force-dynamic";

const LogIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<LoginFormState>(initialState);

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const nextState: LoginFormState = {};
    const formData = new FormData(event.currentTarget);
    const data = {
      email: (formData.get("email") as string) ?? "",
      password: (formData.get("password") as string) ?? "",
      rememberMe: Boolean(formData.get("rememberMe")),
    };
    const [valid, validationErrors] = validateLogin(data);

    if (!valid) {
      nextState.validation = validationErrors as LoginFormState["validation"];
      nextState.message = "Could not log you in";
      setState(nextState);
      setIsLoading(false);
      return;
    }

    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      fetchOptions: {
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
        onError: () => {
          nextState.message = "There was a problem logging in";
        },
      },
    });
    setState(nextState);
    setIsLoading(false);
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
          <CheckBox label="Remember me" defaultChecked name="rememberMe" />
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
