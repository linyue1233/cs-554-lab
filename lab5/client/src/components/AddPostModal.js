import React, { useState } from 'react';
import '../App.css';
import { useMutation,useQuery } from '@apollo/client';
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

function AddPostModal(props) {
  const [showAddModal, setShowAddModal] = useState(props.isOpen);
  const [uploadImage] = useMutation(querys.UPLOAD_POST, {
    update(cache, {data: {uploadImage}}) {
      const {userPostedImages} = cache.readQuery({query: querys.SHOW_MYPOST});
      cache.writeQuery({
        query: querys.SHOW_MYPOST,
        data: {userPostedImages: userPostedImages.concat([uploadImage])}
      });
    }
  });

  const handleCloseAddModal = () => {
    setShowAddModal(true);
    props.handleClose(false);
  };
  let body = null;

  if (props.modal === 'newPost') {
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
          setShowAddModal(false);
          alert('Post Added');
          props.handleClose();
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
            <input
              className='form-control'
              ref={(node) => {
                posterName = node;
              }}
            >
            </input>
          </label>
        </div>

        <br />
        <br />
        <button className='button add-button' type='submit'>
          Add Post
        </button>
      </form>
    );
  };
  return (
    <div>
      <ReactModal
        name='addModal'
        isOpen={showAddModal}
        contentLabel='Add Modal'
        style={customStyles}
      >
        {body}
        <button className='button cancel-button' onClick={handleCloseAddModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default AddPostModal;