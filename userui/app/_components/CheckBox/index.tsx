import { CheckIcon } from "@radix-ui/react-icons";
import { Label, Checkbox } from "radix-ui";
import { Flex, Text } from "@radix-ui/themes";
import { useId } from "react";
import styles from "./checkbox.module.css";

export type CheckBoxProps = {
  defaultChecked: boolean;
  label: string;
  name: string;
};

const CheckBox = (props: CheckBoxProps) => {
  const id = useId();
  return (
    <Flex width="100%" pt="2" direction="row" gap="3">
      <Checkbox.Root
        className={styles.CheckboxRoot}
        defaultChecked={props.defaultChecked}
        id={id}
        name={props.name}
      >
        <Checkbox.Indicator className={styles.CheckboxIndicator}>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <Label.Root className={styles.LabelRoot} htmlFor={id}>
        <Text size="1">{props.label}</Text>
      </Label.Root>
    </Flex>
  );
};

export { CheckBox };
export default CheckBox;
