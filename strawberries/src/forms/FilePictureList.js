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
    hasLarge,
    hasSmall;
  for (let i = 0; i < filelist.length; i++) {
    const file = filelist.item(i);

    if (file.size > size) {
      hasLarge = true;
      break;
    }
    const DEPLOY_ENV = process.env.REACT_APP_DEPLOY_ENV;
    if (DEPLOY_ENV === "prod" && file.size < 500 * 1024) {
      hasSmall = true;
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

  if (hasSmall) {
    window.alert(`Minimum file size 500kb`);
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

const defaultButtonConfig = [
  {
    icon: icons.pic,
    title: "Store Outside"
  },
  {
    icon: icons.pic,
    title: "Store Inside"
  },
  {
    icon: icons.addPic,
    title: "More Photos"
  }
];

function createOutsideButton(id, fields, oss, size, itemStyle, accept) {
  const inputName = id + ".0";
  const config = defaultButtonConfig[0];
  return createButton(
    id,
    inputName,
    config.icon,
    config.title,
    fields,
    oss,
    size,
    0,
    itemStyle,
    false,
    accept
  );
}

function createInsideButton(id, fields, oss, size, itemStyle, accept) {
  const inputName = id + ".1";
  const config = defaultButtonConfig[1];
  return createButton(
    id,
    inputName,
    config.icon,
    config.title,
    fields,
    oss,
    size,
    1,
    itemStyle,
    false,
    accept
  );
}

function createButton(
  id,
  inputName,
  icon,
  title,
  fields,
  oss,
  size,
  index,
  itemStyle,
  isAdd,
  accept
) {
  return (
    <div className="onboard-pic-item-container" style={itemStyle} key={index}>
      {isAdd ? (
        <input
          type="file"
          id={inputName}
          name={inputName}
          accept={accept}
          onChange={event => {
            event.preventDefault();
            upload(event, fields, oss, size, index, true);
          }}
          multiple
          onClick={event => {
            //fix: can upload repeat file
            event.target.value = null;
          }}
        />
      ) : (
        <input
          type="file"
          id={inputName}
          name={inputName}
          accept={accept}
          onChange={event => {
            event.preventDefault();
            upload(event, fields, oss, size, index, isAdd);
          }}
          onClick={event => {
            //fix: can upload repeat file
            event.target.value = null;
          }}
        />
      )}

      <label className="onboard-pic-item" htmlFor={inputName}>
        <div className="button-icon">{icon}</div>
        <div>{title}</div>
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
  meta: { touched, error, submitFailed },
  dirty,
  oss,
  size = 7 * 1024 * 1024,
  pictureContainerWidth,
  showSimple,
  addPicIcon,
  addPicText,
  trial,
  accept = "image/*"
}) => {
  const margin = `${Math.floor(0.025 * pictureContainerWidth)}px`;

  const itemStyleWithBtmMargin = pictureContainerWidth
    ? {
        width: `${Math.floor(0.3 * pictureContainerWidth)}px`,
        margin: `0 ${margin} ${margin} ${margin}`
      }
    : {};

  const itemStyleWithoutBtmMargin = pictureContainerWidth
    ? {
        width: `${Math.floor(0.3 * pictureContainerWidth)}px`,
        margin: `0 ${margin} 0 ${margin}`
      }
    : {};

  const count = fields.length;

  return (
    <div
      className={classNames("lat-file", {
        "has-warning": (touched || submitFailed) && error
      })}
    >
      <label className="control-label" htmlFor={id}>
        {label}
        <span>{labelTips}</span>
      </label>

      {showSimple && (
        <div className="onboard-sample-link" onClick={showSimple}>
          Sample
        </div>
      )}

      <div className="onboard-pic-container">
        {fields.map((_, index) => {
          const { file, url, uploading, progress = 1, temp } = fields.get(
            index
          );

          if (temp === "outside") {
            return createOutsideButton(
              id,
              fields,
              oss,
              size,
              itemStyleWithoutBtmMargin,
              accept
            );
          } else if (temp === "inside") {
            return createInsideButton(
              id,
              fields,
              oss,
              size,
              itemStyleWithoutBtmMargin,
              accept
            );
          }

          const inputName = id + "." + index;

          const hasFile = file !== undefined;
          return (
            <div
              className="onboard-pic-item-container"
              style={
                index < 3 && count > 2
                  ? itemStyleWithBtmMargin
                  : itemStyleWithoutBtmMargin
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

        {fields.length < 6 &&
          createButton(
            id,
            `${id}.${fields.length}`,
            addPicIcon || defaultButtonConfig[2].icon,
            addPicText || defaultButtonConfig[2].title,
            fields,
            oss,
            size,
            undefined,
            itemStyleWithoutBtmMargin,
            true,
            accept
          )}
      </div>

      <div className="onboard-pic-footer">{footer}</div>
    </div>
  );
};

export default connect(({ oss }) => ({ oss }))(FileList);
