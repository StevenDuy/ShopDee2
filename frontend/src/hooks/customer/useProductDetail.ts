"use client";

import { useState, useMemo } from 'react';

export interface ProductOptionValue {
  id: number;
  value: string;
  price_adjustment: number;
  stock_quantity: number;
  parent_id: number | null;
  children?: ProductOptionValue[];
}

export const useProductDetail = (product: any) => {
  const [selectedTopId, setSelectedTopId] = useState<number | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Flattened values for easier lookup
  const allValues = useMemo(() => {
    const list: ProductOptionValue[] = [];
    product?.options?.forEach((opt: any) => {
      opt.values?.forEach((val: any) => {
        list.push(val);
        val.children?.forEach((child: any) => list.push(child));
      });
    });
    return list;
  }, [product]);

  const selectedTop = useMemo(() => 
    allValues.find(v => v.id === selectedTopId), [selectedTopId, allValues]
  );

  const selectedSub = useMemo(() => 
    allValues.find(v => v.id === selectedSubId), [selectedSubId, allValues]
  );

  const displayedPrice = useMemo(() => {
    let price = parseFloat(product?.base_price || 0);
    if (selectedTop) price += parseFloat(selectedTop.price_adjustment.toString());
    if (selectedSub) price += parseFloat(selectedSub.price_adjustment.toString());
    return price;
  }, [product, selectedTop, selectedSub]);

  const maxStock = useMemo(() => {
    if (selectedSub) return selectedSub.stock_quantity;
    if (selectedTop) return selectedTop.stock_quantity;
    return product?.stock_quantity || 0;
  }, [product, selectedTop, selectedSub]);

  const handleTopSelect = (id: number) => {
    setSelectedTopId(id);
    setSelectedSubId(null); // Reset sub-level when top-level changes
  };

  return {
    selectedTopId,
    selectedSubId,
    quantity,
    displayedPrice,
    maxStock,
    setQuantity,
    handleTopSelect,
    setSelectedSubId,
    selectedTop,
    selectedSub
  };
};
