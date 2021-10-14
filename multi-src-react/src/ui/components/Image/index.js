import React from 'react';
import style from './Image.module.scss';
import img from './logo.svg';

export default function index() {
  return (
    <div>
      <img src={img} />
      <button className={style.img}></button>
    </div>
  );
}
