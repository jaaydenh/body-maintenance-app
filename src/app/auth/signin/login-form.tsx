"use client";

import { useEffect, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
// import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Google from "@/components/icons/google";
import Discord from "@/components/icons/discord";
import useMediaQuery from "~/app/hooks/use-media-query";
import { checkEmailExists } from "../../actions/actions";

interface SubmitButtonProps extends ComponentPropsWithoutRef<"button"> {
  signInCallback?: () => void;
  icon?: React.ReactNode;
  text?: string;
}

function SubmitButton({
  signInCallback,
  icon,
  text,
  ...rest
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="secondary"
      onClick={signInCallback}
      loading={pending}
      disabled={pending}
      icon={icon}
      text={text}
      {...rest}
    />
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [noSuchAccount, setNoSuchAccount] = useState(false);
  const [email, setEmail] = useState("");

  const initialState = {
    message: "",
    exists: null,
  };

  const [state, formAction] = useFormState(checkEmailExists, initialState);

  useEffect(() => {
    const error = searchParams?.get("error");
    error && toast.error(error);
  }, [searchParams]);

  useEffect(() => {
    if (state.exists !== null && email !== "") {
      if (state.exists) {
        void signIn("email", {
          email,
          redirect: false,
          callbackUrl: "/",
        }).then((res) => {
          if (res?.ok && !res?.error) {
            setEmail("");
            toast.success("Email sent - check your inbox!");
          } else {
            toast.error("Error sending email - try again?");
          }
        });
      } else {
        toast.error("No account found with that email address.");
        setNoSuchAccount(true);
      }
    }
  }, [state, email]);

  useEffect(() => {
    const error = searchParams?.get("error");
    error && toast.error(error);
  }, [searchParams]);

  const { isMobile } = useMediaQuery();

  return (
    <>
      <form action={formAction} className="flex flex-col space-y-3">
        <div className="flex space-x-2">
          <SubmitButton
            signInCallback={() => {
              void signIn("google", {
                callbackUrl: "/",
              });
            }}
            icon={<Google className="h-5 w-5" />}
          />
          <SubmitButton
            signInCallback={() => {
              void signIn("discord", {
                callbackUrl: "/",
              });
            }}
            icon={<Discord className="h-5 w-5" />}
          />
        </div>
        {showEmailOption && (
          <div>
            <div className="mb-4 mt-1 border-t border-gray-300" />
            <input
              id="email"
              name="email"
              autoFocus={!isMobile}
              type="email"
              placeholder="me@maintain.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setNoSuchAccount(false);
                setEmail(e.target.value);
              }}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
        )}
        <SubmitButton
          text="Continue with Email"
          {...(!showEmailOption && {
            type: "button",
            onClick: (e: { preventDefault: () => void }) => {
              e.preventDefault();
              setShowEmailOption(true);
            },
          })}
        />
      </form>
      {noSuchAccount && (
        <p className="text-center text-sm text-red-500">
          No account found, login with Google or Discord first{" "}
          {/* <Link href="/register" className="font-semibold text-red-600">
            Sign up
          </Link>{" "}
          instead? */}
        </p>
      )}
      {/*  : (
         <p className="text-center text-sm text-gray-500">
           Dont have an account?{" "}
           <Link
             href="/register"
             className="font-semibold text-gray-500 transition-colors hover:text-black"
           >
             Sign up
           </Link>
         </p>
       )} */}
    </>
  );
}
