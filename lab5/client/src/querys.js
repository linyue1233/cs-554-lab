import { gql } from '@apollo/client';


const GET_UNSPLASHPOSTS = gql`
    query UnsplashImages($pageNum: Int){
        unsplashImages(pageNum: $pageNum){
            id
            url
            description
            posterName
            userPosted
            binned
        }
    }
`;


const UPDATE_IMAGETWITHBIN = gql`
    mutation UpdateImage(
        $id: ID!
        $url: String!
        $posterName: String!
        $description: String!
        $binned: Boolean!
        $userPosted: Boolean!
    ){
        updateImage(
            id: $id, 
            url: $url, 
            description: $description,
            posterName: $posterName, 
            userPosted: $userPosted, 
            binned: $binned){
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;


const SHOW_MYBIN = gql`
    query BinnedImages{
        binnedImages{
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;


const SHOW_MYPOST = gql`
    query UserPostedImages{
        userPostedImages{
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const DELETE_POST = gql`
    mutation DeleteImage(
        $id: ID!
    ){
        deleteImage(id: $id){
            id
            url
            posterName
            description
            userPosted
            binned
        }
}
`;


const UPLOAD_POST = gql`
    mutation UploadImage(
        $url: String!
        $posterName: String!
        $description: String!
    ){
        uploadImage(url: $url, posterName: $posterName, description: $description){
            id
            url
            posterName
            userPosted
            description
            binned
        }
    }
`;

let exported = {
    GET_UNSPLASHPOSTS,
    UPDATE_IMAGETWITHBIN,
    SHOW_MYBIN,
    SHOW_MYPOST,
    DELETE_POST,
    UPLOAD_POST
  };
  
  export default exported;



