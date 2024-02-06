import React from 'react';
import { Triangle } from 'react-loader-spinner';

const Loader = () => (
  <div className="flexCenter w-full my-4">
    <Triangle
      height="80"
      width="80"
      radius="9"
      color="#ffbd2b"
      ariaLabel="triangle-loading"
      wrapperStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      wrapperClassName=""
      visible
    />
  </div>
);

export default Loader;
