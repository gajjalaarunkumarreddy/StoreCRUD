import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Category } from '../product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})

export class AddproductComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  selectedFile!: File;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(10000), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      categoryId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      images: [null,Validators.required]
    });
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
          this.productForm.patchValue({
            images: response.location
          })
        })
        .catch(error => {
          console.error('File upload failed:', error);
        });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
      let formdata = this.productForm.value
      formdata.title = formdata.title
      formdata.price = formdata.price
      formdata.description = formdata.description
      formdata.categoryId = formdata.categoryId
      formdata.images = [formdata.images]
      this.productsService.addProduct(formdata).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          this.resetForm();
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
        },
        complete: () => {
          console.info('Request completed');
        }
      });
    }
  }

  resetForm() {
    this.productForm.reset();
    this.productForm.patchValue({
      categoryId: [''],
      images: ''
    });
  }
}







