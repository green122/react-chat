import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import axios, { AxiosResponse } from "axios";

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

const useAxiosFetch = (url: string, timeout?: number) => {
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    axios
      .get(url, {
        cancelToken: source.token,
        timeout: timeout
      })
      .then(a => {
        if (!unmounted) {
          setData(a.data);
          setLoading(false);
        }
      })
      .catch(function(e) {
        if (!unmounted) {
          setError(true);
          setErrorMessage(e.message);
          setLoading(false);
          if (axios.isCancel(e)) {
            console.log(`request cancelled:${e.message}`);
          } else {
            console.log("another error happened:" + e.message);
          }
        }
      });
    return function() {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [timeout, url]);

  return { data, loading, error, errorMessage };
};

const apiKey = "5d6a44add95a2986fdf3725d4283a3a09ed95eb01e451";

const fakeData = {
  description:
    "Найдётся всёНайдётся всёНайдётся всёНайдётся всёНайдётся всёНайдётся всёНайдётся всё",
  image: "https://yastatic.net/s3/home/logos/share/share-logo_ru.png",
  title: "Яндекс",
  url: "https://yandex.ru/"
};

const fakeData1 = {
  description: "",
  image: "http://www.exler.ru/images/elements/logo.png",
  title: "Авторский проект Алекса Экслера",
  url: "https://www.exler.ru/"
};

export function PreviewLink({ url }: { url: string }) {
  const previewUrl = `http://api.linkpreview.net/?key=${apiKey}&q=${url}`;
  const { data, loading }: { data: any; loading: boolean } = useAxiosFetch(
    previewUrl,
    2500
  );
  
  if (!data) return null;
  const { description = "", title = "", image = "" } = data || {};
  const formattedDescription =
    description.length < 30
      ? data.description
      : description.slice(0, 30) + "...";
  return (
    <PreviewWrapper>
      {loading ? (
        <Loading> ...loading</Loading>
      ) : (
        <Fragment>
          <PreviewImageWrapper>
            <PreviewImage src={image} />
          </PreviewImageWrapper>
          <InfoWrapper>
            <InfoTitle>{title}</InfoTitle>
            <InfoDescription>{formattedDescription}</InfoDescription>
          </InfoWrapper>
        </Fragment>
      )}
    </PreviewWrapper>
  );
}
