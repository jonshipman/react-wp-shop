import React from "react";
import { Button } from "../components";
import { ProductCard } from "./ProductCard";

export const ProductCategoryCard = ({ name, posts, uri }) => {
  const { edges } = posts || {};
  const productNodes = edges || [];

  return (
    <div>
      <div className="fw7 f4 tc mb3">{name}</div>
      <div className="flex-ns items-stretch-ns nl2 nr2">
        {productNodes.slice(0, 3).map(({ node }) => (
          <div className="w-100 w-50-m w-third-l pa2" key={node.id}>
            <ProductCard {...node} />
          </div>
        ))}
      </div>
      <div className="tc mt4">
        <Button to={uri}>See All {name}</Button>
      </div>
    </div>
  );
};
