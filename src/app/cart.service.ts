import { Injectable } from '@angular/core';
import { Product } from './product';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: Product[] = [];
  cartCountSubject: Subject<number> = new Subject<number>();

  constructor() { }
  
  addToCart(product: Product): void {
    this.cartItems.push(product);
    this.cartCountSubject.next(this.cartItems.length); 
  }
}
