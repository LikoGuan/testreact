import React, { Component } from "react";
import QRCode from "qrcode.react";
import { getDateTimeDisplay } from "../../util";
import api from "../../api";

import "./index.css";

const boardSize = { width: 1240, height: 1748 };

const qrWidth = (200 / 400) * boardSize.width;

class Page extends Component {
  constructor(props) {
    super(props);

    const queryString = new URLSearchParams(this.props.location.search);
    const userId = queryString.get("userId");
    const walletId = queryString.get("walletId");

    if (userId && walletId) {
      this.state = {
        text: `https://spotpay.latipay.net/static_qr/${userId}/${walletId}`,
        logo: ""
      };

      api.staticPay.getInfo(false, userId, walletId).then(response => {
        if (response.data && response.data.code === 0 && response.data.data) {
          this.setState({
            walletName: response.data.data.accountName
          });
        }
      });
    } else {
      this.state = {
        text: "https://spotpay.latipay.net/static_qr/",
        logo: ""
      };
    }
  }

  componentWillMount() {
    const script = document.createElement("script");
    script.src = "/pdfkit.min.js";
    script.async = true;
    document.body.appendChild(script);

    const script2 = document.createElement("script");
    script2.src = "/blob-stream.js";
    script2.async = true;
    document.body.appendChild(script2);
  }

  onChange = e => {
    const text = e.target.value;
    this.setState({
      text,
      walletName: ""
    });

    const isStaging = text.indexOf("-staging") !== -1;
    const arr = text.split("/");
    const userId = arr[arr.length - 2];
    const walletId = arr[arr.length - 1];

    if (
      userId &&
      userId.indexOf("U00") === 0 &&
      walletId &&
      walletId.indexOf("W00") === 0
    ) {
      api.staticPay.getInfo(isStaging, userId, walletId).then(response => {
        if (response.data && response.data.code === 0 && response.data.data) {
          this.setState({
            walletName: response.data.data.accountName
          });
        }
      });
    }
  };

  buildPicture = callback => {
    const { logo, walletName } = this.state;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const backgroundImg = loadImage("/qr_code_board1.svg", main);

    const dataURL = this.qrCode._canvas.toDataURL();
    const qrcodeImg = loadImage(dataURL, main);

    const logoImg = loadImage(logo, main);

    const totalCount = logo.length > 0 ? 3 : 2;

    let count = 0;
    function main() {
      count += 1;

      if (count === totalCount) {
        const picWidth = boardSize.width;
        canvas.width = picWidth;
        canvas.height = boardSize.height;

        const qrTop = 595;
        // composite now
        ctx.drawImage(backgroundImg, 0, 0, boardSize.width, boardSize.height);
        ctx.drawImage(
          qrcodeImg,
          (picWidth - qrWidth) * 0.5,
          qrTop,
          qrWidth,
          qrWidth
        );

        if (logoImg) {
          const boardDomHeight = 400;
          const logoHeight = (40 / boardDomHeight) * boardSize.width;
          const maxWidth = (70 / boardDomHeight) * boardSize.width;
          const logoWidth = Math.min(
            (logoImg.width / logoImg.height) * logoHeight,
            maxWidth
          );

          ctx.strokeStyle = "#FFF";
          ctx.fillStyle = "#FFF";
          const lineWidth = 4;
          ctx.lineWidth = lineWidth;

          const left = (picWidth - logoWidth) * 0.5;
          const top = qrTop + (qrWidth - logoHeight) * 0.5;
          roundRect(
            ctx,
            left - lineWidth,
            top - lineWidth,
            logoWidth + lineWidth * 2,
            logoHeight + lineWidth * 2,
            lineWidth * 2,
            true
          );

          ctx.drawImage(logoImg, left, top, logoWidth, logoHeight);
        }

        if (walletName) {
          ctx.font =
            "78px Titillium Web, PingFang SC, -apple-system, BlinkMacSystemFont, Microsoft YaHei, sans-serif";
          ctx.textAlign = "center";
          ctx.fillStyle = "black";
          ctx.fillText(walletName, canvas.width / 2, 200);
        }

        callback(canvas);
      }
    }

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof stroke === "undefined") {
        stroke = true;
      }
      if (typeof radius === "undefined") {
        radius = 5;
      }
      if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }
      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
      );
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
      if (fill) {
        ctx.fill();
      }
      if (stroke) {
        ctx.stroke();
      }
    }

    function loadImage(src, onload) {
      const img = new Image();

      img.onload = onload;
      img.src = src;

      return img;
    }
  };

  downloadPicture = () => {
    this.buildPicture(canvas => {
      const { text } = this.state;

      const link = document.createElement("a");
      const name = text.replace("https://spotpay.latipay.net/static_qr/", "");
      const timeName = getDateTimeDisplay(new Date())
        .replace(":", "-")
        .replace(":", "-")
        .replace(":", "-");
      link.setAttribute(
        "download",
        (name.length === 0 ? timeName : name) + ".png"
      );

      link.setAttribute(
        "href",
        canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
      );
      link.click();
    });
  };

  downloadPdf = () => {
    this.buildPicture(canvas => {
      const pdf = new window.PDFDocument();

      const c = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      console.log("c", pdf);

      const { width, height } = pdf.page;

      pdf.image(c, 10, 10, {
        fit: [width * 0.5, height * 0.5],
        align: "center",
        valign: "center"
      });

      const stream = pdf.pipe(window.blobStream());

      pdf.end();

      stream.on("finish", () => {
        const { text } = this.state;

        const link = document.createElement("a");
        const name = text.replace("https://spotpay.latipay.net/static_qr/", "");
        const timeName = getDateTimeDisplay(new Date())
          .replace(":", "-")
          .replace(":", "-")
          .replace(":", "-");
        link.setAttribute(
          "download",
          (name.length === 0 ? timeName : name) + ".pdf"
        );

        const url = stream.toBlobURL("application/pdf");

        link.setAttribute("href", url);
        link.click();
      });
    });
  };

  onFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      const _this = this;
      reader.onload = function(e) {
        _this.setState({
          logo: e.target.result
        });
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  render() {
    const { text, logo, walletName } = this.state;

    return (
      <div className="qr_root">
        <div className="qr_container">
          <img
            className="qr_background"
            src="/qr_code_board1.svg?b"
            alt="board"
          />
          <h3 className="title">{walletName}</h3>
          <div className="qr_code">
            <QRCode
              value={text}
              size={qrWidth}
              fgColor="#2b3561"
              bgColor="#FFF"
              ref={dom => {
                this.qrCode = dom;
              }}
            />
          </div>
          {logo && <img className="qr_logo" src={logo} alt="logo" />}
        </div>

        <input
          className="qr_input"
          value={text}
          type="text"
          placeholder="https://"
          onChange={this.onChange}
        />
        <input
          className="qr_logo_input"
          type="file"
          accept="image/*"
          onChange={this.onFileChange}
        />

        <button className="btn btn-primary" onClick={this.downloadPicture}>
          Download Picture
        </button>
        <button className="btn btn-primary" onClick={this.downloadPdf}>
          Download Pdf
        </button>
      </div>
    );
  }
}

export default Page;
