import Loader from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';

import { useState, useEffect } from 'react';
import galleryApi, { PER_PAGE } from './services/galleryApi';

import { Searchbar } from './components/Searchbar/Searchbar';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { Button } from './components/Button/Button';
import Modal from './components/Modal/Modal';

import { WrapperLoader, MyApp } from './App.styled';

export default function App() {
  const [imagesList, setImagesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [numberPage, setNumberPage] = useState(1);
  const [showModal, setShowModal] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [requestStatus, setRequestStatus] = useState('idle');

  useEffect(() => {
    if (!searchQuery) return;
    setRequestStatus('pending');

    galleryApi.fetchGalleryWithQuery(searchQuery, numberPage).then(data => {
      if (data.length === 0 && numberPage === 1) {
        toast.error('Nothing found');
        setRequestStatus('idle');
        return;
      }

      if (data.length === 0 && numberPage > 1) {
        toast.error('End of image list');
        setRequestStatus('idle');
        return;
      }

      const images = data.map(({ id, webformatURL, largeImageURL }) => ({
        id,
        webformatURL,
        largeImageURL,
      }));

      setImagesList(prev => [...prev, ...images]);
      setRequestStatus('resolved');
    });
  }, [numberPage, searchQuery]);

  useEffect(() => {
    if (imagesList.length <= PER_PAGE) return;
    handleScroll();
  }, [imagesList]);

  const handleSubmit = searchQuery => {
    if (searchQuery.trim() !== '') {
      setNumberPage(1);
      setImagesList([]);
      setSearchQuery(searchQuery);
      return;
    }
    toast.error('Invalid request');
  };

  const handleScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const toggleModal = e => {
    if (e.target === e.currentTarget || e.code === 'Escape') {
      setShowModal(prev => !prev);
    }
  };

  const handleClickImages = (e, url) => {
    setImgUrl(url);
    toggleModal(e);
  };

  return (
    <MyApp>
      <Searchbar onSubmit={handleSubmit} />
      {imagesList.length > 0 && (
        <ImageGallery
          imagesList={imagesList}
          alt={searchQuery}
          handleClick={handleClickImages}
        />
      )}
      {requestStatus === 'pending' && (
        <WrapperLoader>
          <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
        </WrapperLoader>
      )}
      {requestStatus === 'resolved' && (
        <Button onClick={() => setNumberPage(prev => prev + 1)} />
      )}
      {showModal && (
        <Modal alt={searchQuery} url={imgUrl} closeModal={toggleModal} />
      )}
      <Toaster />
    </MyApp>
  );
}
