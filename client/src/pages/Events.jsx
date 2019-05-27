import React, { Component } from 'react';

import './Events.css';
import Modal from '../components/Modal/Modal';
import BackDrop from '../components/BackDrop/BackDrop';
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth';

class Events extends Component {
  constructor(props) {
    super(props);

    this.titleRef = React.createRef();
    this.priceRef = React.createRef();
    this.dateRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  state = {
    isOpenCreateModal: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  static contextType = AuthContext;

  openCreateEventModal = () => {
    this.setState({
      isOpenCreateModal: true
    });
  };

  onConfirm = e => {
    this.setState({
      isOpenCreateModal: false
    });

    const title = this.titleRef.current.value;
    const price = parseFloat(this.priceRef.current.value);
    const date = this.dateRef.current.value;
    const description = this.descriptionRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };

    const req = {
      query: `
        mutation {
          createEvent(event: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            price
          }
        }
    `
    };

    const token = this.context.token;

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(req),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }

        return res.json();
      })
      .then(data => {
        this.setState(prevState => {
          const updatedEvents = [...prevState.events];

          updatedEvents.push({
            _id: data.data.createEvent._id,
            title: data.data.createEvent.title,
            description: data.data.createEvent.description,
            date: data.data.createEvent.date,
            price: data.data.createEvent.price,
            creator: {
              _id: this.context.userId
            }
          });

          return {
            events: updatedEvents
          };
        });
      })
      .catch(err => console.log(err));
  };

  onCancel = e => {
    this.setState({
      isOpenCreateModal: false,
      selectedEvent: null
    });
  };

  fetchEvents = () => {
    this.setState({
      isLoading: true
    });

    const req = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
    `
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(req),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }

        return res.json();
      })
      .then(data => {
        this.setState({
          events: data.data.events,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isLoading: false
        });
      });
  };

  showDetail = id => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === id);

      return {
        selectedEvent
      };
    });
  };

  onConfirmBooking = e => {
    e.preventDefault();
  };

  componentDidMount() {
    this.fetchEvents();
  }

  render() {
    const eventsList = this.state.events.map(event => {
      return (
        <li className='events__list-item' key={event._id}>
          {event.title}
        </li>
      );
    });

    return (
      <React.Fragment>
        {this.state.isOpenCreateModal && (
          <React.Fragment>
            <BackDrop />
            <Modal
              onConfirm={this.onConfirm}
              onCancel={this.onCancel}
              title='Add event'
              isCancel
              isConfirm
              confirmText='Confirm'
            >
              <form>
                <div className='form-control'>
                  <label htmlFor='title'>Title</label>
                  <input ref={this.titleRef} type='text' id='title' />
                </div>
                <div className='form-control'>
                  <label htmlFor='price'>Price</label>
                  <input ref={this.priceRef} type='number' id='price' />
                </div>
                <div className='form-control'>
                  <label htmlFor='date'>Date</label>
                  <input ref={this.dateRef} type='date' id='date' />
                </div>
                <div className='form-control'>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    ref={this.descriptionRef}
                    rows='4'
                    id='description'
                  />
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}

        {this.state.selectedEvent && (
          <React.Fragment>
            <BackDrop />
            <Modal
              onConfirm={this.onConfirmBooking}
              onCancel={this.onCancel}
              title={this.state.selectedEvent.title}
              isCancel
              isConfirm
              confirmText='Book Now'
            >
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>
                ${this.state.selectedEvent.price} -
                {new Date(this.state.selectedEvent.date).toLocaleDateString()}
              </h2>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          </React.Fragment>
        )}

        {this.context.token && (
          <div className='events-control'>
            <p>Share your own Events!</p>
            <button className='btn' onClick={this.openCreateEventModal}>
              Create event
            </button>
          </div>
        )}

        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.events.length === 0 ? (
          <p>No events</p>
        ) : (
          <EventList
            showDetail={this.showDetail}
            userId={this.context.userId}
            events={this.state.events}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Events;
