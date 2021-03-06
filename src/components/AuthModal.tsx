import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { clearAction } from "../actions/authActions";
import { RootState } from "../reducers/rootReducer";
import { styles } from "../styles/styles";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

const { mobileMaxWidth } = styles;

export const Shadow = styled.div<{ loggedIn: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: ${(props) => (props.loggedIn ? "55px" : "75px")};
  left: 0;
  background-color: black;
  opacity: 0.6;
  @media screen and (max-width: ${mobileMaxWidth}) {
    top: ${(props) => (props.loggedIn ? "44px" : "64px")};
  }
`;

const AuthModal = (): ReactElement => {
  const dispatch = useDispatch();
  const { showLogIn, showSignUp } = useSelector(
    (state: RootState) => state.authReducer,
  );
  const { uid } = useSelector((state: RootState) => state.userReducer);
  let auth;
  if (showLogIn) {
    auth = <LogIn />;
  } else if (showSignUp) {
    auth = <SignUp />;
  }
  return (
    <>
      <Shadow loggedIn={!!uid} onClick={() => dispatch(clearAction())} />
      {auth}
    </>
  );
};

export default AuthModal;
