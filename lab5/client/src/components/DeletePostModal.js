import React, { useState } from 'react';
import '../App.css';
import { useMutation } from '@apollo/client';
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

function DetelePostModal(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [singalPost, setSingalPost] = useState(props.deleteImage);

    const [deleteImage] = useMutation(querys.DELETE_POST, {
        update(cache, {data: {deleteImage}}) {
          const {userPostedImages} = cache.readQuery({
            query: querys.SHOW_MYPOST
          });
          cache.writeQuery({
            query: querys.SHOW_MYPOST,
            data: {
                userPostedImages: userPostedImages.filter((e) => e._id !== singalPost._id)
            }
          });
        }
      });

      const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSingalPost(null);
        props.handleClose();
      };
      return (
        <div>
          {/*Delete Employee Modal */}
          <ReactModal
            name='deleteModal'
            isOpen={showDeleteModal}
            contentLabel='Delete Post'
            style={customStyles}
          >
            <div>
              <p>
                Are you sure you want to delete this Post?
              </p>
    
              <form
                className='form'
                id='delete-employee'
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(singalPost)
                  deleteImage({
                    variables: {
                      id: singalPost.id
                    }
                  });
                  setShowDeleteModal(false);
    
                  alert('Post Deleted');
                  props.handleClose();
                }}
              >
                <br />
                <br />
                <button className='button add-button' type='submit'>
                  Delete Post
                </button>
              </form>
            </div>
    
            <br />
            <br />
            <button
              className='button cancel-button'
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </button>
          </ReactModal>
        </div>
      );
    }

export default DetelePostModal;