"use client";

import { InfoCircledIcon, Pencil2Icon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Callout,
  Container,
  Flex,
  Heading,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { Label } from "radix-ui";
import { SyntheticEvent, useState } from "react";
import { authClient } from "../../lib/auth-client";
import { validateUser } from "../../lib/validation";
import InputError from "../_components/InputError/index";

export type SignUpFormState = {
  message?: string;
  data?: {
    fullname?: string;
    email?: string;
    password?: string;
  };
  validation?: {
    fullname?: string[];
    email?: string[];
    password?: string[];
  };
};

const initialState: SignUpFormState = {};

export const dynamic = "force-dynamic";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<SignUpFormState>(initialState);
  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const nextState: SignUpFormState = {};
    const formData = new FormData(event.currentTarget);
    const data = {
      email: (formData.get("email") as string) ?? "",
      password: (formData.get("password") as string) ?? "",
      fullname: (formData.get("fullname") as string) ?? "",
    };
    const [valid, validationErrors] = validateUser(data);

    if (!valid) {
      nextState.validation = validationErrors as SignUpFormState["validation"];
      nextState.message = "Could not sign you up";
      setState(nextState);
      setIsLoading(false);
      return;
    }

    await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.fullname,
      fetchOptions: {
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
          return;
        },
        onError: () => {
          nextState.message = "There was a problem signing up";
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
            Sign Up
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
          <Label.Root className="LabelRoot" htmlFor="fullname">
            Full Name
          </Label.Root>
          <TextField.Root
            id="fullname"
            name="fullname"
            type="text"
            autoComplete="name"
            placeholder="Full Name"
            defaultValue={state.data?.fullname}
          />
          <InputError inputError={state?.validation?.fullname} />
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
              <Pencil2Icon /> Sign Up
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
    </Container>
  );
}
