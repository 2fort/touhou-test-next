import React, { PropTypes } from 'react';
import { classes } from 'typestyle';
import * as style from './TableTools.style';

const Table = ({ children, className, fixed }) => {
  const finalStyle = [];

  if (fixed) {
    finalStyle.push(style.table.fixed);
  }

  return (
    <table className={classes(...finalStyle, className)}>
      {children}
    </table>
  );
};

Table.defaultProps = {
  className: '',
  fixed: false,
};

Table.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fixed: PropTypes.bool,
};


const Th = ({ children, className, center }) => {
  const finalStyle = [];

  if (center) {
    finalStyle.push('text-center');
  }

  return (
    <th className={classes(...finalStyle, className)}>
      {children}
    </th>
  );
};

Th.defaultProps = {
  className: '',
  center: false,
};

Th.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  center: PropTypes.bool,
};


const Td = ({ children, className, w, center, withImage, tooWide, tooShort }) => {
  const finalStyle = [];

  if (w) {
    finalStyle.push(style.td.width(w));
  }

  if (center) {
    finalStyle.push('text-center');
  }

  if (withImage) {
    finalStyle.push(style.td.withImage);
  }

  if (tooWide) {
    finalStyle.push(style.td.tooWide);
  }

  if (tooShort) {
    finalStyle.push(style.td.tooShort);
  }

  return (
    <td className={classes(...finalStyle, className)}>
      {children}
    </td>
  );
};

Td.defaultProps = {
  className: '',
  w: 0,
  center: false,
  withImage: false,
  tooWide: false,
  tooShort: false,
};

Td.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  w: PropTypes.number,
  center: PropTypes.bool,
  withImage: PropTypes.bool,
  tooWide: PropTypes.bool,
  tooShort: PropTypes.bool,
};


const Tbody = ({ children, className, pending }) => {
  const finalStyle = [];

  if (pending) {
    finalStyle.push(style.tbody.loading);
  }

  if (!children) {
    return null;
  }

  return (
    <tbody className={classes(...finalStyle, className)}>
      {children}
    </tbody>
  );
};

Tbody.defaultProps = {
  children: '',
  className: '',
  pending: false,
};

Tbody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  pending: PropTypes.bool,
};


const TableTools = {
  Table: props => <Table {...props} />,
  Th: props => <Th {...props} />,
  Td: props => <Td {...props} />,
  Tbody: props => <Tbody {...props} />,
};

export default TableTools;
