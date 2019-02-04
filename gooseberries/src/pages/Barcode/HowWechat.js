import React from 'react';

const How = () => (
  <div className="how">
    <h2>微信中如何打开付款码？</h2>
    <p>打开微信App，进入【我】-> 【钱包】-> 【收付款】界面</p>
    <div className="img-how">
      <img src="/how-wechat-0.png" alt="" />
      <p className="img-tip">点击 ‘我’，点击 ‘钱包’</p>
    </div>
    <div className="img-how">
      <img src="/how-wechat-1.png" alt="" />
      <p className="img-tip">点击 ’收付款</p>
    </div>
    <div className="img-how">
      <img src="/how-wechat-2.png" alt="" />
      <p className="img-tip">点击 ‘知道了’</p>
    </div>
    <div className="img-how">
      <img src="/how-wechat-3.png" alt="" />
      <p className="img-tip">得到付款码</p>
    </div>
  </div>
);

export default How;
