import Page from '../components/Page';

export default ({ url }) =>
  <Page>
    <h1>{url.query.message || 'Welcome to Latipay'}</h1>
    <div />
    <style jsx>
      {`
        h1,
        div {
          text-align: center;
        }
      `}
    </style>
  </Page>;
