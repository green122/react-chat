import React, { Fragment } from "react";

import { PreviewWrapper, Loading, PreviewImageWrapper, PreviewImage, InfoWrapper, InfoTitle, InfoDescription } from "./LinkPreview.ui";
import { useAxiosFetch } from "../../utils/common.hooks";


const apiKey = "5d6a44add95a2986fdf3725d4283a3a09ed95eb01e451";

export function PreviewLink({ url }: { url: string }) {
  const previewUrl = `https://api.linkpreview.net/?key=${apiKey}&q=${url}`;
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
