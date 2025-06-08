import express from 'express';
import {getCategories,getCategryDetail,categoryBidden,deletCate,addCate,editCate,getSubcategory,hierarchical,parentCategories,leafCategory} from '../Controller/category.js';
import {verifyToken} from '../middleware/authorizationMiddleware.js';

const router = express.Router();


router.get('/leaf-category',leafCategory)
router.get('/categories',getCategories);
// verifyToken(['dashboardUser','vendor']),
router.get('/parent-categories',parentCategories);
// verifyToken(['dashboardUser','vendor']),
router.get('/category-bidden',categoryBidden);
// ,verifyToken(['dashboardUser'])
router.get('/hierarchical-cat/:id',hierarchical)
// ,verifyToken(['dashboardUser'])
router.get('/get-subcat/:id',getSubcategory)
// ,verifyToken(['dashboardUser','vendor'])
router.get('/category/:id',getCategryDetail)
// ,verifyToken(['dashboardUser'])
router.post('/add',addCate)
// ,verifyToken(['dashboardUser'])
router.delete('/delete-cat/:id',deletCate)
// ,verifyToken(['dashboardUser'])
router.put('/edit/:id',editCate)
// ,verifyToken(['dashboardUser'])

export default router;
