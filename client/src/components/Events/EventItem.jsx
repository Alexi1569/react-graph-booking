import React from 'react';

import './EventItem.css';

const EventItem = ({
  _id,
  title,
  price,
  userId,
  creator,
  date,
  showDetail
}) => {
  return (
    <li className='events__list-item'>
      <div>
        <h1>{title}</h1>
        <h2>
          ${price} - {new Date(date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {userId === creator._id ? (
          <p>Your the owner of this event</p>
        ) : (
          <button className='btn' onClick={() => showDetail(_id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
