import React from 'react';
import icons from '../icons';
export default ({ onAddFile, files, onRemoveFile }) =>
  <div className="lat-file">
    <input type="file" name="file" id="file" onChange={onAddFile} multiple />
    <label className="btn btn-sm btn-primary" htmlFor="file">
      <div className="button-icon">{icons.add}</div>
      Add attachment
    </label>
    {files.map((file, i) =>
      <div key={i} className="row">
        <div className="col-xs-11">
          {file.name}
        </div>
        <div className="col-xs-1">
          <div onClick={() => onRemoveFile(i)}>
            {icons.bin}
          </div>
        </div>
      </div>
    )}
  </div>;
