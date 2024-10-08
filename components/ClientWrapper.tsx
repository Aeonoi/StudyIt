"use client";
import {
  CheckLoginCollection,
  CheckRankCollection,
  CheckSuperTaskCollection,
} from "@/lib/mongo-functions";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

// wraps around layout to check collections when app is first started
export default function ClientWrapper({ children }: Props) {
  useEffect(() => {
    const checkCollections = async () => {
      await CheckSuperTaskCollection();
      await CheckRankCollection();
      await CheckLoginCollection();
    };
    checkCollections();
  }, []);

  return <>{children}</>;
}
