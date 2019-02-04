import React from 'react';
import classnames from 'classnames';

const Step = ({ step, changeState }) => (
  <div className="sp-steps">
    {['Transaction', 'Status', 'Refund', 'Settlement', 'Account'].map(
      (item, index) => (
        <div
          key={index}
          className={classnames('step', {
            'step--green': index < step,
            'step--blue': index === step,
            'step--gray': index > step
          })}
          onClick={changeState({ step: index })}
        >
          {index > 0 && <span className="line" />}
          {index === step && <span className="dot" />}
          <div className="text">{item}</div>
        </div>
      )
    )}
  </div>
);

export default Step;
