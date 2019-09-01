import styled from "styled-components";
import { ReactComponent as Pen } from "../../ui-res/pen-solid.svg";
import { ReactComponent as Delete } from "../../ui-res/times-solid.svg";

const Actions = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 5px;
  right: 5px;
  position: absolute;
  opacity: 0;
  transition: opacity 0.4s ease;
`;

const MessageWrapper = styled.div`
  margin-top: 20px;
  position: relative;
  &.editable {
    &:hover > ${Actions} {
      opacity: 1;
    }
  }
  &.activated {
    opacity: 1;
  }
`;

const Author = styled.p`
  display: inline-block;
  font-weight: bold;
  margin: 0;
`;

const Time = styled.p`
  display: inline-block;
  margin: 0;
  margin-left: 10px;
  color: darkgray;
`;

const Message = styled.div`
  display: block;
  margin: 0;
  p,
  a {
    line-break: strict;
    word-break: break-all;
    display: inline;
  }
  .info-message {
    color: gray;
  }
`;

const PenIcon = styled(Pen)`
  width: 20px;
  height: 20px;
  color: darkgray;
  cursor: pointer;
  @media (max-width: 360px) {
    width: 15px;
    height: 15px;
  }
`;

const DeleteIcon = styled(Delete)`
  width: 20px;
  height: 20px;
  color: darkgray;
  cursor: pointer;
  @media (max-width: 360px) {
    width: 15px;
    height: 15px;
  }
`;

export { Author, Time, DeleteIcon, PenIcon, MessageWrapper, Actions, Message }