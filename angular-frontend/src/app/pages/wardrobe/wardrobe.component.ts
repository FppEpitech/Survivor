import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Clothe, ClothesService } from 'src/app/service/clothes/clothes.service';
import { Clothes, Customer, CustomersService } from 'src/app/service/customers/customers.service';
import { EmployeesService } from 'src/app/service/employees/employees.service';

@Component({
  selector: 'app-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss']
})
export class WardrobeComponent {

  customers: Customer[] = [];
  customer?: Customer;

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

  hat_cap_url?: string;
  top_url?: string;
  bottom_url?: string;
  shoes_url?: string;

  index_hats_caps = 0;
  index_tops = 0;
  index_bottoms = 0;
  index_shoes = 0;

  hat_cap_id: number[] = [];
  top_id: number[] = [];
  bottom_id: number[] = [];
  shoes_id: number[] = [];

  constructor(private customerService : CustomersService, private employeeService : EmployeesService, private clotheService : ClothesService) { }

  ngOnInit(): void {
    // Get all customers of an employee
    this.customerService.getCustomers().subscribe((customers) => {
      console.log(customers);
      this.customers = customers;
    });

    this.getClothes();
  }

  //  Update the selected customer
  updateCustomer(customer: Customer): void {
    console.log("Customer selected: ", customer);
    this.customer = customer;
    this.getClothes();
  }

  // Get all clothes of a customer
  getClothes(): void {
    this.customerService.getCustomerClothes(this.customer!.id).subscribe((clothes) => {
      console.log(clothes);
      this.clothes = clothes;

      this.hat_cap_id = clothes.filter((clothe) => clothe.type === 'hat/cap').map((clothe) => clothe.id);
      this.top_id = clothes.filter((clothe) => clothe.type === 'top').map((clothe) => clothe.id);
      this.bottom_id = clothes.filter((clothe) => clothe.type === 'bottom').map((clothe) => clothe.id);
      this.shoes_id = clothes.filter((clothe) => clothe.type === 'shoes').map((clothe) => clothe.id);

      this.getAllClothes().then(() => {
        // console.log(this.hats_caps);
        // console.log(this.tops);
        // console.log(this.bottoms);
        // console.log(this.shoes_list);

        // console.log(this.hats_caps.length);
        // console.log(this.tops.length);
        // console.log(this.bottoms.length);
        // console.log(this.shoes_list.length);

        // console.log(this.index_hats_caps);
        // console.log(this.index_tops);
        // console.log(this.index_bottoms);
        // console.log(this.index_shoes);

        this.hat_cap = this.hats_caps.at(this.index_hats_caps);
        this.top = this.tops.at(this.index_tops);
        this.bottom = this.bottoms.at(this.index_bottoms);
        this.shoes = this.shoes_list.at(this.index_shoes);

        this.hat_cap_url = this.hat_cap?.type ? 'api/' + this.hat_cap.type! : '';
        this.top_url = this.top?.type ? 'api/' + this.top.type! : '';
        this.bottom_url = this.bottom?.type ? 'api/' + this.bottom.type! : '';
        this.shoes_url = this.shoes?.type ? 'api/' + this.shoes.type! : '';

        // console.log(this.hat_cap);
        // console.log(this.top);
        // console.log(this.bottom);
        // console.log(this.shoes);
      });
    });
  }

  // async getAllClothes(): Promise<void> {
  //   for (let id of this.hat_cap_id) {
  //     this.getOneClothe(id).then((clothe) => {
  //       console.log(clothe);
  //       this.hats_caps.push(clothe);
  //     });
  //   }
  //   for (let id of this.top_id) {
  //     this.getOneClothe(id).then((clothe) => {
  //       console.log(clothe);
  //       this.tops.push(clothe);
  //     });
  //   }
  //   for (let id of this.bottom_id) {
  //     this.getOneClothe(id).then((clothe) => {
  //       console.log(clothe);
  //       this.bottoms.push(clothe);
  //     });
  //   }
  //   for (let id of this.shoes_id) {
  //     this.getOneClothe(id).then((clothe) => {
  //       console.log(clothe);
  //       this.shoes_list.push(clothe);
  //     });
  //   }
  // }

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

      // console.log('Hats Caps:', this.hats_caps);
      // console.log('Tops:', this.tops);
      // console.log('Bottoms:', this.bottoms);
      // console.log('Shoes List:', this.shoes_list);
    } catch (error) {
      console.error('Erreur lors de la récupération des vêtements :', error);
    }
  }

  async getOneClothe(id: number): Promise<Clothe> {
    try {
      const clothe = await firstValueFrom(this.clotheService.getClothe(id));
      console.log(clothe);
      return clothe;
    } catch (error) {
      console.error('Erreur lors de la récupération du vêtement', error);
      throw error;
    }
  }

  nextHatCap(): void {
    if (this.index_hats_caps === this.hats_caps.length - 1) {
      this.index_hats_caps = 0;
    } else {
      this.index_hats_caps++;
    }
    this.hat_cap = this.hats_caps.at(this.index_hats_caps);
    this.hat_cap_url = this.hat_cap?.type ? 'api/' + this.hat_cap.type! : '';
  }

  previousHatCap(): void {
    if (this.index_hats_caps === 0) {
      this.index_hats_caps = this.hats_caps.length - 1;
    } else {
      this.index_hats_caps--;
    }
    this.hat_cap = this.hats_caps.at(this.index_hats_caps);
    this.hat_cap_url = this.hat_cap?.type ? 'api/' + this.hat_cap.type! : '';
  }

  nextTop(): void {
    if (this.index_tops === this.tops.length - 1) {
      this.index_tops = 0;
    } else {
      this.index_tops++;
    }
    this.top = this.tops.at(this.index_tops);
    this.top_url = this.top?.type ? 'api/' + this.top.type! : '';
  }

  previousTop(): void {
    if (this.index_tops === 0) {
      this.index_tops = this.tops.length - 1;
    } else {
      this.index_tops--;
    }
    this.top = this.tops.at(this.index_tops);
    this.top_url = this.top?.type ? 'api/' + this.top.type! : '';
  }

  nextBottom(): void {
    if (this.index_bottoms === this.bottoms.length - 1) {
      this.index_bottoms = 0;
    } else {
      this.index_bottoms++;
    }
    this.bottom = this.bottoms.at(this.index_bottoms);
    this.bottom_url = this.bottom?.type ? 'api/' + this.bottom.type! : '';
  }

  previousBottom(): void {
    if (this.index_bottoms === 0) {
      this.index_bottoms = this.bottoms.length - 1;
    } else {
      this.index_bottoms--;
    }
    this.bottom = this.bottoms.at(this.index_bottoms);
    this.bottom_url = this.bottom?.type ? 'api/' + this.bottom.type! : '';
  }

  nextShoes(): void {
    if (this.index_shoes === this.shoes_list.length - 1) {
      this.index_shoes = 0;
    } else {
      this.index_shoes++;
    }
    this.shoes = this.shoes_list.at(this.index_shoes);
    this.shoes_url = this.shoes?.type ? 'api/' + this.shoes.type! : '';
  }

  previousShoes(): void {
    if (this.index_shoes === 0) {
      this.index_shoes = this.shoes_list.length - 1;
    } else {
      this.index_shoes--;
    }
    this.shoes = this.shoes_list.at(this.index_shoes);
    this.shoes_url = this.shoes?.type ? 'api/' + this.shoes.type! : '';
  }

  randomOutfit(): void {
    this.index_hats_caps = Math.floor(Math.random() * this.hats_caps.length);
    this.index_tops = Math.floor(Math.random() * this.tops.length);
    this.index_bottoms = Math.floor(Math.random() * this.bottoms.length);
    this.index_shoes = Math.floor(Math.random() * this.shoes_list.length);

    this.hat_cap = this.hats_caps.at(this.index_hats_caps);
    this.top = this.tops.at(this.index_tops);
    this.bottom = this.bottoms.at(this.index_bottoms);
    this.shoes = this.shoes_list.at(this.index_shoes);

    this.hat_cap_url = this.hat_cap?.type ? 'api/' + this.hat_cap.type! : '';
    this.top_url = this.top?.type ? 'api/' + this.top.type! : '';
    this.bottom_url = this.bottom?.type ? 'api/' + this.bottom.type! : '';
    this.shoes_url = this.shoes?.type ? 'api/' + this.shoes.type! : '';
  }
}
