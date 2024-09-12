import { TranslocoService } from '@ngneat/transloco';
import { Employee } from './../../service/employees/employees.service';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Clothe, ClothesService } from 'src/app/service/clothes/clothes.service';
import { Clothes, Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { EmployeesService } from 'src/app/service/employees/employees.service';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss']
})
export class WardrobeComponent {

  customers: Customer[] = [];
  customer?: Customer;

  employee?: Employee;

  clothes: Clothes[] = [];
  clothe?: Clothe;

  hats_caps_urls: string[] = [];
  tops_urls: string[] = [];
  bottoms_urls: string[] = [];
  shoes_urls: string[] = [];

  hat_cap_url: { url?: string } = {};
  top_url: { url?: string } = {};
  bottom_url: { url?: string } = {};
  shoes_url: { url?: string } = {};

  apiUrl = environment.apiUrl + '/';

  index_hats_caps = { index: 0 };
  index_tops = { index: 0 };
  index_bottoms = { index: 0 };
  index_shoes = { index: 0 };

  customerSelected = false;

  backupImageUrl = 'assets/placeholder-128.png';

  constructor(private customerService : CustomersService, private employeeService : EmployeesService, private clotheService : ClothesService, private authService : AuthService, public _tloco : TranslocoService) { }

    async ngOnInit() {
        this.employee = await this.employeeService.getMe();
        if (this.employee === undefined) {
            return;
        } else {
            if (this.authService.isCoach(this.employee)) {
                this.customers = await this.employeeService.getCustomers(this.employee.id);
            } else {
                this.customers = await this.customerService.getCustomers();
            }
        }
    }

    updateCustomer(customer: Customer): void {
        this.customerSelected = true;
        this.customer = customer;
        this.getClothes();
    }

    async getClothes() {
        this.clothes = await this.customerService.getCustomerClothes(this.customer!.id);
        if (this.clothes != undefined) {
            console.log(this.clothes);
            this.hats_caps_urls = this.clothes.filter((clothe) => clothe.type == 'hat/cap').map((clothe) => clothe.url);
            this.tops_urls = this.clothes.filter((clothe) => clothe.type == 'top').map((clothe) => clothe.url);
            this.bottoms_urls = this.clothes.filter((clothe) => clothe.type == 'bottom').map((clothe) => clothe.url);
            this.shoes_urls = this.clothes.filter((clothe) => clothe.type == 'shoes').map((clothe) => clothe.url);

            this.hat_cap_url.url = this.apiUrl + this.hats_caps_urls.at(this.index_hats_caps.index);
            this.top_url.url = this.apiUrl + this.tops_urls.at(this.index_tops.index);
            this.bottom_url.url = this.apiUrl + this.bottoms_urls.at(this.index_bottoms.index);
            this.shoes_url.url = this.apiUrl + this.shoes_urls.at(this.index_shoes.index);
        }
    }

  swipeItem(nextElement: boolean, itemListUrls: string[], index: {index: number}, url: { url?: string }): void {
    if (nextElement) {
      index.index = (index.index == itemListUrls.length - 1) ? 0 : index.index + 1;
    } else {
      index.index = (index.index == 0) ? itemListUrls.length - 1 : index.index - 1;
    }
    url.url = this.apiUrl + itemListUrls.at(index.index);
  }

  randomOutfit(): void {
    if (this.customerSelected === false)
      return;
    this.index_hats_caps.index = Math.floor(Math.random() * this.hats_caps_urls.length);
    this.index_tops.index = Math.floor(Math.random() * this.tops_urls.length);
    this.index_bottoms.index = Math.floor(Math.random() * this.bottoms_urls.length);
    this.index_shoes.index = Math.floor(Math.random() * this.shoes_urls.length);

    this.hat_cap_url.url = this.apiUrl + this.hats_caps_urls.at(this.index_hats_caps.index);
    this.top_url.url = this.apiUrl + this.tops_urls.at(this.index_tops.index);
    this.bottom_url.url = this.apiUrl + this.bottoms_urls.at(this.index_bottoms.index);
    this.shoes_url.url = this.apiUrl + this.shoes_urls.at(this.index_shoes.index);
  }

  onImageError(event: any) {
    event.target.src = this.backupImageUrl;
  }

}
