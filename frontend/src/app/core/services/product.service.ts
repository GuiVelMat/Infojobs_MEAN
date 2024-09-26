import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/evironment';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})

export class ProductService {

    constructor(private apiService: ApiService) { }

    // GET ALL
    get_products(params: any): Observable<Product[]> {
        return this.apiService.get(`/products/`);
    }

    // GET ONE
    get_product(slug: String): Observable<Product> {
        return this.apiService.get(`/products/${slug}`);
    }

    // GET JOBS BY CATEGORY
    getProductsByCategory(slug: String): Observable<Product[]> {
        return this.apiService.get(`/categories/${slug}`);
    }

    //SEARCH
    find_product_name(search: string): Observable<any> {
        return this.apiService.get(`/products?name=${search}`).pipe(
            map((data) => {
                return data;
            })
        );
    }
}