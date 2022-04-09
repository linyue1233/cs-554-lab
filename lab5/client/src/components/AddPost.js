import React, { useState } from 'react';
import '../App.css';
import { useMutation, useQuery } from '@apollo/client';
import ReactModal from 'react-modal';
import querys from '../querys';


ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function AddPost(props) {
  const [uploadImage] = useMutation(querys.UPLOAD_POST);

  let body = null;
  let url;
  let description;
  let posterName;
  body = (
    <form
      className='form'
      id='add-post'
      onSubmit={(e) => {
        e.preventDefault();
        uploadImage({
          variables: {
            url: url.value,
            description: description.value,
            posterName: posterName.value
          }
        });
        url.value = '';
        description.value = '';
        posterName.value = '';
        alert('Post Added');
      }}
    >
      <div className='form-group'>
        <label>
          URL:
          <br />
          <input
            ref={(node) => {
              url = node;
            }}
            required
            autoFocus={true}
          />
        </label>
      </div>
      <br />
      <div className='form-group'>
        <label>
          Description:
          <br />
          <input
            ref={(node) => {
              description = node;
            }}
            required
          />
        </label>
      </div>
      <br />

      <div className='form-group'>
        <label>
          PosterName:
          <br />
          <input
            ref={(node) => {
              posterName = node;
            }}
            required
          />
        </label>
      </div>
      <br />

      <br />
      <br />
      <button className='button add-button' type='submit'>
        Add Post
      </button>
    </form>
  );
  return (
    <div>
        {body}
    </div>
  );
}

export default AddPost;