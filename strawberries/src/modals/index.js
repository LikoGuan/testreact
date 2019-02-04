import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import Icons from '../icons';
import './index.css';

const modal = ({ title, onHide, children, ...props }) => {
  return (
    <Modal {...props} onHide={onHide} dialogClassName="light" bsClass="modal" backdrop={true}>
      <Modal.Header>
        <Modal.Title componentClass="h2">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <a onClick={onHide}>{Icons.close}</a>
              &nbsp;
              {title}
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-10 col-md-offset-1">{children}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

modal.propTypes = {
  title: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default modal;

export const FullScreen = ({ onHide, children, ...props }) => {
  return (
    <Modal {...props} onHide={onHide} dialogClassName="light" bsClass="full-modal modal" backdrop={true}>
      <Modal.Body>
        <div className="row">
          <div className="col-md-10 col-md-offset-1">{children}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
