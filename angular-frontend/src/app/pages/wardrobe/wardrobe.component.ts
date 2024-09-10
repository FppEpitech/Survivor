import { Employee } from './../../service/employees/employees.service';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Clothe, ClothesService } from 'src/app/service/clothes/clothes.service';
import { Clothes, Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { EmployeesService } from 'src/app/service/employees/employees.service';
import { environment } from '../../../environments/environment';

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

  hats_caps: Clothe[] = [];
  tops: Clothe[] = [];
  bottoms: Clothe[] = [];
  shoes_list: Clothe[] = [];

  hat_cap?: Clothe;
  top?: Clothe;
  bottom?: Clothe;
  shoes?: Clothe;

  hat_cap_url: { url?: string } = {};
  top_url: { url?: string } = {};
  bottom_url: { url?: string } = {};
  shoes_url: { url?: string } = {};

  apiUrl = environment.apiUrl + '/';

  index_hats_caps = { index: 0 };
  index_tops = { index: 0 };
  index_bottoms = { index: 0 };
  index_shoes = { index: 0 };

  hat_cap_id: number[] = [];
  top_id: number[] = [];
  bottom_id: number[] = [];
  shoes_id: number[] = [];

  customerSelected = false;

  backupImageUrl = 'assets/placeholder-128.png';

  constructor(private customerService : CustomersService, private employeeService : EmployeesService, private clotheService : ClothesService) { }

    async ngOnInit() {
        this.employee = await this.employeeService.getMe();
        if (this.employee === undefined) {
            return;
        } else {
            if (this.isWorkCoach(this.employee.work)) {
                this.customers = await this.employeeService.getCustomers(this.employee.id);
            } else {
                this.customers = await this.customerService.getCustomers();
            }
        }
    }

    isWorkCoach(work : string): boolean {
        return work === 'Coach';
    }

    updateCustomer(customer: Customer): void {
        this.customerSelected = true;
        console.log("Customer selected: ", customer);
        this.customer = customer;
        this.getClothes();
    }

    async getClothes() {
        this.clothes = await this.customerService.getCustomerClothes(this.customer!.id);
        if (this.clothes !== undefined) {
            this.hat_cap_id = this.clothes.filter((clothe) => clothe.type === 'hat/cap').map((clothe) => clothe.id);
            this.top_id = this.clothes.filter((clothe) => clothe.type === 'top').map((clothe) => clothe.id);
            this.bottom_id = this.clothes.filter((clothe) => clothe.type === 'bottom').map((clothe) => clothe.id);
            this.shoes_id = this.clothes.filter((clothe) => clothe.type === 'shoes').map((clothe) => clothe.id);

            this.getAllClothes().then(() => {
                this.hat_cap = this.hats_caps.at(this.index_hats_caps.index);
                this.top = this.tops.at(this.index_tops.index);
                this.bottom = this.bottoms.at(this.index_bottoms.index);
                this.shoes = this.shoes_list.at(this.index_shoes.index);

                this.hat_cap_url.url = this.hat_cap?.type ? this.apiUrl + this.hat_cap.type! : '';
                this.top_url.url = this.top?.type ? this.apiUrl + this.top.type! : '';
                this.bottom_url.url = this.bottom?.type ? this.apiUrl + this.bottom.type! : '';
                this.shoes_url.url = this.shoes?.type ? this.apiUrl + this.shoes.type! : '';
            });
        }
    }

  async getAllClothes(): Promise<void> {
    try {
      const hatCapPromises = this.hat_cap_id.map(id => this.getOneClothe(id));
      const topPromises = this.top_id.map(id => this.getOneClothe(id));
      const bottomPromises = this.bottom_id.map(id => this.getOneClothe(id));
      const shoesPromises = this.shoes_id.map(id => this.getOneClothe(id));

      const [hatsCaps, tops, bottoms, shoesList] = await Promise.all([
        Promise.all(hatCapPromises),
        Promise.all(topPromises),
        Promise.all(bottomPromises),
        Promise.all(shoesPromises)
      ]);

      this.hats_caps = hatsCaps;
      this.tops = tops;
      this.bottoms = bottoms;
      this.shoes_list = shoesList;

    } catch (error) {
      console.error('Erreur lors de la récupération des vêtements :', error);
    }
  }

  async getOneClothe(id: number): Promise<Clothe> {
    try {
      const clothe = await firstValueFrom(this.clotheService.getClothe(id));
      return clothe;
    } catch (error) {
      console.error('Erreur lors de la récupération du vêtement', error);
      throw error;
    }
  }

  swipeItem(nextElement: boolean, itemList: Clothe[], index: {index: number}, url: { url?: string }): void {
    console.log('swipeItem', nextElement, itemList, index, url);
    console.log(index.index == 0);
    if (nextElement) {
      index.index = (index.index == itemList.length - 1) ? 0 : index.index + 1;
    } else {
      index.index = (index.index == 0) ? itemList.length - 1 : index.index - 1;
    }
    const item = itemList.at(index.index);
    url.url = item?.type ? this.apiUrl + item.type! : '';
  }

  randomOutfit(): void {
    if (this.customerSelected === false)
      return;
    this.index_hats_caps.index = Math.floor(Math.random() * this.hats_caps.length);
    this.index_tops.index = Math.floor(Math.random() * this.tops.length);
    this.index_bottoms.index = Math.floor(Math.random() * this.bottoms.length);
    this.index_shoes.index = Math.floor(Math.random() * this.shoes_list.length);

    this.hat_cap = this.hats_caps.at(this.index_hats_caps.index);
    this.top = this.tops.at(this.index_tops.index);
    this.bottom = this.bottoms.at(this.index_bottoms.index);
    this.shoes = this.shoes_list.at(this.index_shoes.index);

    this.hat_cap_url.url = this.hat_cap?.type ? this.apiUrl + this.hat_cap.type! : '';
    this.top_url.url = this.top?.type ? this.apiUrl + this.top.type! : '';
    this.bottom_url.url = this.bottom?.type ? this.apiUrl + this.bottom.type! : '';
    this.shoes_url.url = this.shoes?.type ? this.apiUrl + this.shoes.type! : '';
  }

  onImageError(event: any) {
    event.target.src = this.backupImageUrl;
  }

}
