import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import LoginForm from "./login-form";

export default async function SignIn() {
  noStore();

  return (
    <main className="flex flex-col items-center">
      <div className="z-10 mt-[calc(10vh)] h-fit w-full max-w-md flex-col overflow-hidden border-y border-gray-200 sm:rounded-2xl sm:border sm:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center text-black sm:px-16">
          <h3 className="text-xl font-semibold">
            Sign in to {process.env.NEXT_PUBLIC_APP_NAME}
          </h3>
          <p className="text-sm text-gray-500">
            Start maintaining your body for life
          </p>
        </div>
        <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
          <Suspense
            fallback={
              <>
                <Button disabled={true} variant="secondary" />
                <Button disabled={true} variant="secondary" />
                <Button disabled={true} variant="secondary" />
                <div className="mx-auto h-5 w-3/4 rounded-lg bg-gray-100" />
              </>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
