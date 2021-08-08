import Loader from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';

import { Component } from 'react';
import galleryApi from './services/galleryApi';

import { Searchbar } from './components/Searchbar/Searchbar';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { Button } from './components/Button/Button';
import { Modal } from './components/Modal/Modal';

import { WrapperLoader, MyApp } from './App.styled';

export class App extends Component {
  state = {
    imagesList: [],
    searchQuery: '',
    numberPage: 1,
    showModal: null,
    imgUrl: '',
    requestStatus: 'idle',
    // idle, pending, resolved, rejected,
  };

  componentDidUpdate(_, prevState) {
    const { searchQuery, imagesList } = this.state;

    if (prevState.searchQuery !== searchQuery) {
      this.setState({ imagesList: [], numberPage: 1 });
      this.handleSearch();
    }
    if (
      prevState.imagesList !== imagesList &&
      prevState.imagesList.length !== 0
    ) {
      this.handleScroll();
    }
  }

  handleSubmit = searchQuery => {
    if (searchQuery.trim() !== '') {
      this.setState({ searchQuery });
      return;
    }
    toast.error('Invalid request');
  };

  handleSearch = () => {
    const { searchQuery, numberPage } = this.state;
    this.setState({ requestStatus: 'pending' });

    galleryApi
      .fetchGalleryWithQuery(searchQuery, numberPage)
      .then(imagesData => this.handleSearchData(imagesData));
  };

  handleSearchData = data => {
    const { numberPage } = this.state;

    if (data.length === 0 && numberPage === 1) {
      toast.error('Nothing found');
      this.setState({ requestStatus: 'idle' });
      return;
    }

    if (data.length === 0 && numberPage > 1) {
      toast.error('End of image list');
      this.setState({ requestStatus: 'idle' });
      return;
    }

    const images = data.map(({ id, webformatURL, largeImageURL }) => ({
      id,
      webformatURL,
      largeImageURL,
    }));

    this.setState(prevState => ({
      imagesList: [...prevState.imagesList, ...images],
      numberPage: prevState.numberPage + 1,
      requestStatus: 'resolved',
    }));
  };

  handleScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  toggleModal = e => {
    if (e.target === e.currentTarget || e.code === 'Escape') {
      this.setState(({ showModal }) => ({ showModal: !showModal }));
    }
  };

  handleClickImages = (e, url) => {
    this.setState({ imgUrl: url });
    this.toggleModal(e);
  };

  render() {
    const { imagesList, searchQuery, requestStatus, showModal, imgUrl } =
      this.state;
    return (
      <MyApp>
        <Searchbar onSubmit={this.handleSubmit} />
        {imagesList.length > 0 && (
          <ImageGallery
            imagesList={imagesList}
            alt={searchQuery}
            handleClick={this.handleClickImages}
          />
        )}
        {requestStatus === 'pending' && (
          <WrapperLoader>
            <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
          </WrapperLoader>
        )}
        {requestStatus === 'resolved' && <Button onClick={this.handleSearch} />}
        {showModal && (
          <Modal alt={searchQuery} url={imgUrl} closeModal={this.toggleModal} />
        )}
        <Toaster />
      </MyApp>
    );
  }
}

export default App;
