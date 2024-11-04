/* eslint-disable react/prop-types */
import { useState } from 'react';
import TabContext from '../components/TabContext';

const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Rewards");

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export default TabProvider;