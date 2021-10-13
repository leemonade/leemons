import React from "react";
import Shared from "@plugins/lib2/shared";
import Component from "./index";
import { get } from "lodash";

export default () => (
  <>
    <p>Hello from lib1</p>
    <Component />
    <Shared />
  </>
);
