export class UpdateEventDto {
  readonly name: string;
  readonly date: Date;
  readonly time: string;
  readonly description: string;
  readonly invites: string[];
}