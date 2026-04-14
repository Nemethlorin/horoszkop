import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = 'Csillagjegy Kalkulator';
  protected readonly birthDate = signal('');
  protected readonly zodiacSign = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  private readonly apiBaseUrl = '.';

  constructor(private readonly http: HttpClient) {}

  protected onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.birthDate.set(input.value);
  }

  protected findSign(): void {
    if (!this.birthDate()) {
      this.error.set('Add meg a szuletesi datumodat.');
      this.zodiacSign.set('');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.zodiacSign.set('');

    this.http
      .get<{ sign: string }>(`${this.apiBaseUrl}/api/zodiac`, {
        params: { birthDate: this.birthDate() }
      })
      .subscribe({
        next: (response) => {
          this.zodiacSign.set(response.sign);
          this.loading.set(false);
        },
        error: (err) => {
          const message = err?.error?.error || 'Hiba tortent a lekeres soran.';
          this.error.set(message);
          this.loading.set(false);
        }
      });
  }
}
