import React from 'react';

export default ({ to, source }) => {
    const customLogoStyle = {
        marginLeft: "20px"
    };
    const imgPath = '/logos/' + source + '.png';
    return (
        <a style={customLogoStyle} className="lat-logo" href={to} target="_blank">
            <img src={imgPath} width="100" alt={source} />
        </a>
    );
};
