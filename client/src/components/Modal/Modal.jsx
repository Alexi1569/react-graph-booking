import React from 'react';

import './Modal.css';

const Modal = props => {
  return (
    <div className='modal'>
      <header className='modal__header'>
        <h1>{props.title}</h1>
      </header>
      <section className='modal__content'>{props.children}</section>
      <section className='modal__actions'>
        {props.isCancel && (
          <button className='btn' onClick={props.onCancel}>
            Cancel
          </button>
        )}
        {props.isConfirm && (
          <button className='btn' onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )}
      </section>
    </div>
  );
};

export default Modal;
