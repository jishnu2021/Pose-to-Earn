import React from 'react';
import './Nft.css';
import nft1  from '../images/nft1.jpeg';
import nft2 from '../images/nft2.png';
import nft3 from '../images/nft3.jpeg';
import nft4 from '../images/nft4.jpeg';
import nft5 from '../images/nft5.jpeg';
import nft6 from '../images/nft6.jpeg';

const Nftpoints = () => {
  const nftList = [
    {
      id: 1,
      image: nft1,
      
    },
    {
      id: 2,
      image: nft2,
      
    },
    {
      id: 3,
      image: nft3,
      
    },
    {
      id: 4,
      image: nft4,
      
    },
    {
      id: 5,
      image: nft6,
      
    },
    {
      id: 6,
      image: nft6,
      
    },
    {
      id: 1,
      image: nft6,
      
    },
    {
      id: 2,
      image: nft5,
      
    },
    {
      id: 3,
      image: nft3,
      
    },
    {
      id: 4,
      image: nft2,
      
    },
    {
      id: 5,
      image: nft4,
      
    },
    {
      id: 6,
      image: nft5,
      
    },
    {
      id: 7,
      image: nft1,
      
    },
    {
      id: 8,
      image: nft2,
      
    },
    {
      id: 9,
      image: nft3,
      
    },
    {
      id: 10,
      image: nft4,
      
    },
    {
      id: 11,
      image: nft6,
      
    },
    {
      id: 12,
      image: nft6,
      
    },


    // Add more objects as needed
  ];

  return (
    <div className="image-grid-container">
      <div className="image-grid">
        {nftList.map((nftItem) => (
          <div className="image-item" key={nftItem.id}>
            <img src={nftItem.image} alt={`NFT ${nftItem.id}`} />
            <div className="details">
              <h4><b>{`NFT ${nftItem.id}`}</b></h4>
              {/* <p style={{ color: "blue" }}>Price: {nftItem.price}</p> */}
              {/* Additional details can be displayed here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nftpoints;