import { profileImages } from "../data/profileImages";

export default function ProfileImage({ foto, alt, sizes, fullSize = false, ...props }) {
  const image = profileImages[foto];
  return (
    <img
      {...props}
      src={image ? (fullSize ? image.modal : image.card) : foto}
      srcSet={fullSize ? undefined : image?.srcSet}
      sizes={fullSize ? undefined : sizes}
      width={image?.width}
      height={image?.height}
      alt={alt}
      loading={fullSize ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
