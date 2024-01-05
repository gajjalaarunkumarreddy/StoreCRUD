import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Category, Product } from '../product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})

export class ProductlistComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | undefined;

  constructor(private productsService: ProductsService, private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  getProducts(): void {
    this.productsService.getProducts().subscribe((response: Product[]) => {
      this.products = response;
    });
  }

  getCategories(): void {
    this.productsService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  filterProductsByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    console.log(this.selectedCategoryId)
    // Fetch products based on the selected category
    this.productsService.getProductsByCategory(categoryId).subscribe((data: Product[]) => {
      this.products = data;
      console.log('filtered data is ', data);
    },
      (error) => {
        console.error('Error fetching products by category:', error);
      });
  }

  editProduct(product: Product) {
    console.log('Edit product:', product);
    this.router.navigate(['/editproduct', product.id]);
  }

  deleteProduct(product: Product): void {
    this.productsService.deleteProduct(product.id).subscribe((data: Product) => {
      alert('Product Deleted');
      this.getProducts();
    })
  }

  openImage(product: Product): void {
    console.log('Image clicked: ', product.id);
    this.router.navigate(['/product', product.id]);
  }
}
