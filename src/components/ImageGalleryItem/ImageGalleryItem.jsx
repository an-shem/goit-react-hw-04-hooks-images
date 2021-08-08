import PropTypes from 'prop-types';

import { ImagesListItem, Image } from './ImageGalleryItem.styled';

export function ImageGalleryItem({
  handleClick,
  alt,
  image: { webformatURL, largeImageURL },
}) {
  return (
    <ImagesListItem>
      <Image
        src={webformatURL}
        alt={alt}
        className="ImageGalleryItem-image"
        onClick={e => handleClick(e, largeImageURL)}
      />
    </ImagesListItem>
  );
}

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string,
    largeImageURL: PropTypes.string,
  }).isRequired,
  alt: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
