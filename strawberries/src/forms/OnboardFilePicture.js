import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import icons from "../icons";

import api from "../api";
import { s4 } from "../util";

async function upload(event, fields, oss, size, index, isAdd) {
  const filelist = event.target.files;
  if (filelist.length === 0) return;

  let existLength = fields.length;
  const all = fields.getAll();
  if (all) {
    const placeholderRecord = all.filter(
      item => item.temp === "outside" || item.temp === "inside"
    );
    existLength = existLength - placeholderRecord.length;
  }

  let filesIndex = [],
    hasLarge;

  for (let i = 0; i < filelist.length; i++) {
    const file = filelist.item(i);

    if (file.size > size) {
      hasLarge = true;
      break;
    }

    if (isAdd) {
      if (filesIndex.length + existLength < 6) {
        //传多图时限制
        filesIndex.push(i);
      }
    } else {
      filesIndex.push(i);
    }
  }

  if (hasLarge) {
    window.alert(`Maximum file size ${size / 1024 / 1024}M`);
  }

  if (filesIndex.length === 0) return;

  let uploadIndex = 0;
  for (let i = 0; i < filelist.length; i++) {
    if (filesIndex.indexOf(i) < 0) return;

    const file = filelist.item(i);

    // a random-ish file path,
    const filepath = `${oss.form.dir}${Date.now()}-${s4()}-${file.size}/${
      file.name
    }`;

    let record;
    let _index;
    const url = oss.host + "/" + filepath;

    if (isAdd) {
      const all = fields.getAll();
      let placeholderRecord;
      if (all) {
        placeholderRecord = all.find(
          item => item.temp === "outside" || item.temp === "inside"
        );
      }

      if (!placeholderRecord) {
        _index = existLength + uploadIndex; //fix bug: fields.length didn't change after push

        record = {
          uploading: true,
          progress: 0
        };
        fields.push(record);
      } else {
        _index = placeholderRecord.temp === "outside" ? 0 : 1;
        record = placeholderRecord;
      }

      uploadIndex = uploadIndex + 1;
    } else {
      _index = index;
      record = fields.get(_index);
    }

    // console.log(_index, record);

    uploadFile(fields, oss, file, filepath, url, record, _index);
  }
}

function uploadFile(fields, oss, file, filepath, url, recordConst, indexConst) {
  recordConst.uploading = true;
  recordConst.progress = 0;
  delete recordConst.temp;

  fields.remove(indexConst);
  fields.insert(indexConst, recordConst);

  const _uploadFile = async result => {
    delete recordConst.url;
    //show local file
    recordConst.file = result;

    fields.remove(indexConst);
    fields.insert(indexConst, recordConst);

    //upload
    await api.documents.upload(oss, file, filepath, progressEvent => {
      recordConst.progress = progressEvent.loaded / progressEvent.total;

      fields.remove(indexConst);
      fields.insert(indexConst, recordConst);
    });
    recordConst.uploading = false;

    //update new name and url
    recordConst.name = file.name;
    recordConst.url = url;

    delete recordConst.file; //文件太大 不宜放在redux中，需要删除
    delete recordConst.uploading;
    delete recordConst.progress;

    fields.remove(indexConst);
    fields.insert(indexConst, recordConst);
  };

  const reader = new FileReader();
  if (reader) {
    reader.onloadend = () => {
      _uploadFile(reader.result);
    };
    reader.readAsDataURL(file);
  } else {
    _uploadFile();
  }
}

function createButton(id, inputName, fields, oss, size, index, isAdd, accept) {
  return (
    <div className="onboard-pic-item-container" key={index}>
      <input
        type="file"
        id={inputName}
        name={inputName}
        accept={accept}
        onChange={event => {
          event.preventDefault();
          upload(event, fields, oss, size, index, true);
        }}
        onClick={event => {
          //fix: can upload repeat file
          event.target.value = null;
        }}
      />

      <label className="onboard-pic-item" htmlFor={inputName}>
        <div className="button-icon">{icons.addFile}</div>
      </label>
    </div>
  );
}

const FileList = ({
  id,
  label,
  labelTips,
  fields = [],
  footer,
  footer2,
  meta: { touched, error, submitFailed },
  dirty,
  oss,
  size = 10 * 1024 * 1024,
  showSimple,
  addPicIcon,
  addPicText,
  trial,
  accept = "image/*",
  className,
  min = 1,
  max = 1,
  labelRef,
  labelHeight
}) => {
  return (
    <div
      className={classNames(`lat-file ${className}`, {
        "has-warning": (touched || submitFailed) && error
      })}
    >
      <label
        className="control-label"
        htmlFor={id}
        ref={labelRef}
        style={{ minHeight: labelHeight + "px" }}
      >
        {label}
        {labelTips && <span>{labelTips}</span>}
      </label>

      {showSimple && (
        <div className="onboard-sample-link" onClick={showSimple}>
          Sample
        </div>
      )}

      <div className="onboard-pic-container">
        {fields.map((_, index) => {
          const { file, url, uploading, progress = 1 } = fields.get(index);

          const inputName = id + "." + index;

          const hasFile = file !== undefined;
          return (
            <div
              className="onboard-pic-item-container"
              style={
                index < 3 && fields.length > 2 ? { marginBottom: "20px" } : {}
              }
              key={index}
            >
              <input
                type="file"
                id={inputName}
                name={inputName}
                accept={accept}
                disabled={uploading}
                onChange={event => {
                  event.preventDefault();
                  upload(event, fields, oss, size, index);
                }}
              />

              <label className="onboard-pic-item" htmlFor={inputName}>
                <img
                  style={{ backgroundImage: `url("${hasFile ? file : url}")` }}
                  alt=""
                />
                {progress < 1 && (
                  <span
                    style={{
                      width: `${progress * 100}%`,
                      background: "#6BBF70",
                      height: "5px",
                      position: "absolute",
                      top: 0
                    }}
                  >
                    {" "}
                  </span>
                )}
              </label>

              {url && (
                <div
                  className="onbaord-pic-remove-btn"
                  onClick={event => {
                    fields.remove(index);
                    if (trial) {
                      if (index === 0) {
                        fields.insert(index, { temp: "outside" });
                      } else if (index === 1) {
                        fields.insert(index, { temp: "inside" });
                      }
                    }
                  }}
                >
                  {icons.removePic}
                </div>
              )}
            </div>
          );
        })}

        {fields.length < max &&
          createButton(
            id,
            `${id}.${fields.length}`,
            fields,
            oss,
            size,
            undefined,
            true,
            accept
          )}
      </div>

      <div className="onboard-pic-footer">
        {footer2 && <p className="explain">{footer2}</p>}
        <p>{footer}</p>
      </div>
    </div>
  );
};

export default connect(({ oss, ossTemp }) => {
  if (oss && Object.keys(oss).length > 0) {
    return { oss };
  } else {
    return { oss: ossTemp };
  }
})(FileList);
