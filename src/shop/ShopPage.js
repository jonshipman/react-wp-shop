import React from "react";
import { PageWidth, useNode, PostContent, Seo } from "react-wp-gql";
import { Title } from "../components";
import { useShopPage } from "../hooks";
import { ProductCategoryCard } from "./ProductCategoryCard";

const ShopContent = ({ className }) => {
  const { edges: catProductEdges } = useShopPage();

  return (
    <div {...{ className }}>
      {catProductEdges.map(({ node }) => {
        return (
          <div className="mb4 drop-last-mb" key={node.id}>
            <ProductCategoryCard {...node} />
          </div>
        );
      })}
    </div>
  );
};

export const ShopPage = () => {
  const { node } = useNode();
  return (
    <div>
      <Seo {...node.seo} />
      <Title>{node.title}</Title>
      <PageWidth className="mv4">
        {node.content && (
          <PostContent className="mb4">{node.content}</PostContent>
        )}
        <ShopContent />
      </PageWidth>
    </div>
  );
};
