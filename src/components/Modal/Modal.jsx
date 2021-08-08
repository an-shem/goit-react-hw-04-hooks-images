import PropTypes from 'prop-types';

import { Component } from 'react';
import { createPortal } from 'react-dom';

import { Overlay, ImageModal } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  static defaultProps = {
    alt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    this.props.closeModal(e);
  };

  render() {
    const { alt, url, closeModal } = this.props;
    return createPortal(
      <Overlay onClick={closeModal}>
        <ImageModal>
          <img src={url} alt={alt} />
        </ImageModal>
      </Overlay>,
      modalRoot,
    );
  }
}
