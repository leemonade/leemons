import React from 'react';
import PropTypes from 'prop-types';

function ClassTable({ data }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Class name</th>
              {data?.showType && <th>Type</th>}
              {data?.showColors && <th></th>}
              <th></th>
            </tr>
          </thead>
          <tbody className="font-inter">
            {Array.isArray(data?.components) &&
              data.components.map((item, index) => (
                <tr key={`c-${index}`}>
                  <th className="font-normal">
                    <span className="lowercase font-medium">{item.class}</span>
                  </th>
                  {data?.showType && (
                    <td>
                      <span className="badge badge-sm badge-success w-20">Component</span>
                    </td>
                  )}
                  {data?.showColors && (
                    <td>
                      <span
                        className={`inline-block w-6 h-6 border border-opacity-10 rounded ${item.color}`}
                      ></span>
                    </td>
                  )}
                  <td>
                    <span className="font-light">{item.desc}</span>
                  </td>
                </tr>
              ))}
            {Array.isArray(data?.utilities) &&
              data.utilities.map((item, index) => (
                <tr key={`u-${index}`}>
                  <th className="font-normal">
                    <span className="lowercase font-medium">{item.class}</span>
                  </th>
                  {data?.showType && (
                    <td>
                      <span className="badge badge-sm badge-info w-20">Utility</span>
                    </td>
                  )}
                  {data?.showColors && (
                    <td>
                      <span
                        className={`inline-block w-6 h-6 border border-opacity-10 rounded ${item.color}`}
                      ></span>
                    </td>
                  )}
                  <td>
                    <span className="font-light">{item.desc}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ClassTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default ClassTable;
