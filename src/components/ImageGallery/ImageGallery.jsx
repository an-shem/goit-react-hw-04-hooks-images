import PropTypes from 'prop-types';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { ImagesList } from './ImageGallery.styled';

export function ImageGallery({ imagesList, alt, handleClick }) {
  return (
    <ImagesList>
      {imagesList.map(image => (
        <ImageGalleryItem
          key={image.id}
          image={image}
          alt={alt}
          handleClick={handleClick}
        />
      ))}
    </ImagesList>
  );
}

ImageGallery.propTypes = {
  imagesList: PropTypes.array.isRequired,
};
