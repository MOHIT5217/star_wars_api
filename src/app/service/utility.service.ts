import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Character } from '../interfaces/character';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private apiUrl = 'https://swapi.dev/api';
  constructor(private http: HttpClient) { }

  getPeople(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/people`).pipe(
      switchMap(response => {
        console.log(response);
        
        const characters = response.results;
        const speciesRequests = characters.map((character: any) => {
          if (character.species.length > 0) {
            return this.http.get(character.species[0]).pipe(
              map((speciesData: any) => ({
                ...character,
                speciesData,
                id: this.extractId(character.url)
              }))
            );
          } else {
            return of({
              ...character,
              speciesData: { name: 'Unknown' },
              id: this.extractId(character.url)
            });
          }
        });
        return forkJoin(speciesRequests);
      })
    );
  }


  getFilms(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/films`);
  }

  getSpecies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/species`);
  }

  getPerson(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/people/${id}`);
  }

  getFilm(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getVehicle(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getStarship(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  getSpeciesByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  extractId(url: string): string {
    const id = url.split('/').filter(segment => segment).pop();
    return id || '';
  }

  filterCharacters(filter: any): Observable<any[]> {
    return this.getPeople().pipe(
      map(characters => characters.filter((character: any) => {
        const matchesFilm = !filter.film || (character.films && character.films.includes(filter.film));
        const matchesSpecies = !filter.species || (character.species && character.species.includes(filter.species));
        const matchesBirthYear = (!filter.birthYearRange?.start || character.birth_year >= filter.birthYearRange.start) &&
          (!filter.birthYearRange?.end || character.birth_year <= filter.birthYearRange.end);
        return matchesFilm && matchesSpecies && matchesBirthYear;
      }))
    );
  }
}
