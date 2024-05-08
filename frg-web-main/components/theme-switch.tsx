import {FC, useEffect, useState} from "react";
import {VisuallyHidden} from "@react-aria/visually-hidden";
import {SwitchProps, useSwitch} from "@nextui-org/react";
import {useTheme} from "next-themes";
import clsx from "clsx";

import {MoonFilledIcon, SunFilledIcon} from "@/components/Icons/icons";

export interface ThemeSwitchProps {
    className?: string;
    classNames?: SwitchProps["classNames"];
}

const SwitchComponent: FC<{
    baseProps: any;
    wrapperProps: any;
    isSelected: boolean;
    children: React.ReactNode;
}> = ({baseProps, wrapperProps, isSelected, children}) => {
    return (
        <div {...baseProps}>
            <VisuallyHidden>
                <input {...wrapperProps} />
            </VisuallyHidden>
            {children}
        </div>
    );
};

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
                                                      className,
                                                      classNames,
                                                  }) => {
    const [isMounted, setIsMounted] = useState(false);

    const {theme, setTheme} = useTheme();

    const onChange = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    };

    const {
        Component,
        slots,
        isSelected: isSwitchSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps,
    } = useSwitch({
        isSelected: theme === "light",
        onChange,
    });

    const isSelected = isSwitchSelected ?? false;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent Hydration Mismatch
    if (!isMounted) return <div className="w-6 h-6"/>;

    return (
        <SwitchComponent
            baseProps={getBaseProps({
                className: clsx(
                    "px-px transition-opacity hover:opacity-80 cursor-pointer",
                    className,
                    classNames?.base
                ),
            })}
            wrapperProps={getInputProps()}
            isSelected={isSelected}
        >
            <div
                {...getWrapperProps()}
                className={slots.wrapper({
                    class: clsx(
                        [
                            "w-auto h-auto",
                            "bg-transparent",
                            "rounded-lg",
                            "flex items-center justify-center",
                            "group-data-[selected=true]:bg-transparent",
                            "!text-default-500",
                            "pt-px",
                            "px-0",
                            "mx-0",
                        ],
                        classNames?.wrapper
                    ),
                })}
            >
                {isSelected ? (
                    <MoonFilledIcon size={22}/>
                ) : (
                    <SunFilledIcon size={22}/>
                )}
            </div>
        </SwitchComponent>
    );
};
