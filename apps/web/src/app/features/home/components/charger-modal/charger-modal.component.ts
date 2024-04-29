import { Component, inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WebChargerService } from "../../../../services/charger.service";
import { ChargerModalStore } from "./store";
import { ComponentStore, provideComponentStore } from "@ngrx/component-store";
import { CommonModule } from "@angular/common";


@Component({
  imports: [CommonModule],
  selector: 'app-charger-modal-component',
  styleUrl: './charger-modal.component.scss',
  templateUrl: './charger-modal.component.html',
  standalone: true,
  providers: [
    provideComponentStore(ChargerModalStore)
  ]
})
export class ChargerModalComponent implements OnInit {
  chargerService = inject(WebChargerService);
  store = inject(ChargerModalStore);

  readonly id: { id: string } = inject(MAT_DIALOG_DATA, {optional: false});

  loading$ = this.store.select((s) => s.loading);


  ngOnInit(): void {
    this.store.fetchCharger$({ id: this.id.id });
  }
}
