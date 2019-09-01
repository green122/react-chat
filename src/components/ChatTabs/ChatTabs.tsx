import React from "react";
import styled from "styled-components";
import { ETabs } from "../../models";

const Tabs = styled.section`
  display: flex;
  background-color: #e9e9e9;
`;

const Tab = styled.p`
  text-align: center;

  @media (max-width: 360px) {
    margin: 10px auto;
  }
`;

const TabContainer = styled.div`
  cursor: pointer;
  height: 80px;
  width: ${(props: { width: number }) => props.width}%;
  flex-grow: 1;
  ${Tab} {
  }
  &.active {
    background-color: white;
    border: 2px solid lightgray;
    border-bottom: none;
    &:nth-child(1) {
      border-radius: 0 10px 0 0;
      border-left: none;
    }
    &:last-child {
      border-radius: 10px 0 0 0;
      border-right: none;
    }
  }
  @media (max-width: 360px) {
    height: 40px;
  }
`;

interface ChatTabsProps {
  onChange: onChangeHandler;
  activeTab: ETabs;
  tabs: { id: ETabs; message: string }[];
}
type onChangeHandler = (value: ETabs) => void;
export function ChatTabs({ onChange, tabs, activeTab }: ChatTabsProps) {
  const tabWidth = tabs.length ? 100 / tabs.length : 100;

  return (
    <Tabs>
      {tabs.map(tab => (
        <TabContainer
          key={tab.id}
          width={tabWidth}
          className={tab.id === activeTab ? "active" : ""}
          onClick={() => onChange(tab.id)}
        >
          <Tab>{tab.message}</Tab>
        </TabContainer>
      ))}
    </Tabs>
  );
}
