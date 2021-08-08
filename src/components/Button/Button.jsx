import { GalleryButton } from './Button.styled';
import PropTypes from 'prop-types';

export function Button({ onClick }) {
  return (
    <GalleryButton type="button" onClick={onClick}>
      Load more
    </GalleryButton>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};
