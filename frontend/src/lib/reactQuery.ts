import {
  type UseMutationOptions,
  type DefaultOptions,
} from "@tanstack/react-query";

// This entire setup is taken from bulletproof-react
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    // TODO: What should the default stale time be for our app?
    // staleTime: 1000 * 60 * 60
  },
} satisfies DefaultOptions;

// All these types below are used for typing custom hooks we will build in the future
export type ApiFnReturnType<
  FnType extends (...args: unknown[]) => Promise<unknown>,
> = Awaited<ReturnType<FnType>>;

// May the Typescript compiler and eslint forgive me for using any but I'm too lazy to remake this
// code I took from another repo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MutationFnType extends (...args: any[]) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
