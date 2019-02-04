import React from 'react';

import Table from 'react-toolbox/lib/table/Table';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Button from 'react-toolbox/lib/button/Button';

import Attachment from './Attachment';

const Detail = ({active, cancelModal, info, approveInvoice, needShowAttachment, handleAttachment,
  needShowApproveButton, message, attachments}) => {
  
    return (
      <Dialog
  active={active}
  onEscKeyDown={cancelModal}
  onOverlayClick={cancelModal}
  title="Transaction Detail"
>
  <Table className="table-sm transaction-table" selectable={false}>
    {info.slice(0, info.length - 9).map(row => (
      <TableRow className="transaction-detail-row" key={row.name}>
        <TableCell className="transaction-detail-row__name">
          {row.name}
        </TableCell>
        <TableCell className="transaction-detail-row__value">
          {row.value.join(row.joinSeparator)}
        </TableCell>
      </TableRow>
    ))}
  </Table>
  <Table className="table-sm transaction-table" selectable={false}>
    {info.slice(info.length - 9, info.length - 5).map(row => (
      <TableRow className="transaction-detail-row" key={row.name}>
        <TableCell className="transaction-detail-row__name">
          {row.name}
        </TableCell>
        <TableCell className="transaction-detail-row__value">
          {row.value.join(row.joinSeparator)}
        </TableCell>
      </TableRow>
    ))}
  </Table>
  <Table className="table-sm transaction-table" selectable={false}>
    {info.slice(info.length - 5, info.length - 3).map(row => (
      <TableRow className="transaction-detail-row" key={row.name}>
        <TableCell className="transaction-detail-row__name">
          {row.name}
        </TableCell>
        <TableCell className="transaction-detail-row__value">
          {row.value.join(row.joinSeparator)}
        </TableCell>
      </TableRow>
    ))}
  </Table>
  <Table className="table-sm transaction-table" selectable={false}>
    {info.slice(info.length - 3).map(row => (
      <TableRow className="transaction-detail-row" key={row.name}>
        <TableCell className="transaction-detail-row__name">
          {row.name}
        </TableCell>
        <TableCell className="transaction-detail-row__value">
          {row.value.join(row.joinSeparator)}
        </TableCell>
      </TableRow>
    ))}
  </Table>

  { needShowAttachment && 
    <Attachment onSubmit={handleAttachment} initialValues={{attachments: attachments}}/>}

  {needShowApproveButton && (
      <Button
        className="btn--approve"
        label="Approve"
        onClick={approveInvoice}
        raised
        primary
      />
  )}

  <div className="message--error">{message}</div>
</Dialog>);

}

export default Detail;