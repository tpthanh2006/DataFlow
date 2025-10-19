import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import type { BaseForm } from "@shared/schema/schema";

export function createFormCreationStoreContext<
  TState extends FormCreationState,
>(
  initializer: (
    set: (
      partial: Partial<TState> | ((state: TState) => Partial<TState>),
    ) => void,
    get: () => TState,
  ) => TState,
) {
  // I'm using a context to prevent this from being a completely global store
  // This store should only really be used for form creation, so saving its state beyond that
  // isn't necessary. In other words, this store only exists when this context is mounted (ex. when
  // the user is on the a form creation page).
  const FormCreationStoreContext = createContext<StoreApi<TState> | undefined>(
    undefined,
  );

  type FormCreationStoreProviderProps = {
    children: ReactNode;
  };

  const FormCreationStoreProvider = ({
    children,
  }: FormCreationStoreProviderProps) => {
    const [store] = useState(() => createStore<TState>(initializer));

    return (
      <FormCreationStoreContext.Provider value={store}>
        {children}
      </FormCreationStoreContext.Provider>
    );
  };

  // Get access to the usual store hooks
  const useFormCreationStore = <TSelected,>(
    selector: (state: TState) => TSelected,
  ): TSelected => {
    const store = useContext(FormCreationStoreContext);
    if (!store) {
      throw new Error("Missing FormCreationStoreProvider");
    }
    return useStore(store, selector);
  };

  // Get direct access to the store for things like store.getState()
  const useFormCreationStoreApi = (): StoreApi<TState> => {
    const store = useContext(FormCreationStoreContext);
    if (!store) {
      throw new Error("Missing FormCreationStoreProvider");
    }
    return store;
  };

  return {
    FormCreationStoreProvider,
    useFormCreationStore,
    useFormCreationStoreApi,
  };
}

// This type represents the state stored within a FormCreationStore
// This is a generic type-- pass it a form type to make it extend other form types
export type FormCreationState<TForm extends BaseForm = BaseForm> =
  Partial<TForm> & {
    setData: (data: Partial<TForm>) => void;
  };

export type UseFormCreationStore<TState extends Partial<BaseForm>> = <T>(
  selector: (state: TState) => T,
) => T;
