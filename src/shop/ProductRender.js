import React, { useEffect, useState, useRef } from "react";
import { PageWidth, PostContent } from "react-wp-gql";
import { Link } from "react-router-dom";
import { Button } from "react-wp-gql";
import { useCart } from "../hooks";
import { ProductCard } from "./ProductCard";

const SingleImage = ({ medium, large, setFeatImage, featImage }) => {
  const [thisImage, setThisImage] = useState();

  useEffect(() => {
    if (!thisImage) {
      setThisImage(medium);
    }
  }, [thisImage, medium]);

  return (
    <div className="w-25-l ph1 pointer">
      <div
        className="aspect-ratio aspect-ratio--1x1"
        onClick={() => {
          setFeatImage(thisImage === medium ? large : thisImage);
          setThisImage(featImage);
        }}
      >
        <div
          className="bg-center cover aspect-ratio--object"
          style={{ backgroundImage: `url("${thisImage}")` }}
        />
      </div>
    </div>
  );
};

export const ProductRender = ({
  node: {
    databaseId,
    name,
    content,
    featuredImage,
    stockQuantity = 1,
    price,
    productCategories,
    related: relatedProp,
    galleryImages,
  },
}) => {
  const { sourceUrl: productImage } = featuredImage?.node || {};
  const categories = productCategories?.nodes || [];
  const related = relatedProp?.nodes || [];
  const [featImage, setFeatImage] = useState();
  const nodeID = useRef();

  useEffect(() => {
    if (nodeID.current !== databaseId) {
      setFeatImage(productImage);
    }
  }, [featImage, productImage, databaseId]);

  useEffect(() => (nodeID.current = databaseId), [databaseId]);

  const { addToCart, adding } = useCart();
  const cartItem = {
    productId: databaseId,
    quantity: 1,
  };

  return (
    <div>
      <PageWidth className="mv4">
        <div className="flex-ns items-stretch-ns min-h-6-ns">
          <div className="w-100 w-50-ns relative z-1">
            <div className="aspect-ratio aspect-ratio--1x1">
              {featImage && (
                <div
                  className="bg-center cover aspect-ratio--object"
                  style={{ backgroundImage: `url("${featImage}")` }}
                />
              )}
            </div>
            <div>
              {galleryImages?.nodes?.length > 0 && (
                <div className="flex-l nl1 nr1 mt2">
                  {galleryImages.nodes.map((node) => (
                    <SingleImage
                      {...node}
                      key={node.id}
                      {...{ featImage, setFeatImage }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="pl4 w-100 w-50-ns relative z-1">
            <div className="fw7 tracked mb3">{name}</div>
            <div className="f4">{price}</div>
            <PostContent className="i tracked">{content}</PostContent>
            <div className="mt5">
              {!!stockQuantity ? (
                <Button loading={adding} onClick={() => addToCart(cartItem)}>
                  Add to Cart
                </Button>
              ) : (
                <div>OUT OF STOCK</div>
              )}
            </div>
            <div className="absolute z-1 bottom-0 left-0 pl4">
              <div className="o-40 dib">
                {categories.length > 1 ? "Categories" : "Category"}:
              </div>
              <div className="dib ml2">
                {categories.map(({ id, name, uri }) => (
                  <Link className="no-underline primary" to={uri} key={id}>
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="mt4">
            <div className="fw7 tracked mb3">Related</div>
            <div className="flex-ns flex-wrap-ns nt3 nr3 nl3 nb3">
              {related.map((node) => (
                <div key={node.id} className="w-100 w-50-m w-25-l pa3">
                  <ProductCard {...node} />
                </div>
              ))}
            </div>
          </div>
        )}
      </PageWidth>
    </div>
  );
};
