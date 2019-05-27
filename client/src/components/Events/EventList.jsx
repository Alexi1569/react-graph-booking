import React from 'react';

import './EventList.css';
import EventItem from './EventItem';

const EventList = ({ events, userId, showDetail }) => {
  const eventsList = events.map(event => {
    return (
      <EventItem
        showDetail={showDetail}
        userId={userId}
        key={event._id}
        {...event}
      />
    );
  });

  return <ul className='events__list'>{eventsList}</ul>;
};

export default EventList;
