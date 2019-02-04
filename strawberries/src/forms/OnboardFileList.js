import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import icons from "../icons";

import api from "../api";
import { s4 } from "../util";
import { locale, messages } from "../i18n";

const localized = (key, message) => messages[locale][key] || message || key;

const shrinkFilename = (text, count) => {
  let file_ext = "";
  if (text.lastIndexOf(".") >= 0) {
    file_ext = text.substring(text.lastIndexOf(".") + 1);
    if (file_ext) {
      file_ext = "." + file_ext;
    }
  }
  if (text.length - file_ext.length > count) {
    return text.substring(0, count) + "..." + file_ext;
  }
  return text;
};

async function upload(event, fields, oss, size) {
  const file = event.target.files[0];
  if (!file) return;
  if (size && file.size > size) {
    window.alert(`File size cannot be bigger than ${size / 1024 / 1024}M`);
    return;
  }
  // a random-ish file path,
  const filePath = `${oss.form.dir}${Date.now()}-${s4()}-${file.size}/${
    file.name
  }`;

  const record = {
    name: file.name,
    url: oss.host + "/" + filePath,
    uploading: true
  };
  fields.push(record);

  const index = fields.length;

  await api.documents.upload(oss, file, filePath);
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
  title = "Add attachment",
  id
}) => (
  <div
    className={classNames("lat-file", {
      "has-warning": (touched || submitFailed) && error
    })}
  >
    <input
      type="file"
      name="file"
      id={id + "_file"}
      onChange={event => {
        event.persist();
        upload(event, fields, oss, size);
      }}
    />

    {max && fields.length < max && (
      <label
        className="btn btn-sm btn-primary btn-nocapital"
        htmlFor={id + "_file"}
      >
        {/*<div className="button-icon">{icons.add}</div>*/}
        {title}
      </label>
    )}

    {!max && (
      <label
        className="btn btn-sm btn-primary btn-nocapital"
        htmlFor={id + "_file"}
      >
        {/*<div className="button-icon">{icons.add}</div>*/}
        {title}
      </label>
    )}

    {fields.map((member, index) => {
      const { url, name, uploading } = fields.get(index);
      return (
        <div key={index} className="row">
          <div className="col-xs-10">
            {uploading ? (
              <span>
                {shrinkFilename(name, 15, true)} [
                {localized("upload.filelist.uploading", "Uploading")}...]
              </span>
            ) : (
              <a
                href={uploading ? "" : url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shrinkFilename(name, 15, true)}
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

export default connect(({ ossTemp }) => ({ ossTemp }))(FileList);
