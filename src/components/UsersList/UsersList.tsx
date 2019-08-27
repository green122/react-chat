import React from "react";
import styled from "styled-components";
import { IUser } from "../../models";

const UsersWrapper = styled.section`
  display: flex;
  background-color: #e9e9e9;
`;

const UserRow = styled.div`
  height: 15px;
  width: 100%;
`;

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
