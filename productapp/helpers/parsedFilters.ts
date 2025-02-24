type Ifilters = {
  category?: string;
  brand?: string;
  id?: number;
  slug?: string;
  price?: number | { min: number; max: number };
};

export const HelperparseFilter = (filterObj: Ifilters) => {
  if (filterObj.price && typeof filterObj.price === "string") {
    filterObj.price =parseFloat(filterObj.price);
    return filterObj;
  } else if (
    filterObj.price &&
    typeof filterObj.price === "object" &&
    "min" in filterObj.price &&
    "max" in filterObj.price
  ) {
    filterObj.price = { min: +filterObj.price.min, max: +filterObj.price.max };   
  }
  return filterObj;
};
