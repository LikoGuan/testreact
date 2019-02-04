import React from 'react';
import { connect } from 'react-redux';
import BrowseButton from 'react-toolbox/lib/button/BrowseButton.js';
import Chip from 'react-toolbox/lib/chip/Chip';
import Avatar from 'react-toolbox/lib/avatar/Avatar';

import api from '../../api';
import { debounce, s4 } from '../../util';

const upload = debounce(async function(event, fields, oss) {
  const file = event.target.files[0];
  if (!file) return;
  // a random-ish file path,
  const filepath = `${oss.form.dir}${Date.now()}-${s4()}-${file.size}`;

  const record = {
    name: file.name,
    url: oss.host + '/' + filepath,
    uploading: true,
  };
  fields.push(record);

  const index = fields.length;

  await api.documents.upload(oss, file, filepath);
  record.uploading = false;
  fields.remove(index);
  fields.insert(index, record);
}, 250);

const onDelete = (fields, index) => {
  fields.remove(index);
};

const FileList = ({ fields, meta: { error, submitFailed }, oss }) =>
  <div>
    {fields.length === 0 &&
      <BrowseButton
        icon="add"
        flat
        primary
        label="Add Attachment"
        onChange={event => {
          event.persist();
          upload(event, fields, oss);
        }}
      />
    }

    {fields.map((member, index) => {
      if (index > 0) return null;

      const { url, name, uploading } = fields.get(index);
      return (
        <Chip key={index} deletable onDeleteClick={_ => onDelete(fields, index)}>
          <Avatar style={{ backgroundColor: 'deepskyblue' }} icon={uploading ? 'cloud_upload' : 'folder'} />
          {uploading
            ? <span>
                {name}(uploading...)
              </span>
            : <a href={uploading ? '' : url} target="_blank" rel="noopener noreferrer">
                {name}
              </a>}
        </Chip>
      );
    })}
  </div>;

export default connect(({ oss }) => ({ oss }))(FileList);
