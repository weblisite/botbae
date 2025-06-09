import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import MainComponent from "@/components/MainComponent";
import { useBotbaeData } from "@/hooks/useBotbaeData";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useBotbaeData();
  
  // Render MainComponent directly - no loading screens for better UX
  return <MainComponent />;
};

export default Dashboard;
