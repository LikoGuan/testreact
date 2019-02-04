import React from "react";

const permissionsMap = [
  {
    role: "Admin",
    permissions: `Wallet - view / edit
Withdraw funds - view / add
User - view / add / edit / disable
Merchant profile - view / edit
Bank account - view / add / edit / delete
Invoice - view / add
Refund`
  },
  {
    role: "Manager",
    permissions: `Wallet - view / edit
Withdraw funds - view / add
User - view / add / edit / disable
Merchant profile - view
Bank account - view
Invoice - view / add
Refund`
  },
  {
    role: "Accountant",
    permissions: `Wallet - view / edit
Withdraw funds - view / add
User - view
Merchant profile - view
Bank account - view / add / edit / delete
Invoice - view
Refund`
  },
  {
    role: "Sales/Developer",
    permissions: `Wallet - view
Withdraw funds - view
User - view
Merchant profile - view
Bank account - view
Invoice - view / add`
  }
];

export default ({ showPermissionDescription, currentRole }) => (
  <div className="table-container" onClick={showPermissionDescription}>
    <table>
      <tbody>
        <tr>
          <th>Roles</th>
          <th>Permissions</th>
        </tr>
        {permissionsMap.map(({ role, permissions }) => (
          <tr key={role}>
            <th
              className={
                currentRole && role.toLowerCase().indexOf(currentRole) !== -1
                  ? "green"
                  : ""
              }
            >
              {role}
            </th>
            <th>
              <p>{permissions}</p>
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
