import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {
  productId!: number;
  product!: Product;
  selectedImage!: string;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.getProductById();
  }

  getProductById() {
    const productIdParam = this.route.snapshot.paramMap.get('id');
    if (productIdParam !== null) {
      this.productId = +productIdParam;
      console.log(this.productId);
      this.productsService.getProductById(this.productId).subscribe((product: Product) => {
        this.product = product;
        this.selectImage(product.images[0]);
      });
    }
    else {
      // Handle the case where 'id' is null
      console.error("Product ID is null.");
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image; // Assuming you have a variable to store the selected image path
  }

  addToCart(product: Product) {
    console.log('Product added to cart: ', product);
    this.cartService.addToCart(product);
  }
}