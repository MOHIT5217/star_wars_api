import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  filteredCharacters: any[] = [];
  loading: boolean = true;
  private filterSubject = new Subject<any>();

  constructor(private utilityservice: UtilityService) { }


  ngOnInit(): void {
    this.utilityservice.getPeople().subscribe(data => {
      console.log('Received characters with species:', data);
      this.filteredCharacters = data; // Show list by default
      this.loading = false;
    },
    error => {
      console.error('Error fetching characters:', error);
    });

    // Handle filter changes reactively
    this.filterSubject.pipe(
      debounceTime(300),
      switchMap(filter => this.utilityservice.filterCharacters(filter))
    ).subscribe(filteredCharacters => {
      this.filteredCharacters = filteredCharacters;
    });
  }

  onFilterChange(filter: any): void {
    this.filterSubject.next(filter);
  }
}
