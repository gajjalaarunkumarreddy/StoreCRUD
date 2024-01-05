import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product } from '../product';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss']
})

export class EditproductComponent implements OnInit {
  editForm!: FormGroup;
  productId!: number;
  categories: Category[] = [];
  selectedFile!: File;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(10000), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      categoryId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      images: [null,Validators.required]
    });
    const productIdParam = this.route.snapshot.paramMap.get('id');
    if (productIdParam !== null) {
      this.productId = +productIdParam;
      console.log(this.productId);
      // Fetch product details and set form values
      this.productsService.getProductById(this.productId).subscribe((product: Product) => {
        // Extract relevant values for categoryId
        const categoryId = product.category ? product.category.id : null;
        // Ensure images is an array
        const images = product.images && product.images.length > 0 ? [product.images[0]] : [];
        // Create an object with the extracted values
        const formData = {
          title: product.title,
          price: product.price,
          description: product.description,
          categoryId: categoryId,
          images: images
        };
        // Patch the form with the extracted values
        this.editForm.patchValue(formData);
      });
    }
    else {
      // Handle the case where 'id' is null
      console.error("Product ID is null.");
    }
    this.getCategories();
  }

  getCategories(): void {
    this.productsService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.uploadFile();
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.productsService.uploadFile(formData)
        .then(response => {
          console.log('File uploaded successfully:', response);
          this.editForm.patchValue({
            images: response.location
          })
        })
        .catch(error => {
          console.error('File upload failed:', error);
        });
    }
  }

  onSubmit() {
    if (this.editForm.valid) {
      console.log(this.editForm.value);
      let formdata = this.editForm.value
      formdata.title = formdata.title
      formdata.price = formdata.price
      formdata.description = formdata.description
      formdata.categoryId = formdata.categoryId.id
      formdata.images = formdata.images ? [formdata.images] : []
      this.productsService.updateProduct(this.productId, formdata).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.resetForm();
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
        },
        complete: () => {
          console.info('Request completed');
        }
      });
    }
  }

  resetForm() {
    this.editForm.reset();
    this.editForm.patchValue({
      categoryId: [''],
      images: ''
    });
  }
}
