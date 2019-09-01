import styled from "styled-components";

const ChatView = styled.section`
  width: 480px;
  display: flex;
  box-sizing: border-box;
  background-color: white;
  height: calc(100vh - 20px);
  flex-direction: column;
  margin: 0 auto;
  justify-content: start;
  font-size: 24px;
  @media (max-width: 360px) {
    height: 100vh;
    font-size: 16px;
    padding-bottom: 10px;
  }
`;

const ChatList = styled.div`
  padding: 24px;
  margin: 10px 10px 10px 0;  
  height: 0px;
  flex-grow: 1;
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
  @media (max-width: 360px) {
    padding: 12px;
  }
  &::-webkit-scrollbar-track {    
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 7px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #aaaaaa;    
  }
`;

const ScrollButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 10px;
  font-size: 16px;
  border: 0;
  position: fixed;
  right: calc(50% - 200px);
  cursor: pointer;
  background: white;
  box-shadow: 5px 5px 23px grey;
  @media (max-width: 360px) {
    right: calc(50% - 135px);
  }
`;

export { ScrollButton, ChatList, ChatView }