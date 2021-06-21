import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Products } from 'src/app/models/products';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  products: Products[] = [];
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.dtOptions = {
      paging: true,
      searching: false,
      pagingType: 'full_numbers',
      pageLength: 2,
      order: [[1, 'asc']]
    }
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

    // get products list
    this.spinner.show();
    this.http.get<Products[]>(`${environment.apiUrl}/products`, requestOptions)
      .subscribe(products => {
        this.spinner.hide();
        this.products = (products as any).data;
        this.dtTrigger.next(true);
      })
  }

  deleteProduct(id): void {
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

    Swal.fire({
      title: '¿Realmente desea eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.http.delete<any>(`${environment.apiUrl}/products/` + id, requestOptions).subscribe(result => {
          if (result.success === true) {
            // re-render datatables
            this.rerender();
            this.ngOnInit();
            this.spinner.hide();
          }
        });
      } else if (result.isDenied) {
        Swal.fire('No se eliminará el producto', '', 'info')
      }
    })
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
