"use client";

import { NavigationMenu } from "radix-ui";
import classNames from "classnames";
import { CaretDownIcon, HomeIcon } from "@radix-ui/react-icons";
import styles from "./style.module.css";
import { Ref, useRef, useContext } from "react";

import { GlobalPropsContext } from "../../_context/global-props";

export const GlobalNavigation = () => {
  const navRef = useRef(null);
  const globalProps = useContext(GlobalPropsContext);
  const sessionAvailable = globalProps?.sessionAvailable ?? false;

  const nav = (
    <NavigationMenu.Root className={styles.Root}>
      <NavigationMenu.List className={styles.MenuList}>
        <NavigationMenu.Item>
          <NavigationMenu.Link className={styles.Link} href="/">
            <HomeIcon />
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={styles.Link}
            href="https://github.com/ryanwild/wildman-stack"
            target="_blank"
          >
            Github
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={styles.Trigger}>
            Account
            <CaretDownIcon className={styles.CaretDown} aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={styles.Content}>
            <ul className={`${styles.List}`}>
              {sessionAvailable ? (
                <>
                  <ListItem href="/dashboard" title="Dashboard" ref={navRef}>
                    Manage your account.
                  </ListItem>
                  <ListItem href="/api/logout" title="Log out" ref={navRef}>
                    Sign out of this device.
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem href="/signup" title="Sign Up" ref={navRef}>
                    Get started, create an account.
                  </ListItem>
                  <ListItem href="/login" title="Log in" ref={navRef}>
                    Access your account dashboard
                  </ListItem>
                </>
              )}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className={styles.Indicator}>
          <div className={styles.Arrow} />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className={styles.ViewportPosition}>
        <NavigationMenu.Viewport className={styles.Viewport} />
      </div>
    </NavigationMenu.Root>
  );
  return nav;
};

type ListItemProps = {
  href: string;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  ref?: Ref<HTMLAnchorElement>;
};

const ListItem = ({
  className,
  children,
  title,
  ref,
  ...props
}: ListItemProps) => {
  return (
    <li>
      <NavigationMenu.Link asChild>
        <a
          ref={ref}
          className={classNames(styles.ListItemLink, className)}
          {...props}
        >
          <div className={styles.ListItemHeading}>{title}</div>
          <p className={styles.ListItemText}>{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  );
};

export default GlobalNavigation;
