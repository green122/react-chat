import React from "react";
import styled from "styled-components";
import { IUser } from "../../models";

interface UsersListProps {
  users: IUser[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <UsersWrapper>
      {users.map(user => (
        <UserRow key={user.id}>{user.nickName}</UserRow>
      ))}
    </UsersWrapper>
  );
}

const UsersWrapper = styled.section`
  flex-grow: 1;
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const UserRow = styled.div`
  height: auto;
  width: 100%;
  padding: 12px;
  border-bottom: 1px solid;
`;
