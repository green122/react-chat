import styled from "styled-components";

const PreviewWrapper = styled.div`
  bottom: 30px;
  left: 0;
  position: absolute;
  display: flex;
  background: white;
  padding: 10px;
  border: 1px solid lightgrey;
  width: 310px;
  height: 72px;
  z-index: 1;
  @media (max-width: 360px) {
    width: 250px;
    bottom: 20px;
    height: 50px;
    padding: 5px;
  }
`;

const Loading = styled.p`
  margin: auto 30px;
`;

const PreviewImageWrapper = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid grey;
  margin-right: 10px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  min-width: 100%;
  height: auto;
  width: auto;  
`;

const InfoWrapper = styled.div``;

const InfoTitle = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  @media (max-width: 360px) {
    font-size: 16px;
  }
`;

const InfoDescription = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  color: darkgrey;
  @media (max-width: 360px) {
    font-size: 12px;
  }
`;

export { InfoDescription, InfoTitle, InfoWrapper, PreviewImage, PreviewImageWrapper, Loading, PreviewWrapper};
