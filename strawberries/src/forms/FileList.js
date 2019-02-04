import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import icons from "../icons";

import api from "../api";
import { s4 } from "../util";

async function upload(event, fields, oss, size) {
  const file = event.target.files[0];
  console.log("file", file);
  if (!file) return;
  if (size && file.size > size) {
    window.alert(`文件必须小于${size / 1024 / 1024}M`);
    return;
  }
  // a random-ish file path,
  const filepath = `${oss.form.dir}${Date.now()}-${s4()}-${file.size}/${
    file.name
  }`;

  const record = {
    name: file.name,
    url: oss.host + "/" + filepath,
    uploading: true
  };
  fields.push(record);

  const index = fields.length;

  await api.documents.upload(oss, file, filepath);
  record.uploading = false;
  fields.remove(index);
  fields.insert(index, record);
}

const onDelete = (fields, index) => {
  fields.remove(index);
};

const FileList = ({
  fields,
  meta: { touched, error, submitFailed },
  dirty,
  oss,
  size,
  max,
  title = "Add attachment"
}) => (
  <div
    className={classNames("lat-file", {
      "has-warning": (touched || submitFailed) && error
    })}
  >
    <input
      type="file"
      name="file"
      id="file"
      onChange={event => {
        event.persist();
        upload(event, fields, oss, size);
      }}
    />

    {max && fields.length < max && (
      <label className="btn btn-sm btn-primary btn-nocapital" htmlFor="file">
        <div className="button-icon">{icons.add}</div>
        {title}
      </label>
    )}

    {!max && (
      <label className="btn btn-sm btn-primary btn-nocapital" htmlFor="file">
        <div className="button-icon">{icons.add}</div>
        {title}
      </label>
    )}

    {fields.map((member, index) => {
      const { url, name, uploading } = fields.get(index);
      return (
        <div key={index} className="row">
          <div className="col-xs-10">
            {uploading ? (
              <span>{name} [uploading...]</span>
            ) : (
              <a
                href={uploading ? "" : url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
            )}
          </div>
          <div className="col-xs-2">
            <div onClick={_ => onDelete(fields, index)}>{icons.bin}</div>
          </div>
        </div>
      );
    })}

    {(touched || submitFailed) && error && (
      <span className="help-block">{error}</span>
    )}
  </div>
);

export default connect(({ oss }) => ({ oss }))(FileList);
