import React from 'react';
import classNames from 'classnames';

export default ({step, gotoStep}) => {
    return (
        <div className="row">
            {[1, 2, 3, 4, 5].map(item => (
                <h3
                    key={item}
                    className={classNames('col-md-5ths onboard-step', {selected: step >= item})}
                    // onClick={gotoStep(item)}
                >
                    {step === item ? item : ''}
                </h3>
            ))}
        </div>
    );
};
