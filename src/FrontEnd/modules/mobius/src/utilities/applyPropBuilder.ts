import { BaseTheme, CategoryThemeProps, ComponentThemeProps } from "@insite/mobius/globals/baseTheme";
import { ThemeProps } from "styled-components";

type Combination<Component, Category, Props> = {
    /** Name of the component as described in the theme object. */
    component: Component;
    /** Name of a parent category if the containing the component as described in the theme object. */
    category?: Category;
    /** Name of the prop key in the theme. */
    propKey?: Props;
};

type Arguments =
    | Combination<keyof ComponentThemeProps, keyof CategoryThemeProps, "defaultProps">
    | Combination<"checkbox", "fieldSet", keyof ComponentThemeProps["checkbox"]>
    | Combination<"accordion", keyof CategoryThemeProps, keyof ComponentThemeProps["accordion"]>
    | Combination<"tab", never, keyof ComponentThemeProps["tab"]>
    | Combination<"radio", "fieldSet", keyof ComponentThemeProps["radio"]>
    | Combination<"button", never, keyof ComponentThemeProps["button"]>
    | Combination<"toast", never, keyof ComponentThemeProps["toast"]>;

/**
 * Provides a function to access the styling in the theme and props.
 * @param props The Props object from the component.
 * @param arguments An object containing strings that describe how to access theme properties for styling.
 * @return object to access two functions to provided access to theme and component properties.
 */
const applyPropBuilder = <Props extends Partial<ThemeProps<BaseTheme>>>(
    props: Props,
    { component, category, propKey = "defaultProps" }: Arguments,
) => {
    const { theme } = props;
    const componentDefaultProps = (theme?.[component] as any)?.[propKey];
    const categoryDefaultProps = category && (theme?.[category] as any)?.[propKey];

    /**
     * Function that provides the appropriate value for the property.
     * @param {string} name Name of the component prop (theme defaultProps key) being accessed.
     * @param {string} [fallback] Fallback value of the prop.
     * @param {true|undefined} mergeCss If true and the property name is "css", returns the category default, component default, and instance css prop values as an array, otherwise returns the appropriate value for the named property.
     * @return {string|undefined} End value of the prop based on prop/theme specificity rules.
     */
    const applyProp = <T>(name: keyof Props, fallback?: T) =>
        props[name] || componentDefaultProps?.[name] || categoryDefaultProps?.[name] || fallback || undefined;

    /**
     * Function that provides the appropriate value for the property for use in cases where the property extends StyledProp.
     * @param {string} name Name of the component prop (theme defaultProps key) being accessed. The value of the property for this property name should extend StyledProp.
     * @param {true|undefined} merge If true, returns the category default, component default, and instance prop values as an array (in that order), otherwise returns the appropriate value for the named property.
     */
    // It would be ideal to limit the "name" argument to only properties
    // of type Props whose value is of type StyledProp<Props>.
    const applyStyledProp = (name: keyof Props, merge?: boolean) =>
        merge ? [categoryDefaultProps?.[name], componentDefaultProps?.[name], props[name]] : applyProp(name);

    /**
     * Function that provides the appropriate value for the property for use in cases where the property is an object.
     * @param {string} name Name of the component prop (theme defaultProps key) being accessed.
     * @return {object} End value of the prop object based on prop/theme specificity rules.
     */
    const spreadProps = (name: keyof Props) => ({
        ...categoryDefaultProps?.[name],
        ...componentDefaultProps?.[name],
        ...props[name],
    });

    return { applyProp, applyStyledProp, spreadProps };
};

export default applyPropBuilder;
