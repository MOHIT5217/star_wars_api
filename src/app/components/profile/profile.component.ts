import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Character } from 'src/app/interfaces/character';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  character: any = {};
  films: any[] = [];
  vehicles: any[] = [];
  species: any[] = [];
  starships: any[] = [];
  loading:boolean = true;

  constructor(private route: ActivatedRoute, private swapiService: UtilityService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.swapiService.getPerson(id).subscribe(character => {
        this.character = character;
        console.log(character);
        
        // Fetch films, vehicles, and starships
        const filmObservables = character.films.map((url: string) => this.swapiService.getFilm(url));
        const vehicleObservables = character.vehicles.map((url: string) => this.swapiService.getVehicle(url));
        const starshipObservables = character.starships.map((url: string) => this.swapiService.getStarship(url));
        const speciesObservables = character.species.map((url: string) => this.swapiService.getSpeciesByUrl(url));

        forkJoin([...filmObservables, ...vehicleObservables, ...starshipObservables, ...speciesObservables]).subscribe(results => {
          console.log(results,filmObservables.length, "forkJoin");
          this.films = results.slice(0, filmObservables.length);
          console.log(this.films);
          
          this.vehicles = results.slice(filmObservables.length, filmObservables.length + vehicleObservables.length);
          console.log(this.vehicles);
          
          this.starships = results.slice(filmObservables.length + vehicleObservables.length, filmObservables.length + vehicleObservables.length);
          console.log(this.starships);
          
          this.species = results.slice(filmObservables.length + vehicleObservables.length, filmObservables.length + vehicleObservables.length + speciesObservables.length);
          this.loading = false;
        });
      });
    }
  }
}
