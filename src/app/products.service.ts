import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Category, Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrls = 'https://api.escuelajs.co/api/v1/files/upload';

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  uploadFile(formData: FormData): Promise<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer your_access_token', // Include any necessary headers
    });

    return this.httpClient.post(this.apiUrls, formData, { headers }).toPromise().then((response) => response).catch(this.handleError);
  }
  handleError(handleError: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  addProduct(productData: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.apiUrl + '/products', productData);
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.apiUrl + '/products');
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.apiUrl + '/categories');
  }
  
  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(this.apiUrl + '/products/' + productId);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.apiUrl + '/categories/' + categoryId + '/products');
  }
  
  updateProduct(productId: number, productData: Product): Observable<Product> {
    return this.httpClient.put<Product>(this.apiUrl + '/products/' + productId, productData);
  }
  
  deleteProduct(id:number):Observable<Product> {
    return this.httpClient.delete<Product>(this.apiUrl + '/products/' + id);
  }
}

