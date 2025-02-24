import express, { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import productservice from "../services/product.services";
import { HelperparseFilter } from "../helpers/parsedFilters";

const product_svc = new productservice();

export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  body.userid = req.authuser.id;
  const result = await product_svc.createProduct(body);
  res.status(201).json({
    msg: "success",
    result: result,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const result = await product_svc.FindById(productId);
  res.status(result?.status).json(result);
});

export const getFilterProduct = asyncHandler(async (req, res) => {
  const filters = req.query;

  // helperfunction to change the typeof Price NUMBER --> string
  //typeof price ='Object{min:string,max:string}' --> {min:number,max:number}
  const parseFilters = HelperparseFilter(filters);
  console.log("PARSE FILTER", parseFilters);
  const result = await product_svc.getProduct(parseFilters);
  res.status(200).json({
    msg: "success",
    status: 200,
    result: result,
  });
});

export const findProductStock = asyncHandler(async (req, res) => {
  const productid = req.params.productid as string;
  const result = await product_svc.checkProductStock(productid);
  res.status(200).json({
    msg: "success",
    stock: result,
  });
});

export const updateProductStock = asyncHandler(async (req, res) => {
  const payload = req.body;
  const result = await product_svc.updateProductStockService(
    payload.product_id,
    payload.qty,
    payload.operation
  );
  res.status(result.status).json(result);
});
