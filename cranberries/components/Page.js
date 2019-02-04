import Footer from './Footer';

export default ({ children }) => (
  <div className="fullscreen dark">
    <div className="container">
      {children}
      <style jsx>{`
        div {
          margin-top: 3em;
        }
        .light {
          background-color: #eaf0f6;
        }
      `}</style>
    </div>
    <Footer isDark={true} />
  </div>
);
