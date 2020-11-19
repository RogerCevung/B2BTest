import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { canAddToCart } from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState, ownProps: HasProduct) => ({
    canAddToCart: canAddToCart(state, ownProps.product, ownProps.productInfo),
});

export interface ProductDetailsAddToCartButtonStyles {
    button?: ButtonPresentationProps;
}

export const addToCartButtonStyles: ProductDetailsAddToCartButtonStyles = {
    button: {
        css: css`
            width: 100%;
        `,
    },
};

const styles = addToCartButtonStyles;

const ProductDetailsAddToCartButton: React.FC<Props> = ({ canAddToCart }) => {
    if (!canAddToCart) {
        return null;
    }

    return <ProductAddToCartButton extendedStyles={styles.button} data-test-selector="addProductToCart" />;
};

const widgetModule: WidgetModule = {
    component: withProduct(connect(mapStateToProps)(ProductDetailsAddToCartButton)),
    definition: {
        displayName: "Add to Cart Button",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
