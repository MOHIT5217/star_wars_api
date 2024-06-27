import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();
  films: any[] = [];
  species: any[] = [];
  selectedFilm: string = '';
  selectedSpecies: string = '';
  birthYearRange: { start: string, end: string } = { start: '', end: '' };

  constructor(private swapiService: UtilityService) { }

  ngOnInit(): void {
    this.swapiService.getFilms().subscribe(data => {
      this.films = data['results'];
    });

    this.swapiService.getSpecies().subscribe(data => {
      this.species = data['results'];
    });
  }

  onFilterChange(): void {
    this.filterChange.emit({
      film: this.selectedFilm,
      species: this.selectedSpecies,
      birthYearRange: this.birthYearRange
    });
  }

}
