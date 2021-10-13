import * as React from "react";
import { CompositeOptions, CompositeHTMLProps } from "../Composite/Composite";
export declare type RadioGroupOptions = CompositeOptions;
export declare type RadioGroupHTMLProps = CompositeHTMLProps & React.FieldsetHTMLAttributes<any>;
export declare type RadioGroupProps = RadioGroupOptions & RadioGroupHTMLProps;
export declare const useRadioGroup: {
    (options?: CompositeOptions | undefined, htmlProps?: RadioGroupHTMLProps | undefined, unstable_ignoreUseOptions?: boolean | undefined): RadioGroupHTMLProps;
    unstable_propsAreEqual: (prev: import("..").RoleOptions & {
        disabled?: boolean | undefined;
        focusable?: boolean | undefined;
    } & Pick<Partial<import("..").CompositeStateReturn>, "wrap" | "orientation" | "baseId" | "currentId" | "unstable_virtual" | "groups" | "unstable_moves"> & Pick<import("..").CompositeStateReturn, "move" | "first" | "last" | "items" | "setCurrentId"> & React.HTMLAttributes<any> & React.RefAttributes<any> & {
        wrapElement?: ((element: React.ReactNode) => React.ReactNode) | undefined;
    } & {
        disabled?: boolean | undefined;
    } & React.FieldsetHTMLAttributes<any>, next: import("..").RoleOptions & {
        disabled?: boolean | undefined;
        focusable?: boolean | undefined;
    } & Pick<Partial<import("..").CompositeStateReturn>, "wrap" | "orientation" | "baseId" | "currentId" | "unstable_virtual" | "groups" | "unstable_moves"> & Pick<import("..").CompositeStateReturn, "move" | "first" | "last" | "items" | "setCurrentId"> & React.HTMLAttributes<any> & React.RefAttributes<any> & {
        wrapElement?: ((element: React.ReactNode) => React.ReactNode) | undefined;
    } & {
        disabled?: boolean | undefined;
    } & React.FieldsetHTMLAttributes<any>) => boolean;
    __keys: readonly any[];
    __useOptions: (options: CompositeOptions, htmlProps: RadioGroupHTMLProps) => CompositeOptions;
};
export declare const RadioGroup: import("reakit-system/ts/createComponent").Component<"div", CompositeOptions>;
