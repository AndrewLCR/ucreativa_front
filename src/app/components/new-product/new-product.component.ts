import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  newProductForm = this.formBuilder.group({
    name: '',
    description: ''
  });

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    // headers
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    let productArr = {
      name: this.newProductForm.value.name,
      detail: this.newProductForm.value.description
    }

    this.spinner.show();
    
    this.http.post<any>(`${environment.apiUrl}/products`, productArr, requestOptions)
      .subscribe(response => {
        if (response.success == true) {
          this.spinner.hide();
          Swal.fire({
            title: 'Producto creado con éxito',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/dashboard']);
            }
          })
        } else {
          Swal.fire({
            title: '¡Ups! Ha ocurrido un error',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }

}
