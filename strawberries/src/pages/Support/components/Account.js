import React from 'react';
import classnames from 'classnames';

const data = [
  {
    title: 'Change password',
    content: (
      <ul>
        <li>
          Login to{' '}
          <strong>
            <a href="/login" className="sp-link" target="__blank">
              ‘Latipay Merchant Portal’
            </a>
          </strong>{' '}
          by using your{' '}
          <span className="highlight">registered email and password</span>.
        </li>
        <li>
          Tap <strong>‘Account’</strong> on the top-right where you will find{' '}
          <strong>‘Change password’</strong>
          via the <strong>‘Your details’</strong> section.
        </li>
        <li>
          You can change your Latipay account password via{' '}
          <strong>‘Change password’</strong> button.
        </li>
      </ul>
    )
  },
  {
    title: 'Notifications',
    content: (
      <ul>
        <li>
          Login to{' '}
          <strong>
            <a href="/login" className="sp-link" target="__blank">
              ‘Latipay Merchant Portal’
            </a>
          </strong>{' '}
          by using your{' '}
          <span className="highlight">registered email and password</span>.
        </li>
        <li>
          Tap <strong>‘Account’</strong> on the top-right where you will find{' '}
          <strong>‘Notifications’</strong> via <strong>‘Your details’</strong>{' '}
          section.
        </li>
        <li>
          You can <strong>turn on/off</strong> your notifications via the{' '}
          <strong>‘Notifications’</strong> button.
        </li>
      </ul>
    )
  },
  {
    title: 'API key',
    content: (
      <ul>
        <li>
          Login to{' '}
          <strong>
            <a href="/login" className="sp-link" target="__blank">
              ‘Latipay Merchant Portal’
            </a>
          </strong>{' '}
          by using your{' '}
          <span className="highlight">registered email and password</span>.
        </li>
        <li>
          Tap <strong>‘Account’</strong> on the top-right where you will find{' '}
          <strong>‘API Key’</strong> via <strong>‘Your details’</strong>{' '}
          section.
        </li>
        <li>
          Tap the <strong>‘Show hidden value’</strong> button, you will get your{' '}
          <strong>User ID, Wallet ID and API key</strong> for online store
          integration.
        </li>
      </ul>
    )
  },
  {
    title: 'Add users',
    content: (
      <ul>
        <li>
          Login to{' '}
          <strong>
            <a href="/login" className="sp-link" target="__blank">
              ‘Latipay Merchant Portal’
            </a>
          </strong>{' '}
          by using your{' '}
          <span className="highlight">registered email and password</span>.
        </li>
        <li>
          Tap <img src="/sp-add-user.png" alt="ADD USERS" /> to fill up your new
          user name & email and assgin a role and which wallets they can access.
        </li>
        <li>
          Find the role permission details via{' '}
          <img src="/sp-permission.png" alt="Permission description" />.
        </li>
        <li>
          The new user will <strong>receive an invitation email</strong> to
          active their account and set up the account password.
        </li>
        <li>
          The new user can login{' '}
          <a href="/login" target="__blank" className="highlight">
            Latipay Merchant Portal
          </a>{' '}
          by their registered email and password.
        </li>
        <li>
          The new user can be edited or disabled via{' '}
          <img src="/sp-edit.png" alt="Edit" /> by their creator or admin.
        </li>
      </ul>
    )
  },
  {
    title: 'Add bank account',
    content: (
      <ul>
        <li>
          Login{' '}
          <strong>
            <a href="/login" className="sp-link" target="__blank">
              ‘Latipay Merchant Portal’
            </a>
          </strong>{' '}
          by using your{' '}
          <span className="highlight">registered email and password</span>.
        </li>
        <li>
          Tap <img src="/sp-add-bank.png" alt="ADD BANK ACCOUNT" /> to fill up
          your bank account name, bank name, bank account number and select the
          bank account currency.
        </li>
        <li>
          Tick <img src="/sp-set-default.png" alt="Set default account" /> so
          all the wallets using the selected currency will be settle to this
          bank account.
        </li>
        <li>
          Tap <img src="/sp-add-statement.png" alt="Add Bank Statement" /> to
          upload your bank statement to ensure your account information is
          correct and related to your business.
        </li>
        <li>
          The bank account verification will be taken 1-3 days by Latipay
          Support Team.
        </li>
      </ul>
    )
  }
];

const dataMap = data.reduce((result, item) => {
  result[item.title] = item.content;
  return result;
}, {});

const Component = ({ accountHow, withdraw, changeState }) => (
  <div>
    <h3>
      How to manage your Latipay account on the{' '}
      <a href="/login" target="__blank" className="highlight">
        Latipay Merchant Portal
      </a>?
    </h3>

    {data.map(({ title }) => (
      <button
        className={classnames('sp-btn', {
          'sp-btn--selected': accountHow === title
        })}
        onClick={changeState({ accountHow: title })}
      >
        {title}
      </button>
    ))}

    {dataMap[accountHow]}
  </div>
);

export default Component;
