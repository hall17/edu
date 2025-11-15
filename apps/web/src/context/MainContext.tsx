import React, { createContext, useContext, useState, useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TabItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

interface MainContextValue {
  title?: string;
  description?: string | null;
  breadcrumbItems?: BreadcrumbItem[];
  tabItems?: TabItem[];
  extra?: React.ReactNode;
  backButton?: boolean;
  backButtonTo?: string;
  backButtonText?: string;
  onClickBackButton?: () => void;
  setTitle: (title?: string) => void;
  setDescription: (description?: string | null) => void;
  setBreadcrumbItems: (items?: BreadcrumbItem[]) => void;
  setTabItems: (items?: TabItem[]) => void;
  setExtra: (extra?: React.ReactNode) => void;
  setBackButton: (backButton?: boolean) => void;
  setBackButtonTo: (backButtonTo?: string) => void;
  setBackButtonText: (backButtonText?: string) => void;
  setOnClickBackButton: (onClickBackButton?: () => void) => void;
}

const MainContext = createContext<MainContextValue | undefined>(undefined);

export function MainProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined | null>();
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    BreadcrumbItem[] | undefined
  >();
  const [tabItems, setTabItems] = useState<TabItem[] | undefined>();
  const [extra, setExtra] = useState<React.ReactNode | undefined>();
  const [backButton, setBackButton] = useState<boolean | undefined>();
  const [backButtonTo, setBackButtonTo] = useState<string | undefined>();
  const [backButtonText, setBackButtonText] = useState<string | undefined>();
  const [onClickBackButton, setOnClickBackButton] = useState<
    (() => void) | undefined
  >();

  const value: MainContextValue = {
    title,
    description,
    breadcrumbItems,
    tabItems,
    extra,
    backButton,
    backButtonTo,
    backButtonText,
    onClickBackButton,
    setTitle,
    setDescription,
    setBreadcrumbItems,
    setTabItems,
    setExtra,
    setBackButton,
    setBackButtonTo,
    setBackButtonText,
    setOnClickBackButton,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}

export function useMainContext() {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error('useMainContext must be used within a MainProvider');
  }

  return context;
}

/**
 * Hook to update Main component properties from nested components
 */
export function useUpdateMainContext(
  props: {
    title?: string;
    description?: string | null;
    breadcrumbItems?: BreadcrumbItem[];
    tabItems?: TabItem[];
    extra?: React.ReactNode;
    backButton?: boolean;
    backButtonTo?: string;
    backButtonText?: string;
    onClickBackButton?: () => void;
  },
  deps: React.DependencyList = []
) {
  const context = useMainContext();

  useEffect(() => {
    console.log('useUpdateMainContext', props);
    if (props.title !== undefined) {
      context.setTitle(props.title);
    }
    if (props.description !== undefined) {
      context.setDescription(props.description);
    }
    if (props.breadcrumbItems !== undefined) {
      context.setBreadcrumbItems(props.breadcrumbItems);
    }
    if (props.tabItems !== undefined) {
      context.setTabItems(props.tabItems);
    }
    if (props.extra !== undefined) {
      context.setExtra(props.extra);
    }
    if (props.backButton !== undefined) {
      context.setBackButton(props.backButton);
    }
    if (props.backButtonTo !== undefined) {
      context.setBackButtonTo(props.backButtonTo);
    }
    if (props.backButtonText !== undefined) {
      context.setBackButtonText(props.backButtonText);
    }
    if (props.onClickBackButton !== undefined) {
      context.setOnClickBackButton(() => props.onClickBackButton);
    }

    // Cleanup function to reset values when component unmounts
    return () => {
      context.setTitle(undefined);
      context.setDescription(undefined);
      context.setBreadcrumbItems(undefined);
      context.setTabItems(undefined);
      context.setExtra(undefined);
      context.setBackButton(undefined);
      context.setBackButtonTo(undefined);
      context.setBackButtonText(undefined);
      context.setOnClickBackButton(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
